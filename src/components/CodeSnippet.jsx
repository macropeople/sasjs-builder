import React, { useState, useEffect } from "react";
import Highlight from "react-highlight.js";
import { toast } from "react-semantic-toasts";
import "./CodeSnippet.scss";
import { Header, Icon, Popup } from "semantic-ui-react";

const CodeSnippet = ({ path, serviceName, requestTables, responseTables }) => {
  const [snippet, setSnippet] = useState("");
  useEffect(() => {
    let codeSnippet = `const sasJs = new SASjs({/* Your config here */});\n\nsasJs.request("${path}/${serviceName}"`;
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
              name="copy outline"
              className="icon-button"
              color="blue"
              onClick={() => {
                navigator.clipboard.writeText(snippet).then(() => {
                  toast({
                    type: "success",
                    icon: "copy outline",
                    title: "Code snippet copied",
                    description:
                      "Paste into your text editor and get started with SASjs!",
                    time: 2000
                  });
                });
              }}
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