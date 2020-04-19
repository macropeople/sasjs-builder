import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Table, Icon } from "semantic-ui-react";
import "./ServiceTable.scss";
import PopupIcon from "./PopupIcon";
import { produce } from "immer";
import { useCallback } from "react";
import ContextMenu from "./ContextMenu";

const ServiceTable = ({ table, onUpdate }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (table) {
      setColumns(table.columns);
      setRows(table.rows);
    }
  }, [table]);

  useEffect(() => {
    console.log("columns updated", columns);
  }, [columns]);

  const updateColumnName = useCallback(
    (columnIndex, newColumnName) => {
      const oldColumnName = columns[columnIndex].name;
      const newColumns = produce(columns, (draft) => {
        draft[columnIndex].name = newColumnName;
      });
      const newRows = produce(rows, (draft) => {
        draft.forEach((row) => {
          const cellValue = row[oldColumnName];
          delete row[oldColumnName];
          row[newColumnName] = cellValue;
        });
      });
      setColumns(newColumns);
      setRows(newRows);
      onUpdate({
        tableName: table.tableName,
        columns: newColumns,
        rows: newRows,
      });
    },
    [columns, rows, table.tableName, onUpdate]
  );

  const toggleColumnType = useCallback(
    (columnIndex) => {
      const newColumns = produce(columns, (draft) => {
        draft[columnIndex].numeric = !draft[columnIndex].numeric;
      });

      setColumns(newColumns);
      onUpdate({
        tableName: table.tableName,
        columns: newColumns,
        rows,
      });
    },
    [columns, rows, table.tableName, onUpdate]
  );

  const removeRow = useCallback(
    (index) => {
      const newRows = produce(rows, (draft) => {
        return draft.filter((_, i) => i !== index);
      });

      setRows(newRows);
      onUpdate({
        tableName: table.tableName,
        columns,
        rows: newRows,
      });
    },
    [columns, rows, table.tableName, onUpdate]
  );

  const removeColumn = useCallback(
    (columnIndex) => {
      const column = columns[columnIndex];
      const newColumns = produce(columns, (draft) => {
        return draft.filter((_, i) => i !== columnIndex);
      });
      setColumns(newColumns);
      const newRows = produce(rows, (draft) => {
        draft.forEach((row) => delete row[column.name]);
      });
      setRows(newRows);
      onUpdate({
        tableName: table.tableName,
        columns: newColumns,
        rows: newRows,
      });
    },
    [columns, rows, table.tableName, onUpdate]
  );

  const updateCell = useCallback(
    (columnName, rowIndex, value) => {
      const currentColumn = columns.find((c) => c.name === columnName);
      if (currentColumn.numeric) {
        if (Number.isNaN(Number(value))) {
          const newColumns = produce(columns, (draft) => {
            const column = draft.find((c) => c.name === columnName);
            column.numeric = false;
          });
          const newRows = produce(rows, (draft) => {
            draft.forEach((row) => (row[columnName] = `${row[columnName]}`));
          });
          setColumns(newColumns);
          setRows(newRows);
        } else {
          value = Number(value);
        }
      }
      const newRows = produce(rows, (draft) => {
        draft[rowIndex][columnName] = value;
      });
      setRows(newRows);
      onUpdate({
        tableName: table.tableName,
        columns,
        rows: newRows,
      });
    },
    [columns, rows, table.tableName, onUpdate]
  );

  const addColumn = useCallback(() => {
    const newColumnName = `Column${columns.length + 1}`;
    const newColumns = produce(columns, (draft) => {
      draft.push({ name: newColumnName, numeric: true });
      return draft;
    });

    const newRows = produce(rows, (draft) => {
      draft.forEach((row) => (row[newColumnName] = ""));
    });
    setColumns(newColumns);
    setRows(newRows);
    onUpdate({
      tableName: table.tableName,
      columns: newColumns,
      rows: newRows,
    });
  }, [columns, rows, table.tableName, onUpdate]);

  const addRow = useCallback(() => {
    const newRows = produce(rows, (draft) => {
      const row = {};
      columns.forEach((column) => {
        if (column.numeric) {
          row[column.name] = 0;
        } else {
          row[column.name] = "";
        }
      });
      draft.push(row);
    });
    setRows(newRows);
    onUpdate({
      tableName: table.tableName,
      columns,
      rows: newRows,
    });
  }, [columns, rows, table.tableName, onUpdate]);

  return (
    <div className="service-table-container">
      <div className="table-inner-container">
        <Table celled>
          <Table.Header>
            <Table.Row>
              {columns.map((column, index) => {
                return (
                  <Table.HeaderCell key={index}>
                    <div className="service-header-cell">
                      <ContentEditable
                        className="full-width"
                        html={`<div class="editable-cell">${column.name}</div>`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={false}
                        onBlur={(e) => {
                          const newColumnName = e.target.innerHTML
                            .replace(`<div class="editable-cell">`, "")
                            .replace("</div>", "");
                          updateColumnName(index, newColumnName);
                        }}
                      />
                      <ContextMenu
                        numeric={column.numeric}
                        onRemove={() => {
                          removeColumn(index);
                        }}
                        onChangeType={() => {
                          toggleColumnType(index);
                        }}
                      />
                    </div>
                  </Table.HeaderCell>
                );
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row, rowIndex) => {
              return (
                <>
                  <Table.Row key={rowIndex}>
                    {columns
                      .map((c) => c.name)
                      .map((columnName) => {
                        return (
                          <Table.Cell key={`${columnName}${rowIndex}`}>
                            <ContentEditable
                              html={`<div class="editable-cell">${row[columnName]}</div>`}
                              onClick={(e) => e.stopPropagation()}
                              disabled={false}
                              onBlur={(e) => {
                                const value = e.target.innerHTML
                                  .replace(`<div class="editable-cell">`, "")
                                  .replace("</div>", "");

                                updateCell(columnName, rowIndex, value);
                              }}
                            />
                          </Table.Cell>
                        );
                      })}
                  </Table.Row>
                  <Icon
                    name="trash alternate outline"
                    color="red"
                    className="icon-button"
                    onClick={() => removeRow(rowIndex)}
                  />
                </>
              );
            })}
          </Table.Body>
        </Table>
        <PopupIcon
          text="Add column"
          icon="add circle"
          color="blue"
          onClick={addColumn}
        />
      </div>
      <PopupIcon
        text="Add row"
        icon="add circle"
        color="blue"
        onClick={addRow}
      />
    </div>
  );
};

export default ServiceTable;
