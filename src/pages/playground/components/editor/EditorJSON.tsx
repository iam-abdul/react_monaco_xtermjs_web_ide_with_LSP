import "@codingame/monaco-vscode-json-default-extension";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";

import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { useState, useEffect } from "react";

export const EditorComponentJSON = ({
  content,
  openFileName,
  language,
  updateFile,
}: {
  content: string;
  openFileName: string | undefined;
  language: string;
  updateFile: (openFileName: string | undefined, content: string) => void;
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
  return (
    <>
      {openFileName ? (
        <MonacoEditorReactComp
          userConfig={{
            wrapperConfig: {
              editorAppConfig: {
                $type: "extended",
                languageId: "json",
                code:
                  typeof content === "object"
                    ? JSON.stringify(content)
                    : content,
                useDiffEditor: false,
                codeUri: openFileName,
                userConfiguration: {
                  json: JSON.stringify({
                    "workbench.colorTheme": "Default Dark Modern",
                    "editor.guides.bracketPairsHorizontal": "active",
                    "editor.lightbulb.enabled": "On",
                  }),
                },
              },
            },
          }}
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
