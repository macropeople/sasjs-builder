import React, { useCallback, useState, useEffect } from "react";
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
  const columnNamevalidator = useCallback(
    (value, callback) => {
      const columnNames = columns.map((c) => c.title);
      console.log("Validator call for value: ", value);
      callback(!columnNames.includes(value));
    },
    [columns]
  );

  useEffect(() => {
    const mappedColumns = columns.map((c) => Object.values(c));
    setData(mappedColumns);
  }, [columns]);

  const tableDefinitionSchema = [
    { title: "title", type: "text", validator: columnNamevalidator },
    { title: "type", type: "dropdown", source: ["numeric", "text"] },
    { title: "label", type: "text" },
  ];

  return (
    <HotTable
      licenseKey="non-commercial-and-evaluation"
      columns={tableDefinitionSchema}
      stretchH="none"
      rowHeaders={true}
      colWidths={395}
      minSpareRows={5}
      data={data}
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
