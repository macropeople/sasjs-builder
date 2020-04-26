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
    },
    {
      title: "type",
      type: "dropdown",
      source: ["numeric", "text"],
    },
    { title: "label", type: "text" },
  ];

  return (
    <HotTable
      licenseKey="non-commercial-and-evaluation"
      ref={tableRef}
      columns={tableDefinitionSchema}
      comments={true}
      stretchH="none"
      rowHeaders={true}
      colWidths={395}
      minSpareRows={5}
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
              cell.comment = { value: "Error: No Duplicate Values allowed." };
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
