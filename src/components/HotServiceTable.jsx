import React from "react";
import { HotTable } from "@handsontable/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./HotServiceTable.scss";
import produce from "immer";
import EditColumnModal from "./EditColumnModal";
import {
  clearAllSelections,
  convertToHotTableFormat,
  convertToSasJsFormat,
} from "../utils";

const HotServiceTable = (props) => {
  const { table, onUpdate, isDarkMode } = props;
  const { data, columns } = table;

  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [columnIndexToEdit, setColumnIndexToEdit] = useState(-1);
  const tableRef = useRef();

  useEffect(() => {
    setTableData(convertToHotTableFormat(table));
  }, [table]);

  useEffect(() => {
    setTableColumns(columns);
  }, [columns]);

  return (
    <div
      className={isDarkMode ? "table-container inverted" : "table-container"}
    >
      <HotTable
        ref={tableRef}
        licenseKey="non-commercial-and-evaluation"
        data={tableData}
        autoRowSize={true}
        beforeKeyDown={(event) => {
          if (!event.target.closest(".handsontableInput")) {
            event.stopImmediatePropagation();
          }
        }}
        stretchH="all"
        minSpareRows={5}
        afterChange={(e) => {
          if (!!e) {
            onUpdate({
              tableName: table.tableName,
              columns: tableColumns,
              data: convertToSasJsFormat([
                {
                  columns: tableColumns,
                  data: tableData,
                  tableName: table.tableName,
                },
              ]),
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
                      title: `column${tableColumns.length + 1}`,
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
                    columns: newColumns,
                    data: convertToSasJsFormat([
                      {
                        columns: newColumns,
                        data: newData,
                        tableName: table.tableName,
                      },
                    ]),
                  });
                });
              },
            },
            row_below: {
              name: "Add row",
              callback: () => {
                setTimeout(() => {
                  const newData = produce(data, (draft) => {
                    const newRow = [];
                    tableColumns.forEach(() => newRow.push(null));
                    draft.push(newRow);
                  });
                  setTableData(newData);
                  onUpdate({
                    tableName: table.tableName,
                    columns: tableColumns,
                    data: convertToSasJsFormat([
                      {
                        columns: tableColumns,
                        data: newData,
                        tableName: table.tableName,
                      },
                    ]),
                  });
                });
              },
            },
            remove_row: {
              name: "Remove row",
              callback: (_, options) => {
                setTimeout(() => {
                  const rowIndex = options[0].end.row;
                  const newData = produce(data, (draft) => {
                    return draft.filter((_, index) => index !== rowIndex);
                  });
                  setTableData(newData);
                  onUpdate({
                    tableName: table.tableName,
                    columns: tableColumns,
                    data: convertToSasJsFormat([
                      {
                        columns: tableColumns,
                        data: newData,
                        tableName: table.tableName,
                      },
                    ]),
                  });
                });
              },
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
                    columns: newColumns,
                    data: convertToSasJsFormat([
                      {
                        columns: newColumns,
                        data: newData,
                        tableName: table.tableName,
                      },
                    ]),
                  });
                });
              },
            },
            renameColumn: {
              name: "Edit column",
              callback: (_, options) => {
                setTimeout(() => {
                  const columnIndex = options[0].end.col;
                  clearAllSelections();
                  setColumnIndexToEdit(columnIndex);
                });
              },
            },
          },
        }}
      ></HotTable>
      {columnIndexToEdit > -1 && (
        <EditColumnModal
          columns={tableColumns}
          columnIndexToEdit={columnIndexToEdit}
          onEdit={(newColumn) => {
            const newColumns = produce(tableColumns, (draft) => {
              draft[columnIndexToEdit].title = newColumn.title;
              draft[columnIndexToEdit].type = newColumn.type;
            });
            setTableColumns(newColumns);
            setColumnIndexToEdit(-1);
            onUpdate({
              tableName: table.tableName,
              columns: newColumns,
              data: convertToSasJsFormat([
                {
                  columns: newColumns,
                  data: tableData,
                  tableName: table.tableName,
                },
              ]),
            });
          }}
          onCancel={() => setColumnIndexToEdit(-1)}
        />
      )}
    </div>
  );
};

export default HotServiceTable;
