import React, { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { isNonEmpty } from "../utils";

const mapColumns = (schema, data) => {
  const mappedColumns = data.map((row) => {
    let mappedRow = {};
    row.forEach((cell, index) => {
      const columnName = schema[index].title;
      mappedRow[columnName] = cell;
    });
    return mappedRow;
  });
  return mappedColumns;
};

const HotTableDefinition = ({ columns, onUpdate }) => {
  const [data, setData] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const mappedColumns = columns.map((c) => Object.values(c));
    setData(mappedColumns);
  }, [columns]);

  const tableDefinitionSchema = [
    {
      title: "title",
      type: "text",
      width: 200,
    },
    {
      title: "type",
      type: "dropdown",
      source: ["numeric", "text"],
      width: 200,
    },
    { title: "label", type: "text" },
  ];

  return (
    <HotTable
      licenseKey="non-commercial-and-evaluation"
      ref={tableRef}
      columns={tableDefinitionSchema}
      comments={true}
      stretchH="last"
      rowHeaders={true}
      minSpareRows={1}
      data={data}
      afterChange={(e) => {
        if (!!e) {
          var instance = tableRef.current.hotInstance;
          var column = instance.getDataAtCol(0);
          let valid = true;
          column.forEach(function (value, row) {
            let data = [...column];
            const index = data.indexOf(value);
            data.splice(index, 1);
            const secondIndex = data.indexOf(value);
            const cell = instance.getCellMeta(row, 0);
            if (
              index > -1 &&
              secondIndex > -1 &&
              !(value == null || value === "")
            ) {
              cell.valid = false;
              cell.comment = { value: "Error: Column names must be unique." };
              valid = false;
            } else if (!/^[a-zA-Z_]+[a-zA-Z0-9]*/.test(value) && !!value) {
              cell.valid = false;
              cell.comment = {
                value:
                  "Error: Column names must match SAS format - i.e. start with a letter or underscore, and contain only letters, numbers and underscores.",
              };
              valid = false;
            } else if (!value) {
              cell.valid = false;
              cell.comment = {
                value: "Error: Column names must not be blank.",
              };
              valid = false;
            } else {
              cell.valid = true;
              cell.comment = "";
            }
          });
          instance.render();
          if (valid) {
            const mappedColumns = mapColumns(
              tableDefinitionSchema,
              data.filter(isNonEmpty)
            );
            onUpdate(mappedColumns);
          }
        }
      }}
    />
  );
};

export default HotTableDefinition;
