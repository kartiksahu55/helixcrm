import { FileTextOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";

import AddLeadsFile from "./AddLeadsFile";
import QuickLeadsForm from "./QuickLeadsForm";

const NewLead = () => {
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectOption, setSelectOption] = useState(null);

  const handleShowModal = () => {
    setShowModalOpen(true);
  };

  const handleModalCancel = () => {
    setShowModalOpen(false);
    setSelectOption(null);
  };

  return (
    // <div className="w-[95%] rounded-xl bg-[#004280] p-6">
    //   <div className="flex h-9 gap-5">
    //     <input
    //       type="number"
    //       placeholder="Phone Number"
    //       className="w-[50%] rounded-md bg-slate-200 px-4 text-xl outline-none"
    //     />
    //     <button className="hover:[#0093C1] flex gap-2 rounded-md bg-slate-50 px-2 text-lg font-semibold text-[#004280] hover:bg-gradient-to-t hover:from-[#0062BC] hover:to-[#0093C1] hover:text-slate-50 active:scale-95">
    //       <IoPersonAddSharp className="text-xl" />
    //       <span>Add New Lead</span>
    //     </button>
    //   </div>
    // </div>
    <>
      <Modal
        title="Add New Lead"
        open={showModalOpen}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Space>
          <Button
            onClick={() => setSelectOption("option-1")}
            icon={<UserAddOutlined />}
            className={`${
              selectOption === "option-1" && "border-blue-500 text-blue-500"
            }`} 
          >
            Add Quick Leads
          </Button>
          <Button
            onClick={() => setSelectOption("option-2")}
            icon={<FileTextOutlined />}
            className={`${
              selectOption === "option-2" && "border-blue-500 text-blue-500"
            }`}
          >
            Add Leads File
          </Button>
        </Space>

        {selectOption === "option-1" ? (
          <QuickLeadsForm handleModalCancel={handleModalCancel} />
        ) : selectOption === "option-2" ? (
          <AddLeadsFile handleModalCancel={handleModalCancel} />
        ) : (
          ""
        )}
      </Modal>
      <Button
        type="primary"
        onClick={handleShowModal}
        className="group flex gap-2 text-base"
      >
        <IoPersonAdd className="group-hover:animate-pulse inline-block mr-2 " />
        <span>Add New Leads</span>
      </Button>
    </>
  );
};

export default NewLead;
