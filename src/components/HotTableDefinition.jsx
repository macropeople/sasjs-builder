import React, { useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { isNonEmpty } from "../utils";
import { Icon, Button } from "semantic-ui-react";
import { produce } from "immer";
import { useReducer } from "react";
import cloneDeep from "lodash.clonedeep";

const mapColumns = (schema, data) => {
  const mappedColumns = data.map((row) => {
    let mappedRow = {};
    row.forEach((cell, index) => {
      const columnName = schema[index].name;
      mappedRow[columnName] = cell;
    });
    return mappedRow;
  });
  return mappedColumns;
};

const TableDefinitionReducer = (state, action) => {
  switch (action.type) {
    case "initialise": {
      return {
        data: [...action.columns.map((c) => Object.values(c))],
        tableDefinitionSchema: [
          {
            title: "Name",
            name: "title",
            type: "text",
            width: 200,
          },
          {
            title: "Type",
            name: "type",
            allowInvalid: false,
            type: "dropdown",
            source: ["numeric", "text"],
            width: 200,
            renderer: function (instance, td, row, col, prop, value) {
              if (value === null) {
                td.innerHTML = '<div class="htAutocompleteArrow">▼</div>text';
                instance.setDataAtCell(row, col, "text");
              } else {
                td.innerHTML = `<div class="htAutocompleteArrow">▼</div>${value}`;
              }
            },
          },
          { title: "Label", name: "label", type: "text" },
        ],
      };
    }
    case "addRow": {
      const newData = produce(state.data, (draft) => {
        draft.push([null, "text", null]);
      });
      return {
        ...state,
        data: [...cloneDeep(newData)],
      };
    }
    case "removeRow": {
      const newData = produce(state.data, (draft) => {
        return draft.filter((_, index) => index !== action.rowIndex);
      });

      return {
        ...state,
        data: [...newData],
      };
    }
    case "saveData": {
      const column = action.tableInstance.getDataAtCol(0);
      let valid = true;
      column.forEach(function (value, row) {
        let data = [...column];
        const index = data.indexOf(value);
        data.splice(index, 1);
        const secondIndex = data.indexOf(value);
        const cell = action.tableInstance.getCellMeta(row, 0);
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
        } else {
          cell.valid = true;
          cell.comment = "";
        }
      });
      action.tableInstance.render();
      if (valid) {
        const mappedColumns = mapColumns(
          state.tableDefinitionSchema,
          state.data.filter((d) => isNonEmpty(d) && !!d[0])
        );
        action.callback(mappedColumns);
      }
      return state;
    }
    default:
      return state;
  }
};

const HotTableDefinition = ({ columns, onUpdate, readOnly, isDarkMode }) => {
  const [state, dispatch] = useReducer(TableDefinitionReducer, {
    data: [],
    tableDefinitionSchema: [],
  });
  const tableRef = useRef();

  useEffect(() => {
    dispatch({ type: "initialise", columns });
  }, [columns]);

  return (
    <>
      <div
        className={isDarkMode ? "table-container inverted" : "table-container"}
      >
        <HotTable
          licenseKey="non-commercial-and-evaluation"
          ref={tableRef}
          readOnly={readOnly}
          columns={state.tableDefinitionSchema}
          comments={true}
          stretchH="last"
          rowHeaders={true}
          data={state.data}
          contextMenu={{
            items: {
              row_below: {
                name: "Add row",
                callback: () => {
                  setTimeout(() => {
                    dispatch({ type: "addRow" });
                  });
                },
              },
              removeRow: {
                name: "Remove row",
                callback: (_, options) => {
                  setTimeout(() => {
                    const rowIndex = options[0].end.row;
                    dispatch({
                      type: "removeRow",
                      rowIndex,
                    });
                  });
                },
              },
            },
          }}
        />
      </div>
      <div className="save-icon">
        <Button
          primary
          onClick={() => {
            dispatch({
              type: "saveData",
              callback: onUpdate,
              tableInstance: tableRef.current.hotInstance,
            });
          }}
        >
          <Icon name="save"></Icon>
          {"  "}Save table definition
        </Button>
        <Button secondary onClick={() => dispatch({ type: "addRow" })}>
          <Icon name="add"></Icon>
          {"  "} Add row
        </Button>
      </div>
    </>
  );
};

export default React.memo(HotTableDefinition);
