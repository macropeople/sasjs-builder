import React, { useCallback, useState, useEffect, useRef } from "react";
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
  const columnNamevalidator = useCallback(
    (value, callback) => {
      const columnNames = columns.map((c) => c.title);
      callback(!columnNames.includes(value));
    },
    [columns]
  );

  useEffect(() => {
    const mappedColumns = columns.map((c) => Object.values(c));
    setData(mappedColumns);
  }, [columns]);

  const tableDefinitionSchema = [
    {
      title: "title",
      type: "text",
      validator: columnNamevalidator,
      allowEmpty: false,
    },
    {
      title: "type",
      type: "dropdown",
      source: ["numeric", "text"],
      allowEmpty: false,
    },
    { title: "label", type: "text" },
  ];

  return (
    <HotTable
      licenseKey="non-commercial-and-evaluation"
      ref={tableRef}
      columns={tableDefinitionSchema}
      stretchH="none"
      rowHeaders={true}
      colWidths={395}
      minSpareRows={5}
      data={data}
      afterValidate={(_, value, row, prop) => {
        if (prop === 0) {
          debugger;
          const columnNames = columns.map((c) => c.title);
          if (
            columnNames.includes(value) &&
            columnNames.indexOf(value) !== row
          ) {
            const cellMeta = tableRef.current.hotInstance.getCellMeta(
              row,
              prop
            );
            cellMeta.instance.setDataAtCell(row, prop, null);
            tableRef.current.hotInstance.render();
          }
        }
      }}
      afterChange={(e) => {
        if (!!e) {
          const mappedColumns = mapColumns(
            tableDefinitionSchema,
            data.filter(isNonEmpty)
          );
          onUpdate(mappedColumns);
        }
      }}
    />
  );
};

export default HotTableDefinition;
