import { BiDetail } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const TButton = ({ onClick, btnName, circle, iconName }) => {
  return (
    <button
      onClick={onClick}
      className={`text-slate-50 mx-1 px-2 py-1 active:scale-95 ${
        circle
          ? "my-1 h-12 w-12 rounded-full text-xs font-semibold"
          : "flex gap-1 rounded-md text-lg "
      } ${
        btnName === "Delete"
          ? "bg-red-600 hover:bg-red-700"
          : "bg-sky-600 hover:bg-sky-500"
      }`}
    >
      {iconName === "details" && <BiDetail className="text-xl" />}
      {iconName === "edit" && <FaRegEdit className="text-xl" />}
      {iconName === "delete" && <MdDeleteForever className="text-xl" />}
      {btnName}
    </button>
  );
};

export default TButton;
