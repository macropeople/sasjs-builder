import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Table, Checkbox, Icon } from "semantic-ui-react";
import "./ServiceTable.scss";
import PopupIcon from "./PopupIcon";
import { produce } from "immer";

const ServiceTable = ({ table, onUpdate }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (table) {
      setColumns(table.columns);
      setRows(table.rows);
    }
  }, [table]);

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
                        className="semi-width"
                        html={`<div class="editable-cell">${column.name}</div>`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={false}
                        onBlur={(e) => {
                          const oldColumnName = columns[index].name;
                          const newColumnName = e.target.innerHTML
                            .replace(`<div class="editable-cell">`, "")
                            .replace("</div>", "");
                          const newColumns = produce(columns, (draft) => {
                            draft[index].name = newColumnName;
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
                        }}
                      />
                      <Checkbox
                        toggle
                        checked={column.numeric}
                        onChange={() => {
                          const newColumn = produce(column, (draft) => {
                            draft.numeric = !column.numeric;
                            return draft;
                          });

                          const newColumns = produce(columns, (draft) => {
                            draft[index] = newColumn;
                            return draft;
                          });
                          setColumns(newColumns);
                          onUpdate({
                            tableName: table.tableName,
                            columns: newColumns,
                            rows,
                          });
                        }}
                      />
                      <Icon
                        name="trash alternate outline"
                        color="red"
                        onClick={() => {
                          const newColumns = produce(columns, (draft) => {
                            return draft.filter((_, i) => i !== index);
                          });
                          setColumns(newColumns);
                          const newRows = produce(rows, (draft) => {
                            draft.forEach((row) => delete row[column.name]);
                            return draft;
                          });
                          setRows(newRows);
                          onUpdate({
                            tableName: table.tableName,
                            columns: newColumns,
                            rows: newRows,
                          });
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
              const columnNames = columns.map((c) => c.name);
              const sortedColumnNames = Object.keys(row).sort(
                (a, b) => columnNames.indexOf(a) - columnNames.indexOf(b)
              );
              return (
                <Table.Row key={rowIndex}>
                  {sortedColumnNames.map((columnName) => {
                    return (
                      <Table.Cell key={`${columnName}${rowIndex}`}>
                        <ContentEditable
                          html={`<div class="editable-cell">${row[columnName]}</div>`}
                          onClick={(e) => e.stopPropagation()}
                          disabled={false}
                          onBlur={(e) => {
                            let value = e.target.innerHTML
                              .replace(`<div class="editable-cell">`, "")
                              .replace("</div>", "");
                            if (
                              columns.find((c) => c.name === columnName).numeric
                            ) {
                              value = Number(value);
                              if (Number.isNaN(value)) {
                                value = null;
                              }
                            }
                            const newRows = produce(rows, (draft) => {
                              draft[rowIndex][columnName] = value;
                              return draft;
                            });
                            setRows(newRows);
                            onUpdate({
                              tableName: table.tableName,
                              columns,
                              rows: newRows,
                            });
                          }}
                        />
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <PopupIcon
          text="Add column"
          icon="add circle"
          color="blue"
          onClick={() => {
            const newColumnName = `Column${columns.length + 1}`;
            const newColumns = produce(columns, (draft) => {
              draft.push({ name: newColumnName, numeric: false });
              return draft;
            });

            const newRows = produce(rows, (draft) => {
              draft.forEach((row) => (row[newColumnName] = ""));
              return draft;
            });
            setColumns(newColumns);
            setRows(newRows);
            onUpdate({
              tableName: table.tableName,
              columns: newColumns,
              rows: newRows,
            });
          }}
        />
      </div>
    </div>
  );
};

export default ServiceTable;
