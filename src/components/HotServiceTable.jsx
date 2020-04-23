import React from "react";
import { HotTable } from "@handsontable/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./HotServiceTable.scss";
import produce from "immer";
import cloneDeep from "lodash.clonedeep";
import RenameColumnModal from "./RenameColumnModal";

const HotServiceTable = (props) => {
  const { table, onUpdate } = props;
  const { data, columns } = table;

  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [columnIndexToRename, setColumnIndexToRename] = useState(-1);
  const tableRef = useRef();

  useEffect(() => {
    setTableData(cloneDeep(data));
  }, [data]);

  useEffect(() => {
    setTableColumns(
      columns.map((c) => ({
        title: c.name,
        type: c.numeric ? "numeric" : "text",
      }))
    );
  }, [columns]);

  return (
    <div className="table-container">
      <HotTable
        ref={tableRef}
        licenseKey="non-commercial-and-evaluation"
        data={tableData}
        autoRowSize={true}
        afterChange={(e) => {
          if (!!e) {
            onUpdate({
              tableName: table.tableName,
              columns: tableColumns.map((t) => ({
                name: t.title,
                numeric: t.type === "numeric",
              })),
              data: tableData,
            });
          }
        }}
        autoColumnSize={true}
        manualColumnResize={true}
        manualRowResize={true}
        rowHeaders={true}
        columns={tableColumns}
        contextMenu={{
          items: {
            addColumn: {
              name: "Add column",
              callback: () => {
                setTimeout(() => {
                  const newColumns = produce(tableColumns, (draft) => {
                    draft.push({
                      title: `column${tableColumns.length}`,
                      type: "numeric",
                    });
                  });
                  const newData = produce(tableData, (draft) => {
                    draft.forEach((row) => row.push(null));
                  });
                  setTableColumns(newColumns);
                  setTableData(newData);
                  tableRef.current.hotInstance.updateSettings({
                    columns: newColumns,
                    data: newData,
                  });
                  onUpdate({
                    tableName: table.tableName,
                    columns: newColumns.map((t) => ({
                      name: t.title,
                      numeric: t.type === "numeric",
                    })),
                    data: newData,
                  });
                });
              },
            },
            row_below: {
              name: "Add row",
            },
            remove_row: {
              name: "Remove row",
            },
            removeColumn: {
              name: "Remove column",
              callback: (_, options) => {
                setTimeout(() => {
                  const columnIndex = options[0].end.col;
                  const newColumns = produce(tableColumns, (draft) => {
                    return draft.filter((_, index) => index !== columnIndex);
                  });
                  const newData = produce(tableData, (draft) => {
                    draft.forEach((row) => row.splice(columnIndex, 1));
                  });
                  setTableColumns(newColumns);
                  setTableData(newData);
                  tableRef.current.hotInstance.updateSettings({
                    columns: newColumns,
                    data: newData,
                  });
                  onUpdate({
                    tableName: table.tableName,
                    columns: newColumns.map((t) => ({
                      name: t.title,
                      numeric: t.type === "numeric",
                    })),
                    data: newData,
                  });
                });
              },
            },
            renameColumn: {
              name: "Rename column",
              callback: (key, options) => {
                setTimeout(() => {
                  const columnIndex = options[0].end.col;
                  setColumnIndexToRename(columnIndex);
                });
              },
            },
          },
        }}
      ></HotTable>
      {columnIndexToRename > -1 && (
        <RenameColumnModal
          columnName={tableColumns[columnIndexToRename].title}
          onRename={(newColumnName) => {
            const newColumns = produce(tableColumns, (draft) => {
              draft[columnIndexToRename].title = newColumnName;
            });
            setTableColumns(newColumns);
            onUpdate({
              tableName: table.tableName,
              columns: newColumns.map((t) => ({
                name: t.title,
                numeric: t.type === "numeric",
              })),
              data: tableData,
            });
          }}
        />
      )}
    </div>
  );
};

export default HotServiceTable;
