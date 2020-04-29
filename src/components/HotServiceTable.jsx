import React from "react";
import { HotTable } from "@handsontable/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "handsontable/dist/handsontable.full.css";
import "./HotServiceTable.scss";
import { produce } from "immer";
import EditColumnModal from "./EditColumnModal";
import {
  convertToHotTableFormat,
  convertToSasJsFormat,
  isNonEmpty,
} from "../utils";
import { Tab } from "semantic-ui-react";
import HotTableDefinition from "./HotTableDefinition";

const HotServiceTable = ({ table, onUpdate, isDarkMode, readOnly = false }) => {
  const { columns } = table;

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
    <>
      <Tab
        style={{ width: "100%" }}
        menu={{
          fluid: true,
          secondary: true,
          inverted: isDarkMode,
        }}
        panes={[
          {
            menuItem: "Table Definition",
            render: () => (
              <Tab.Pane inverted={isDarkMode}>
                <div
                  className={
                    isDarkMode ? "table-container inverted" : "table-container"
                  }
                >
                  <HotTableDefinition
                    columns={tableColumns}
                    readOnly={readOnly}
                    onUpdate={(newColumns) => {
                      setTableColumns(newColumns);
                      onUpdate({
                        tableName: table.tableName,
                        columns: newColumns,
                        data: convertToSasJsFormat([
                          {
                            columns: newColumns,
                            data: tableData.filter(isNonEmpty),
                            tableName: table.tableName,
                          },
                        ]),
                      });
                    }}
                  />
                </div>
              </Tab.Pane>
            ),
          },
          {
            menuItem: "Table Data",
            render: () => (
              <Tab.Pane inverted={isDarkMode}>
                <div
                  className={
                    isDarkMode ? "table-container inverted" : "table-container"
                  }
                >
                  <HotTable
                    ref={tableRef}
                    readOnly={readOnly}
                    licenseKey="non-commercial-and-evaluation"
                    data={tableData}
                    autoRowSize={true}
                    beforeKeyDown={(event) => {
                      if (!event.target.closest(".handsontableInput")) {
                        event.stopImmediatePropagation();
                      }
                    }}
                    stretchH="all"
                    afterChange={(e) => {
                      if (!!e) {
                        onUpdate({
                          tableName: table.tableName,
                          columns: tableColumns,
                          data: convertToSasJsFormat([
                            {
                              columns: tableColumns,
                              data: tableData.filter(isNonEmpty),
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
                    minSpareRows={1}
                    columns={tableColumns}
                    contextMenu={{
                      items: {
                        row_below: {
                          name: "Add row",
                          callback: () => {
                            setTimeout(() => {
                              const newData = produce(tableData, (draft) => {
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
                              const newData = produce(tableData, (draft) => {
                                return draft.filter(
                                  (_, index) => index !== rowIndex
                                );
                              });
                              setTableData(newData);
                              onUpdate({
                                tableName: table.tableName,
                                columns: tableColumns,
                                data: convertToSasJsFormat([
                                  {
                                    columns: tableColumns,
                                    data: newData.filter(isNonEmpty),
                                    tableName: table.tableName,
                                  },
                                ]),
                              });
                            });
                          },
                        },
                      },
                    }}
                  ></HotTable>
                </div>
              </Tab.Pane>
            ),
          },
        ]}
      ></Tab>

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
                  data: tableData.filter(isNonEmpty),
                  tableName: table.tableName,
                },
              ]),
            });
          }}
          onCancel={() => setColumnIndexToEdit(-1)}
        />
      )}
    </>
  );
};

export default HotServiceTable;
