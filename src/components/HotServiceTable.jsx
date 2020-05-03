import React, { useReducer, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { useRef } from "react";
import "handsontable/dist/handsontable.full.css";
import "./HotServiceTable.scss";
import { produce } from "immer";
import { convertToHotTableFormat, convertToSasJsFormat } from "../utils";
import { Tab, Button, Icon } from "semantic-ui-react";
import HotTableDefinition from "./HotTableDefinition";

const ServiceTableReducer = (state, action) => {
  switch (action.type) {
    case "initialise": {
      const newState = {
        tableName: action.tableName,
        data: convertToHotTableFormat({
          columns: action.columns,
          data: action.data,
        }),
        columns: [...action.columns],
      };

      if (!newState.data.length) {
        const emptyRow = newState.columns.map(() => null);
        newState.data.push(emptyRow);
      }

      return newState;
    }
    case "updateDefinition": {
      action.callback({
        tableName: state.tableName,
        columns: [...action.columns],
        data: convertToSasJsFormat([
          {
            columns: action.columns,
            data: state.data,
            tableName: state.tableName,
          },
        ]),
      });
      return {
        ...state,
        columns: [...action.columns],
      };
    }
    case "updateData": {
      action.callback({
        tableName: state.tableName,
        columns: state.columns,
        data: convertToSasJsFormat([
          {
            columns: state.columns,
            data: action.data,
            tableName: state.tableName,
          },
        ]),
      });
      return {
        ...state,
        data: [...action.data],
      };
    }
    case "addDataRow": {
      const newData = produce(state.data, (draft) => {
        const newRow = [];
        state.columns.forEach(() => newRow.push(null));
        draft.push(newRow);
      });
      action.callback({
        tableName: state.tableName,
        columns: state.columns,
        data: convertToSasJsFormat([
          {
            columns: state.columns,
            data: newData,
            tableName: state.tableName,
          },
        ]),
      });
      return {
        ...state,
        data: [...newData],
      };
    }
    case "removeDataRow": {
      const newData = produce(state.data, (draft) => {
        return draft.filter((_, index) => index !== action.rowIndex);
      });
      action.callback({
        tableName: state.tableName,
        columns: state.columns,
        data: convertToSasJsFormat([
          {
            columns: state.columns,
            data: newData,
            tableName: state.tableName,
          },
        ]),
      });
      return {
        ...state,
        data: [...newData],
      };
    }
    default:
      return state;
  }
};

const HotServiceTable = ({ table, onUpdate, isDarkMode, readOnly = false }) => {
  const { columns, data } = table;

  const [state, dispatch] = useReducer(ServiceTableReducer, {
    data,
    columns,
    tableName: table ? table.tableName : "",
  });
  const tableRef = useRef();

  useEffect(() => {
    dispatch({
      type: "initialise",
      ...table,
    });
  }, [table]);

  return (
    <Tab
      renderActiveOnly={true}
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
              <HotTableDefinition
                columns={state.columns}
                readOnly={readOnly}
                isDarkMode={isDarkMode}
                onUpdate={(newColumns) => {
                  dispatch({
                    type: "updateDefinition",
                    columns: newColumns,
                    callback: onUpdate,
                  });
                }}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: "Table Data",
          render: () => (
            <Tab.Pane inverted={isDarkMode}>
              <div className="save-icon">
                <Button
                  primary
                  onClick={() => {
                    tableRef.current.hotInstance.validateCells((valid) => {
                      if (valid) {
                        onUpdate({
                          ...state,
                          data: convertToSasJsFormat([
                            {
                              columns: state.columns,
                              data: state.data,
                              tableName: state.tableName,
                            },
                          ]),
                        });
                      }
                    });
                  }}
                >
                  <Icon name="save"></Icon>
                  {"  "}Save table data
                </Button>
                <Button
                  secondary
                  onClick={() =>
                    dispatch({
                      type: "addDataRow",
                      callback: onUpdate,
                    })
                  }
                >
                  <Icon name="add"></Icon>
                  {"  "} Add row
                </Button>
              </div>
              <div
                className={
                  isDarkMode ? "table-container inverted" : "table-container"
                }
              >
                <HotTable
                  ref={tableRef}
                  readOnly={readOnly}
                  licenseKey="non-commercial-and-evaluation"
                  data={state.data}
                  autoRowSize={true}
                  autoColumnSize={true}
                  manualColumnResize={true}
                  manualRowResize={true}
                  rowHeaders={true}
                  stretchH="all"
                  columns={state.columns}
                  contextMenu={{
                    items: {
                      row_below: {
                        name: "Add row",
                        callback: () => {
                          setTimeout(() => {
                            dispatch({
                              type: "addDataRow",
                              callback: onUpdate,
                            });
                          });
                        },
                      },
                      remove_row: {
                        name: "Remove row",
                        callback: (_, options) => {
                          setTimeout(() => {
                            const rowIndex = options[0].end.row;
                            dispatch({
                              type: "removeDataRow",
                              rowIndex,
                              callback: onUpdate,
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
  );
};

export default React.memo(HotServiceTable);
