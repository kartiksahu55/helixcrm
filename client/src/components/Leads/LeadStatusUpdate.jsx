import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { UPDATE_LEAD_API } from "../../apiDetails";
import { updateLeadData } from "../../slices/user/userDataSlice";
import QuickSales from "../Sales/QuickSales";
import {
  bankingLeadStatus,
  realEstateLeadStatus,
} from "../StaticData/StaticData";

const LeadStatusUpdate = ({
  statusUpdateLeadData,
  setStatusUpdateLeadData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [leadStatusData, setLeadStatusData] = useState(
    statusUpdateLeadData?.leadStatus || "",
  );

  const [isStatusFinal, setIsStatusFinal] = useState(
    statusUpdateLeadData?.leadStatus === "Booked" ||
      statusUpdateLeadData?.leadStatus === "Disbursed"
      ? true
      : false,
  );

  const dispatch = useDispatch();

  console.log("statusUpdateLeadData: ", statusUpdateLeadData);
  console.log("leadStatusData: ", leadStatusData);

  const leadStatusStaticData =
    statusUpdateLeadData?.sector === "Real Estate"
      ? realEstateLeadStatus
      : bankingLeadStatus;

  const updateLeadApiCall = async (payload, id) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`${UPDATE_LEAD_API}/${id}`, payload, {
        withCredentials: true,
      });

      console.log(response);
      if (response?.data?.success) {
        const data = response.data?.data;
        data;
      }
      if (response?.data?.success) {
        console.log(response.data.data);
        dispatch(updateLeadData(response.data?.data));
        toast.success("Lead status updated successfully");
        if (
          response.data?.data.leadStatus === "Booked" ||
          response.data?.data.leadStatus === "Disbursed"
        ) {
          setIsStatusFinal(true);
        } else {
          setStatusUpdateLeadData(null);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeadStatus = () => {
    if (leadStatusData === "") {
      return toast.error("Please select lead status!");
    } else if (leadStatusData === statusUpdateLeadData?.leadStatus) {
      return toast.error("Status not changed!");
    }

    const payload = {
      leadStatus: leadStatusData.trim(),
      sector: statusUpdateLeadData?.sector,
    };
    const leadId = statusUpdateLeadData?._id;

    updateLeadApiCall(payload, leadId);
  };

  console.log("isStatusFinal: ", isStatusFinal);

  return (
    <>
      <Modal
        title={"Update Your Lead Status."}
        okText={"Update"}
        footer={null}
        confirmLoading={isLoading}
        open={statusUpdateLeadData}
        onCancel={() => {
          setLeadStatusData("");
          setStatusUpdateLeadData(null);
        }}
      >
        <div className="mb-3 border-b-2 border-sky-800 font-semibold">
          <h3 className=" font-mono text-base">
            Name:{" "}
            {statusUpdateLeadData?.fName + " " + statusUpdateLeadData?.lName} (
            {statusUpdateLeadData?.sector})
          </h3>
          <h3 className="font-mono">
            Phone:{" +91 "}
            {statusUpdateLeadData?.phone}
          </h3>
        </div>
        <div>
          <label>
            <div className="my-2 text-base">Lead Status: </div>
            <select
              value={leadStatusData}
              className="w-full rounded-md bg-slate-100 px-2 py-1  text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              onChange={(e) => setLeadStatusData(e.target.value)}
            >
              <option value={""}>select</option>
              {leadStatusStaticData.map((e, i) => (
                <option key={i} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
          {!isStatusFinal && (
            <div className="mt-3 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setLeadStatusData("");
                  setStatusUpdateLeadData(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={() => handleUpdateLeadStatus()}>
                Update
              </Button>
            </div>
          )}
        </div>

        {isStatusFinal && (
          <QuickSales
          setIsModalOpen={setIsStatusFinal}
            selectedLeadDetails={statusUpdateLeadData}
            setStatusUpdateLeadData={setStatusUpdateLeadData}
          />
        )}
      </Modal>
    </>
  );
};

export default LeadStatusUpdate;
