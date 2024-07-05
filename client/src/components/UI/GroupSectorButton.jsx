import { Button, Space } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const GroupSectorButton = ({ leadCategory, setLeadCategory }) => {
  return (
    <>
      <Space className="my-1 rounded-lg bg-white px-3 py-2 shadow-inner shadow-slate-300">
        <Button
          className={`shadow-lg ${
            leadCategory == "Real Estate"
              ? "border-none bg-blue-500 text-white shadow-slate-400 hover:bg-white"
              : ""
          }`}
          onClick={() => setLeadCategory("Real Estate")}
        >
          Real Estate
        </Button>
        <Button
          className={`shadow-lg ${
            leadCategory === "Banking"
              ? "border-none bg-blue-500 text-white shadow-slate-400 hover:bg-white"
              : ""
          }`}
          onClick={() => setLeadCategory("Banking")}
        >
          Banking
        </Button>
        {/* <Button
         type={leadCategory==="Interior"?"primary":""}
          className={`shadow-lg ${
            leadCategory === "Interior"
              ? "border-none bg-blue-500 text-white shadow-slate-400 hover:bg-white"
              : ""
          }`}
          onClick={() => setLeadCategory("Interior")}
        >
          Interior
        </Button> */}
      </Space>
    </>
  );
};

export default GroupSectorButton;
