import { BiLogoGoLang } from "react-icons/bi";
import { CiFileOn } from "react-icons/ci";
import { VscJson } from "react-icons/vsc";
import { IoLogoPython } from "react-icons/io";

const GetIconForFile: React.FC<{ fileName: string }> = ({ fileName }) => {
  const extension = fileName.split(".")[fileName.split(".").length - 1];
  if (extension === "go") {
    return <BiLogoGoLang color="blue" />;
  }
  if (extension === "json") {
    return <VscJson color="yellow" />;
  }
  if (extension === "py") {
    return <IoLogoPython color="yellow" />;
  }
  return <CiFileOn />;
};

export default GetIconForFile;
