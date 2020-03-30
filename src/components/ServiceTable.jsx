import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Header, Table, Checkbox, Icon } from "semantic-ui-react";

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
    <div>
      <Header as="h3" content={table.tableName} />
      <Table celled>
        <Table.Header>
          <Table.Row>
            {columns.map((column, index) => {
              return (
                <Table.HeaderCell key={column.name}>
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
                      }}
                    />
                    <Icon
                      name="trash alternate outline"
                      color="red"
                      onClick={() => {
                        const updatedColumns = [
                          ...columns.filter(c => c.name !== column.name)
                        ];
                        setColumns(updatedColumns);
                        const updatedRows = [...rows];
                        updatedRows.forEach(row => delete row[column.name]);
                        setRows(updatedRows);
                      }}
                    />
                  </div>
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row, index) => {
            const columnNames = columns.map(c => c.name);
            const sortedColumnNames = Object.keys(row).sort(
              (a, b) => columnNames.indexOf(a) - columnNames.indexOf(b)
            );
            return (
              <Table.Row key={index}>
                {sortedColumnNames.map(columnName => {
                  return (
                    <Table.Cell key={row[columnName]}>
                      <ContentEditable
                        html={`<div class="editable-cell">${row[columnName]}</div>`}
                        disabled={false}
                        onKeyDown={e => {
                          if (e.keyCode === 13) {
                            const value = e.target.innerHTML
                              .replace(`<div class="editable-cell">`, "")
                              .replace("</div>", "");
                            const newRows = [...rows];
                            newRows[index][columnName] = value;
                            setRows(newRows);
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
    </div>
  );
};

export default ServiceTable;
