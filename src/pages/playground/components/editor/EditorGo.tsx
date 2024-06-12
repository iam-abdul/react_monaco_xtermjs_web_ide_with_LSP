import "@codingame/monaco-vscode-go-default-extension";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import * as vscode from "vscode";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { useState, useEffect } from "react";
import { UserConfig } from "monaco-editor-wrapper";

export const EditorComponentJSON = ({
  content,
  openFileName,
  language,
  updateFile,
  instanceNumber,
}: {
  content: string;
  openFileName: string | undefined;
  language: string;
  updateFile: (openFileName: string | undefined, content: string) => void;
  instanceNumber: number;
}) => {
  console.log("the language is ", language);
  const [nowContent, setContent] = useState<string>(
    typeof content === "object" ? JSON.stringify(content) : content
  );
  useEffect(() => {
    console.log("now content type of ", typeof nowContent);
    if (typeof nowContent === "object") {
      updateFile(openFileName, JSON.stringify(nowContent));
    } else {
      updateFile(openFileName, nowContent);
    }
  }, [nowContent]);

  const onTextChanged = (newContent: string) => {
    setContent(newContent);
  };

  const userConfig: UserConfig = {
    languageClientConfig: {
      options: {
        name: "Golang language server example",
        $type: "WebSocket",
        host: "139.59.74.236",
        port: 80,
        path: "gopls",
        extraParams: {
          authorization: "UserAuth",
        },
        secured: false,
      },
      clientOptions: {
        documentSelector: ["go"],
        workspaceFolder: {
          index: 0,
          name: "workspaceTwo",
          uri: vscode.Uri.parse("/workspaceTwo"),
        },
      },
    },
    wrapperConfig: {
      editorAppConfig: {
        $type: "extended",
        languageId: "go",
        code: content,
        useDiffEditor: false,
        codeUri: openFileName,
        userConfiguration: {
          json: JSON.stringify({
            "workbench.colorTheme": "Default Dark Modern",
            // "editor.guides.bracketPairsHorizontal": "active",
            // "editor.lightbulb.enabled": "On",
            // "semanticHighlighting.enabled": true,
            // "editor.semanticHighlighting.enabled": true,
            "editor.semanticHighlighting.enabled": false,
          }),
        },
      },
    },
  };

  if (instanceNumber > 1) {
    delete userConfig.languageClientConfig;
  }

  return (
    <>
      {openFileName ? (
        <MonacoEditorReactComp
          userConfig={userConfig}
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

export default EditorComponentJSON;
