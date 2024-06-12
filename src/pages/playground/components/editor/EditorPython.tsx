import "monaco-editor/esm/vs/basic-languages/javascript/javascript";
import "@codingame/monaco-vscode-python-default-extension";
import "@codingame/monaco-vscode-json-default-extension";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { createUserConfig } from "./config";

import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { useState, useEffect } from "react";

const EditorComponent = ({
  content,
  openFileName,
  language,
  updateFile,
  instanceNumber,
  filePath,
}: {
  content: string;
  openFileName: string | undefined;
  language: string;
  updateFile: (openFileName: string | undefined, content: string) => void;
  instanceNumber: number;
  filePath: string;
}) => {
  console.log("the language is ", language);
  const [nowContent, setContent] = useState<string>(content);
  useEffect(() => {
    updateFile(filePath, nowContent);

    // console.log(
    //   "open file " + openFileName + " content inside effect ",
    //   nowContent
    // );
  }, [nowContent]);

  const onTextChanged = (newContent: string) => {
    setContent(newContent);
  };
  return (
    <>
      {openFileName ? (
        <MonacoEditorReactComp
          userConfig={createUserConfig(
            "/workspace",
            content,
            "/workspace/" + openFileName,
            instanceNumber
          )}
          style={{
            paddingTop: "5px",
            height: "100%",
          }}
          onTextChanged={(content: string) => {
            onTextChanged(content);
          }}
          onLoad={(wrapper: MonacoEditorLanguageClientWrapper) => {
            console.log(
              `Loaded the the ${wrapper.reportStatus().join("\n").toString()}`
            );
          }}
          onError={(e) => {
            console.error("from here ", e);
          }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default EditorComponent;
