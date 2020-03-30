import React from "react";
import ContentEditable from "react-contenteditable";
import { Header, Table, Checkbox, Icon } from "semantic-ui-react";

const ServiceTable = ({ table }) => {
  return (
    <div>
      <Header as="h3" content={table.tableName} />
      <Table celled collapsing>
        <Table.Header>
          <Table.Row>
            {table.columns.map(column => {
              return (
                <Table.HeaderCell key={column.name}>
                  <div className="service-header-cell">
                    <ContentEditable
                      className="half-width"
                      html={`<div class="editable-cell">${column.name}</div>`}
                      disabled={false}
                      onChange={() => {}}
                    />
                    <Checkbox toggle checked={column.numeric} />
                    <Icon name="trash alternate outline" color="red" />
                  </div>
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {table.rows.map((row, index) => {
            const columnNames = table.columns.map(c => c.name);
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
                        onChange={() => {}}
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
