import { Button, Modal, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidUserPin } from "react-icons/bi";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { ASSIGN_LEAD_API } from "../../apiDetails";
import { addNewLeadData } from "../../slices/user/userDataSlice";
import GroupSectorButton from "../UI/GroupSectorButton";

const AssignLead = ({
  isAssignLeadEnable,
  setIsAssignLeadEnable,
  assignLeadData,
  assignLeadSector,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assignEnable, setAssignEnable] = useState(isAssignLeadEnable);
  const [leadCategory, setLeadCategory] = useState(
    assignLeadSector || "Real Estate",
  );
  const [representativeOption, setRepresentativeOption] = useState([]);

  const employeeData = useSelector((state) => state.employeeData);
  const { role } = useSelector((state) => state.userData);

  const dispatch = useDispatch();
  console.log("assignLeadData: ", assignLeadData);

  const filteredOptions = employeeData.filter(
    (e) =>
      e.sector.includes(leadCategory) &&
      e._id !== assignLeadData?.leadRepresentative?._id,
  );
  // .map((e) => e.fName + " " + e.lName)
  // .filter((e) => !representativeOption.includes(e));

  console.log("filteredOptions: ", filteredOptions);
  console.log("isAssignLeadEnable: ", isAssignLeadEnable);

  // This Function Call Assign Lead Api
  const assignLeadApi = async (payload, id) => {
    try {
      setIsLoading(true);
      console.log(payload);

      const response = await axios.patch(`${ASSIGN_LEAD_API}/${id}`, payload, {
        withCredentials: true,
      });
      if (response.data.success) {
        setIsAssignLeadEnable(false);
        dispatch(addNewLeadData(response.data.data));
        Swal.fire({
          title: "Assigned!",
          text: "Your lead has been assigned.",
          icon: "success",
        });
      }
      console.log(response.data.success);
    } catch (error) {
      console.log(error);
      const errMessage =
        error.response.data.message || "Oops! Something went wrong.";
      console.log(errMessage);
      toast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // This Function handle Submit Assign Lead
  const handleSubmitAssignLead = () => {
    let leadRepresentative = [];

    if (representativeOption.length === 0) {
      return toast.error("Please select the Representative name.");
    }

    console.log(representativeOption);

    representativeOption.forEach((e) => {
      for (let element of employeeData) {
        if (e.includes(element._id)) {
          leadRepresentative.push({
            _id: element._id,
            name: element.fName + " " + element.lName,
          });
        }
      }
      e.fName + " " + e.lName === representativeOption
        ? (leadRepresentative = e)
        : "";
    });

    const payload = {
      leadRepresentative,
      currentLeadSector: leadCategory,
      previouLeadSector: assignLeadData.sector,
    };

    console.log("payload: ", payload);

    const leadId = assignLeadData._id;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign it!",
    }).then((result) => {
      if (result.isConfirmed) {
        assignLeadApi(payload, leadId);
      }
    });
  };

  // Reset the representativeOption when leadCategory changed
  useEffect(() => {
    setRepresentativeOption([]);
  }, [leadCategory]);

  return (
    <Modal
      title={"Assign Lead"}
      open={assignEnable}
      onCancel={() => {
        setAssignEnable(false);
        setIsAssignLeadEnable(false);
      }}
      footer={null}
      width={700}
    >
      <div className="w-[650px] md:flex lg:flex">
        {/* Lead Details Container */}
        <div className="h-full w-5/12 overflow-hidden rounded-md border p-2 text-base shadow-md hover:shadow-sky-800">
          <div className="h-1/2 w-full rounded-md bg-sky-800 p-1 text-center text-slate-50">
            <BiSolidUserPin className="text-4xl" />
            <div className="text-lg">
              {assignLeadData.fName + " " + assignLeadData.lName}
            </div>
            <div className="text-xs text-slate-200">
              Details Of Selected Lead
            </div>
          </div>
          <div>
            <div className="my-1 flex w-72">
              <div className="w-4/12">Project</div>
              <div className="w-9/12">: {assignLeadData.projectName}</div>
            </div>

            <div className="my-1 flex w-72">
              <div className="w-4/12">Lead Status</div>
              <div className="w-9/12">: {assignLeadData.leadStatus}</div>
            </div>

            <div className="my-1 flex w-72">
              <div className="w-4/12">Repre.</div>
              <div className="w-9/12">
                : {assignLeadData.leadRepresentative?.name}
              </div>
            </div>
          </div>
        </div>

        {/* Select Sales Representative Name Container */}
        <div className="h-full w-6/12 rounded-md border p-2 pb-4 shadow-md transition-all hover:shadow-sky-800">
          <div className="h-1/2 w-full rounded-md bg-sky-800 p-1 text-center text-slate-50">
            <MdOutlineAssignmentInd className="text-4xl" />
            <h2 className="text-base">Select Sales Representative Name</h2>
          </div>

          {role === "super-admin" || role === "admin" ? (
            <GroupSectorButton
              leadCategory={leadCategory}
              setLeadCategory={setLeadCategory}
            />
          ) : (
            ""
          )}

          <Select
            mode="multiple"
            placeholder="Assign Representative"
            value={representativeOption}
            onChange={setRepresentativeOption}
            options={filteredOptions.map((item) => ({
              value: item._id,
              label: item.fName + " " + item.lName,
            }))}
            className="my-3 w-full text-base"
          ></Select>

          {/* <select
            id=""
            onChange={(e) => setLeadAction(e.target.value)}
            className="my-3 w-1/4 rounded-md border p-1 shadow-md outline-none"
          >
            <option value="moveLead">Move</option>
            <option value="copyLead">Copy</option>
          </select> */}

          <Button
            type="primary"
            loading={isLoading}
            onClick={handleSubmitAssignLead}
            className="w-full items-end"
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignLead;
