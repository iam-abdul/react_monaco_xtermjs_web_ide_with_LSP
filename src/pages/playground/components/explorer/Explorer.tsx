import { useState, useRef, useEffect } from "react";
import classes from "./explorer.module.css";
import { FaRegFolder } from "react-icons/fa";
import { FaRegFolderOpen } from "react-icons/fa";
import GetIconForFile from "../icons/Icons";
import { IOpenFile } from "../../playground";
import axios from "axios";

export interface FolderStructure {
  name: string;
  path: string;
  children?: FolderStructure[];
}

const createDirRequest = async (path: string) => {
  try {
    const url = "http://139.59.74.236:80/create-directory";
    const response = await axios.post(url, { path: path });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

const createFileRequest = async (path: string) => {
  try {
    const url = "http://139.59.74.236:80/create-file";
    const response = await axios.post(url, { path: path });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

const fetchFiles = async (path: string): Promise<IOpenFile> => {
  try {
    const workingDir = "/home/damer";
    const url = "http://139.59.74.236:80" + path.split(workingDir).pop();

    const fileContent = await axios.get(url);

    let returnData: IOpenFile = {
      name: "",
      content: "",
      path: "",
      active: false,
    };

    const fileName = path.split("/").pop();
    if (fileContent.data && fileName) {
      returnData = {
        name: fileName,
        content: fileContent.data,
        path: path,
        active: true,
      };
    }

    if (fileContent.data === "" && fileName) {
      returnData = {
        name: fileName,
        content: "",
        path: path,
        active: true,
      };
    }

    return returnData;
  } catch (err) {
    console.log(err);
    return { name: "", content: "", path: "", active: false };
  }
};

interface IDraft {
  name: string;
  type: "folder" | "file";
  path: string;
}

const Explorer = ({
  paths,
  setOpenFiles,
  setDraggedFile,
}: {
  paths: FolderStructure[];
  setOpenFiles: (f: IOpenFile) => void;
  setDraggedFile: (f: IOpenFile | null) => void;
}) => {
  const [open, setOpen] = useState<boolean[]>(
    paths
      .filter((el) => (el.children ? true : false))
      .map(() => {
        return false;
      })
  );

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    path: "",
  });

  const handleRightClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    console.log("right click", path);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      path: path,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        path: "",
      });
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(e.target as Node)
    ) {
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        path: "",
      });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [draft, setDraft] = useState<IDraft | undefined>();

  const handleContextItemClick = (click: "create_folder" | "create_file") => {
    if (click === "create_folder") {
      console.log("create folder");
      setDraft({ name: "New Folder", type: "folder", path: contextMenu.path });
    } else {
      console.log("create file");
      setDraft({ name: "New File", type: "file", path: contextMenu.path });
    }
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      path: "",
    });
  };

  // console.log("the open state ", open);

  const toggleOpenHandler = async (index: number) => {
    setOpen((prev) => {
      const newOpen = [...prev];
      newOpen[index] = !newOpen[index];
      return newOpen;
    });
  };
  const openFileHandler = async (path: string) => {
    const openFileData: IOpenFile = await fetchFiles(path);
    console.log("the open file data ", openFileData);

    setOpenFiles(openFileData);
  };

  const startDraggingHandler = async (path: string) => {
    // fetch the file content and set it to dragged file
    const draggedFileData = await fetchFiles(path);
    setDraggedFile(draggedFileData);
  };

  return (
    <div className={classes.padding}>
      {paths.map((path, index) => {
        return (
          <div key={path.path}>
            {path.children ? (
              <h1
                onContextMenu={(e) => {
                  handleRightClick(e, path.path);
                }}
                className={`${classes.folderStyle}`}
                onClick={() => {
                  toggleOpenHandler(index);
                }}
              >
                {open[index] ? <FaRegFolderOpen /> : <FaRegFolder />}
                {path.name}
              </h1>
            ) : (
              ""
            )}

            {contextMenu.visible ? (
              <div
                className={classes.contextMenu}
                ref={contextMenuRef}
                style={{
                  position: "absolute",
                  top: contextMenu.y,
                  left: contextMenu.x,
                  zIndex: 100,
                }}
              >
                <ul>
                  <li
                    onClick={() => {
                      handleContextItemClick("create_folder");
                    }}
                  >
                    Create folders
                  </li>
                  <li
                    onClick={() => {
                      handleContextItemClick("create_file");
                    }}
                  >
                    Create file
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}
            {open[index] && path.children ? (
              <div className={classes.folders}>
                <Explorer
                  setDraggedFile={setDraggedFile}
                  setOpenFiles={setOpenFiles}
                  paths={path.children}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}
      {draft && draft.type === "folder" ? (
        <div className={classes.newFolder}>
          <FaRegFolder />
          <input
            type="text"
            autoFocus={true}
            value={draft.name}
            onChange={(e) => {
              setDraft({ ...draft, name: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setDraft(undefined);
              }
              if (e.key === "Enter") {
                console.log("create folder", draft.path + "/" + draft.name);
                createDirRequest(draft.path + "/" + draft.name);
                setDraft(undefined);
              }
            }}
          />
        </div>
      ) : (
        ""
      )}
      {draft && draft.type === "file" ? (
        <div className={classes.newFolder}>
          <input
            type="text"
            value={draft.name}
            autoFocus={true}
            onChange={(e) => {
              setDraft({ ...draft, name: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setDraft(undefined);
              }
              if (e.key === "Enter") {
                console.log("create file", draft.path + "/" + draft.name);
                createFileRequest(draft.path + "/" + draft.name);
                setDraft(undefined);
              }
            }}
          />
        </div>
      ) : (
        ""
      )}

      {paths.map((path) => {
        return (
          <div key={path.path}>
            {!path.children ? (
              <h1
                onClick={() => {
                  openFileHandler(path.path);
                }}
                className={`${classes.fileStyle}`}
                draggable="true"
                onDragStart={() => {
                  startDraggingHandler(path.path);
                }}
                onDragEnd={() => {
                  setDraggedFile(null);
                }}
              >
                {/* {path.name.split(".")[path.name.split(".").length - 1] ===
                "js" ? (
                  <IoLogoJavascript color="yellow" />
                ) : (
                  ""
                )} */}
                <GetIconForFile fileName={path.name} />
                {path.name}
              </h1>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Explorer;
