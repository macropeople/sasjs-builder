import React, { useState, useEffect } from "react";
import Highlight from "react-highlight.js";
import "./CodeSnippet.scss";

const CodeSnippet = ({ path, serviceName, requestTables, responseTables }) => {
  const [snippet, setSnippet] = useState("");
  useEffect(() => {
    let codeSnippet = `SASjs.request("${path}/${serviceName}"`;
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
    }

    setSnippet(codeSnippet);
  }, [path, requestTables, responseTables, serviceName]);

  return (
    <Highlight language="javascript" className="code-snippet">
      {snippet}
    </Highlight>
  );
};

export default CodeSnippet;
