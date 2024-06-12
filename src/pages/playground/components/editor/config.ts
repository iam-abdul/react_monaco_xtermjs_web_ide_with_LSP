import * as vscode from "vscode";
import "@codingame/monaco-vscode-python-default-extension";
import { UserConfig } from "monaco-editor-wrapper";

export const createUserConfig = (
  workspaceRoot: string,
  code: string,
  codeUri: string,
  instanceNumber: number
): UserConfig => {
  const returnObj: UserConfig = {
    languageClientConfig: {
      options: {
        name: "Python Language Server Example",
        $type: "WebSocket",
        host: "139.59.74.236",
        port: 80,
        path: "pyright",
        extraParams: {
          authorization: "UserAuth",
        },
        secured: false,
      },
      clientOptions: {
        documentSelector: ["python"],
        workspaceFolder: {
          index: 0,
          name: "workspace",
          uri: vscode.Uri.parse(workspaceRoot),
        },
      },
    },
    wrapperConfig: {
      editorAppConfig: {
        $type: "extended",
        languageId: "python",
        code,
        codeUri,
        extensions: [],
        userConfiguration: {
          json: JSON.stringify({
            "workbench.colorTheme": "Default Dark Modern",
          }),
        },
        useDiffEditor: false,
      },
    },
    loggerConfig: {
      enabled: true,
      debugEnabled: true,
    },
  };

  if (instanceNumber > 1) {
    delete returnObj.languageClientConfig;
  }

  return returnObj;
};
