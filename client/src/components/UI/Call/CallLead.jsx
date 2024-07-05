import { Button, Modal } from "antd";
import { useState } from "react";
import { IoMdCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { MdWifiCalling3 } from "react-icons/md";

import service_call_center_man_avatar from "../../../assets/service-call-center-man-user-avatar.jpg";

const CallLead = ({ isCallLeadEnable, setIsCallLeadEnable, callLeadData }) => {
  console.log(callLeadData);

  const [isCalling, setIsCalling] = useState(false);

  console.log(isCalling);

  const handleCall = () => {
    setIsCalling(!isCalling);
  };

  return (
    <div>
      <Modal
        title={"Call"}
        open={isCallLeadEnable}
        footer={null}
        width={"300px"}
        onCancel={() => {
          setIsCallLeadEnable(false);
          setIsCalling(false);
        }}
      >
        <>
          <div className="w-20 overflow-hidden rounded-full p-3 shadow-md ">
            <img src={service_call_center_man_avatar} />
          </div>
          <div className="text-center">
            <p className="font-serif text-lg font-semibold">
              {callLeadData.fName + " " + callLeadData.lName}
            </p>
            <p className="text-base">{"+91 " + callLeadData.phone}</p>
          </div>

          <div className="mt-3 flex w-0 justify-center">
            {!isCalling ? (
              <Button
                type="primary"
                className="flex gap-1"
                onClick={handleCall}
              >
                <IoMdCall className="text-lg" />
                <span>Call</span>
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                className="flex gap-1"
                onClick={handleCall}
              >
                <MdWifiCalling3 className="text-lg" />

                <span>Calling</span>
                <span className="animate-bounce text-lg">...</span>
              </Button>
            )}
          </div>
        </>
      </Modal>
    </div>
  );
};

export default CallLead;
