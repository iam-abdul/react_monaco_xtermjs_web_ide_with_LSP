import classes from "./playground.module.css";
// import { FaPlay } from "react-icons/fa";
// import { LuGitFork } from "react-icons/lu";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import Split from "@uiw/react-split";
import Explorer from "./components/explorer/Explorer.js";
import { Fragment, useEffect, useState } from "react";
import { FolderStructure } from "./components/explorer/Explorer.js";
import EditorMain from "./components/editor/MainEditor.js";
import GetIconForFile from "./components/icons/Icons.js";
import { IoClose } from "react-icons/io5";
import DragDropArea from "./components/icons/DragDropArea.js";

import Terminal from "./components/terminal/Terminal.jsx";
// import EditorComponent from "./components/editor/Editor.js";

export interface IOpenFile {
  name: string;
  content: string;
  path: string;
  active: boolean;
}

const getLanguageForFile = (fileName: string) => {
  const extension = fileName.split(".")[fileName.split(".").length - 1];
  if (extension === "py") {
    return "python";
  }
  if (extension === "go") {
    return "go";
  }
  if (extension === "json") {
    return "json";
  }
  return "python";
};

const Playground = () => {
  const [files, setFiles] = useState<FolderStructure[]>([]);
  const [openFiles, setOpenFiles] = useState<IOpenFile[]>([]);
  const [showExplorer, setShowExplorer] = useState<boolean>(true);
  const [draggedFile, setDraggedFile] = useState<IOpenFile | null>(null);
  console.log("dragged file is", draggedFile);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://139.59.74.236:80/terminal");
    ws.onopen = () => {
      console.log("connected");
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  const setOpenFileHandler = (file: IOpenFile) => {
    const newFiles = openFiles.map((f) => {
      let toReturn;

      if (file.path === f.path) {
        toReturn = { ...f, active: true };
      } else {
        toReturn = { ...f, active: false };
      }

      return toReturn;
    });

    if (newFiles.length === 0 || !newFiles.find((f) => f.path === file.path)) {
      newFiles.push(file);
    }

    setOpenFiles([]);
    setOpenFiles(newFiles);
    console.log("open files are", openFiles);
  };

  const onDropFile = (index: number) => {
    if (!draggedFile) {
      return;
    }

    setOpenFiles((prev) => {
      // Find the file in the list and remove it if it exists
      const existingFileIndex = prev.findIndex(
        (f) => f.path === draggedFile.path
      );
      if (existingFileIndex !== -1) {
        prev.splice(existingFileIndex, 1);
      }

      if (existingFileIndex !== -1) {
        // left side of rearranged file
        if (index < existingFileIndex) {
          prev.splice(index, 0, {
            ...draggedFile,
            active: true,
          });
        } else {
          // right side of rearranged file
          prev.splice(index - 1, 0, {
            ...draggedFile,
            active: true,
          });
        }
      } else {
        // Add the file at the given index
        prev.splice(index, 0, {
          ...draggedFile,
          active: true,
        });
      }

      // Deactivate all other files
      const newFiles = prev.map((f) => {
        if (f.path === draggedFile.path) {
          return { ...f, active: true };
        } else {
          return { ...f, active: false };
        }
      });

      return newFiles;
    });

    setDraggedFile(null);

    console.log("drop file", draggedFile, index);
  };

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.middleSection}>
        <div className={classes.leftBar}>
          <IoDocumentsOutline
            onClick={() => {
              setShowExplorer((p) => !p);
            }}
            color="#fefefe"
            size="1.5em"
            cursor="pointer"
          />
          <IoSearch color="#fefefe" size="1.5em" />
          <CiSettings color="#fefefe" size="1.5em" />
        </div>
        <div
          style={{ paddingLeft: showExplorer ? "10px" : "1px" }}
          className={classes.ide}
        >
          <Split
            style={{
              borderRadius: 3,
            }}
          >
            <div
              className={classes.explorer}
              style={{
                width: showExplorer ? "20%" : "0%",
                minWidth: showExplorer ? 100 : 0,
                height: "100%",
                display: showExplorer ? "block" : "none",
              }}
            >
              <Explorer
                setDraggedFile={setDraggedFile}
                paths={files}
                setOpenFiles={setOpenFileHandler}
              />
            </div>
            <div
              style={{ width: showExplorer ? "80%" : "100%", minWidth: 100 }}
            >
              <Split mode="vertical">
                <div className={classes.monaco} style={{ height: "70%" }}>
                  <div className={classes.openFiles}>
                    {openFiles.map((file, index) => (
                      <Fragment key={index}>
                        <div
                          onClick={() => setOpenFileHandler(file)}
                          className={`${classes.openFileItem} ${
                            file.active ? classes.activeFile : ""
                          }`}
                          draggable="true"
                          onDragStart={() => {
                            setDraggedFile(file);
                          }}
                          onDragEnd={() => {
                            setDraggedFile(null);
                          }}
                        >
                          <GetIconForFile fileName={file.name} />
                          <div>{file.name}</div>
                          <IoClose
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFiles(
                                openFiles.filter((f) => f.path !== file.path)
                              );
                            }}
                          />
                        </div>
                        <DragDropArea
                          onDrop={() => {
                            onDropFile(index + 1);
                          }}
                          isLast={index === openFiles.length - 1}
                        />
                      </Fragment>
                    ))}
                  </div>
                  <div className={classes.editorHolder}>
                    {openFiles.map((openFile) => (
                      <div
                        key={openFile.path}
                        className={`${classes.multipleEditors} ${
                          openFile.active ? classes.activeEditor : ""
                        }`}
                      >
                        {/* {openFile.path} */}
                        <EditorMain
                          instanceNumber={
                            openFiles
                              .filter(
                                (el) =>
                                  getLanguageForFile(el.name) ===
                                  getLanguageForFile(openFile?.name || "")
                              )
                              .findIndex((el) => el.name === openFile?.name) + 1
                          }
                          content={openFile?.content || ""}
                          openFileName={openFile?.name || ""}
                          language={getLanguageForFile(openFile?.name || "")}
                          filePath={openFile?.path || ""}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  id="terminal-container"
                  className={classes.terminal}
                  style={{ height: "30%" }}
                >
                  <Terminal socket={socket} setFiles={setFiles} />
                </div>
              </Split>
            </div>
          </Split>
        </div>
      </div>
      <div className={classes.bottomSection}>
        <span>Editor</span>
        <span>Terminal</span>
        <span>Browser</span>
      </div>
    </div>
  );
};

export default Playground;
