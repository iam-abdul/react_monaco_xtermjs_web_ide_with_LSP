import PythonEditor from "./EditorPython";
import JSONEditor from "./EditorJSON";
import axios from "axios";
import GOEditor from "./EditorGo";

function convertToString(input: string) {
  try {
    // Attempt to parse the input as JSON
    const parsed = JSON.parse(input);
    // If successful, stringify the parsed object
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    // If parsing fails, stringify the original input
    return `"${input}"`;
  }
}
const updateFile = async (fileName: string | undefined, content: string) => {
  try {
    console.log("update file", fileName, content);
    if (!fileName || fileName === "") {
      return;
    }

    let fileContent = content;

    const url =
      "http://139.59.74.236:80/" + fileName.split("/home/damer/").pop();
    if (fileName.slice(-5) === ".json") {
      fileContent = convertToString(content);
    }

    const response = await axios.put(url, { content: fileContent });

    console.log("update ", response);

    return;
  } catch (err) {
    console.log(err);
  }
};

const EditorMain = ({
  content,
  openFileName,
  language,
  instanceNumber,
  filePath,
}: {
  content: string;
  openFileName: string | undefined;
  language: string;
  instanceNumber: number;
  filePath: string;
}) => {
  console.log("the language in main editor is ", language);

  if (language === "python") {
    return (
      <PythonEditor
        instanceNumber={instanceNumber}
        content={content}
        openFileName={openFileName}
        language={language}
        updateFile={updateFile}
        filePath={filePath}
      />
    );
  } else if (language === "json") {
    return (
      <JSONEditor
        updateFile={updateFile}
        content={content}
        openFileName={openFileName}
        language={language}
      />
    );
  } else if (language === "go") {
    return (
      <GOEditor
        updateFile={updateFile}
        content={content}
        openFileName={openFileName}
        language={language}
        instanceNumber={instanceNumber}
      />
    );
  } else {
    return (
      <JSONEditor
        updateFile={updateFile}
        content={content}
        openFileName={openFileName}
        language={language}
      />
    );
  }
};

export default EditorMain;
