import React, { useState, useEffect } from "react";
import Highlight from "react-highlight.js";
import "./CodeSnippet.scss";
import { Header, Icon, Popup } from "semantic-ui-react";

const CodeSnippet = ({ path, serviceName, requestTables, responseTables }) => {
  const [snippet, setSnippet] = useState("");
  useEffect(() => {
    let codeSnippet = `const sasjs = new SASjs({/* Your config here */});\n\nsasjs.request("${path}/${serviceName}"`;
    if (requestTables.length) {
      codeSnippet += `,\n${JSON.stringify(
        [...requestTables.map(r => r.rows)],
        null,
        1
      )})`;
    } else {
      codeSnippet += ")";
    }

    codeSnippet += "\n.then(";

    if (responseTables.length) {
      codeSnippet += `res => {\n    console.log(res);\n/* Response Format\n${JSON.stringify(
        [...responseTables.map(r => r.rows)],
        null,
        1
      )}\n*/\n});`;
    } else {
      codeSnippet += "() => {\n    /* Your logic here */\n}";
    }

    setSnippet(codeSnippet);
  }, [path, requestTables, responseTables, serviceName]);

  return (
    <>
      <Header as="h3" className="tables-header">
        <code>SASjs</code> Code Snippet
        <Popup
          inverted
          content="Copy snippet"
          trigger={
            <Icon
              name="copy"
              className="icon-button"
              color="blue"
              onClick={() => {}}
            />
          }
        />
      </Header>
      <Highlight language="javascript" className="code-snippet">
        {snippet}
      </Highlight>
    </>
  );
};

export default CodeSnippet;
