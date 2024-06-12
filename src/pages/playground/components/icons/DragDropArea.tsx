import { useState } from "react";
import classes from "./dragDrop.module.css";
const DragDropArea = ({
  onDrop,
  isLast,
}: {
  onDrop: () => void;
  isLast: boolean;
}) => {
  const [showDropArea, setShowDropArea] = useState<boolean>(false);

  const fileDropped = () => {
    // console.log("file dropped");
    onDrop();
    setShowDropArea(false);
  };

  return (
    <div
      className={`${classes.dropArea} ${
        showDropArea ? classes.dropAreaVisible : ""
      } ${isLast ? classes.isLast : ""}`}
      onDragEnter={() => {
        setShowDropArea(true);
      }}
      onDragLeave={() => {
        setShowDropArea(false);
      }}
      onDrop={fileDropped}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {showDropArea ? "drop here" : ""}
    </div>
  );
};

export default DragDropArea;
