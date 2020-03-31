import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Header, Table, Checkbox, Icon, Popup } from "semantic-ui-react";
import "./ServiceTable.scss";

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
      <Header as="h3" content={table.tableName} />
      <div className="table-inner-container">
        <Table celled>
          <Table.Header>
            <Table.Row>
              {columns.map((column, index) => {
                return (
                  <Table.HeaderCell key={index}>
                    <div className="service-header-cell">
                      <ContentEditable
                        className="half-width"
                        html={`<div class="editable-cell">${column.name}</div>`}
                        disabled={false}
                        onKeyDown={e => {
                          if (e.keyCode === 13) {
                            const value = e.target.innerHTML
                              .replace(`<div class="editable-cell">`, "")
                              .replace("</div>", "");
                            const newColumns = [...columns];
                            newColumns[index] = {
                              name: value,
                              numeric: newColumns[index].numeric
                            };
                            setColumns(newColumns);
                            onUpdate({
                              tableName: table.tableName,
                              columns: newColumns,
                              rows
                            });
                          }
                        }}
                      />
                      <Checkbox
                        toggle
                        checked={column.numeric}
                        onChange={() => {
                          const newColumn = { ...column };
                          newColumn.numeric = !newColumn.numeric;
                          const updatedColumns = [...columns];
                          updatedColumns[index] = newColumn;
                          setColumns(updatedColumns);
                          onUpdate({
                            tableName: table.tableName,
                            columns: updatedColumns,
                            rows
                          });
                        }}
                      />
                      <Icon
                        name="trash alternate outline"
                        color="red"
                        onClick={() => {
                          const updatedColumns = [
                            ...columns.filter((_, i) => i !== index)
                          ];
                          setColumns(updatedColumns);
                          const updatedRows = [...rows];
                          updatedRows.forEach(row => delete row[column.name]);
                          setRows(updatedRows);
                          onUpdate({
                            tableName: table.tableName,
                            columns: updatedColumns,
                            rows: updatedRows
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
              const columnNames = columns.map(c => c.name);
              const sortedColumnNames = Object.keys(row).sort(
                (a, b) => columnNames.indexOf(a) - columnNames.indexOf(b)
              );
              return (
                <Table.Row key={rowIndex}>
                  {sortedColumnNames.map(columnName => {
                    return (
                      <Table.Cell key={`${columnName}${rowIndex}`}>
                        <ContentEditable
                          html={`<div class="editable-cell">${row[columnName]}</div>`}
                          disabled={false}
                          onKeyDown={e => {
                            if (e.keyCode === 13) {
                              const value = e.target.innerHTML
                                .replace(`<div class="editable-cell">`, "")
                                .replace("</div>", "");
                              const newRows = [...rows];
                              newRows[rowIndex][columnName] = value;
                              setRows(newRows);
                              onUpdate({
                                tableName: table.tableName,
                                columns,
                                rows: newRows
                              });
                            }
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
        <Popup
          inverted
          content="Add column"
          trigger={
            <Icon
              name="add circle"
              className="icon-button"
              color="blue"
              onClick={() => {
                const currentColumns = [...columns];
                const newColumnName = `Column${columns.length + 1}`;
                currentColumns.push({ name: newColumnName, numeric: false });
                const currentRows = [...rows];
                currentRows.forEach(row => (row[newColumnName] = ""));
                setColumns(currentColumns);
                setRows(currentRows);
                onUpdate({
                  tableName: table.tableName,
                  columns: currentColumns,
                  rows: currentRows
                });
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default ServiceTable;
