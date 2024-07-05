import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { CREATE_QUICK_LEAD_API, UPDATE_LEAD_API } from "../../apiDetails";
import {
  addNewLeadData,
  updateLeadData,
} from "../../slices/user/userDataSlice";
import {
  bankingLeadSource,
  bankingLeadStatus,
  bankName,
  budget,
  caseType,
  preference,
  preferredLocation,
  projects,
  realEstateLeadSource,
  realEstateLeadStatus,
} from "../StaticData/StaticData";
import GroupSectorButton from "../UI/GroupSectorButton";
import { validatePhoneNumber } from "../validateUserDetails";

const AddQuickLeads = ({
  handleModalCancel,
  isEditEnable,
  setIsEditEnable,
  editLeadData,
}) => {
  const dispatch = useDispatch();
  const { id, role, sector, fName, lName } = useSelector(
    (state) => state.userData,
  );
  const employeeData = useSelector((state) => state.employeeData);

  const [isLoading, setIsLoading] = useState(false);
  const [leadSector, setLeadSector] = useState(
    role === "super-admin" ? "Real Estate" : sector,
  );

  const [leadInput, setLeadInput] = useState({
    fName: `${isEditEnable ? editLeadData.fName : ""}`,
    lName: `${isEditEnable ? editLeadData.lName : ""}`,
    phone: `${isEditEnable ? editLeadData.lName : ""}`,
    email: `${isEditEnable ? editLeadData.email : ""}`,
    projectName: `${isEditEnable ? editLeadData.projectName : ""}`,
    preference: `${isEditEnable ? editLeadData.preference : ""}`,
    budget: `${isEditEnable ? editLeadData.budget : ""}`,
    preferredLocation: `${isEditEnable ? editLeadData.preferredLocation : ""}`,
    leadSource: `${isEditEnable ? editLeadData.leadSource : ""}`,
    caseType: `${isEditEnable ? editLeadData.caseType : ""}`,
    bankName: `${isEditEnable ? editLeadData.bankName : ""}`,
    leadRepresentative: { _id: id, name: fName + " " + lName },
    nextActionDate: `${isEditEnable ? editLeadData.nextActionDate : ""}`,
    feedback: `${isEditEnable ? editLeadData.feedback : ""}`,
  });

  const representativeName = employeeData.filter(
    (e) => e.sector === leadSector,
  );

  // This Function Reset Lead Input Data
  const resetInputData = () => {
    setLeadInput({
      fName: "",
      lName: "",
      phone: "",
      email: "",
      sector: "",
      projectName: "",
      preference: "",
      budget: "",
      preferredLocation: "",
      leadSource: "",
      caseType: "",
      bankName: "",
      leadRepresentative: "",
      nextActionDate: "",
      feedback: "",
    });
  };

  // This Function handle Assign Lead to leadRepresentative
  const handleSelectRepresentative = (event) => {
    let representativeDetails;
    employeeData.forEach((e) =>
      e._id === event.target.value ? (representativeDetails = e) : "",
    );

    setLeadInput({
      ...leadInput,
      leadRepresentative: {
        _id: representativeDetails ? representativeDetails._id : id,
        name: representativeDetails
          ? representativeDetails.fName + " " + representativeDetails.lName
          : fName + " " + lName,
      },
    });
  };

  // This Function Call Create New Lead API
  const createLeadApiCall = async (leadData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(CREATE_QUICK_LEAD_API, leadData, {
        withCredentials: true,
      });

      console.log(response);
      if (!response) {
        throw Error("Oops! Something went wrong.");
      }

      setIsLoading(false);
      if (response.data.success) {
        dispatch(addNewLeadData(response.data.data));
        toast.success("New Lead created successfully");

        // Reset Lead Input
        resetInputData();
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);

      if (err.response) {
        const error =
          err.response.data.message || "Opps! Something went wrong.";
        toast.error(error);
      } else {
        const error = err.message || "Opps! Something went wrong.";
        toast.error(error);
      }
    }
  };

  // This Function Handle to Create New Lead
  const handleCreateNewLead = () => {
    try {
      const leadInputData = {
        fName: leadInput.fName,
        lName: leadInput.lName,
        phone: leadInput.phone,
        email: leadInput.email,
        sector: leadSector,
        projectName: leadInput.projectName,
        preference: leadInput.preference,
        budget: leadInput.budget,
        preferredLocation: leadInput.preferredLocation,
        leadSource: leadInput.leadSource,
        caseType: leadInput.caseType,
        bankName: leadInput.bankName,
        nextActionDate: leadInput.nextActionDate,
        leadRepresentative: leadInput.leadRepresentative,
        feedback: leadInput.feedback,
      };

      console.log(leadInputData);

      // Check All fields.
      if (
        !leadInputData.fName.length > 0 ||
        !leadInputData.phone.length > 0 ||
        !leadInputData.sector.length > 0
      ) {
        toast.error("First name and Phone is required!");
        return;
      }

      const isPhoneValid = validatePhoneNumber(leadInput.phone);

      if (!isPhoneValid) {
        toast.error("Please enter a valid Phone number!");
        return;
      }
      createLeadApiCall(leadInputData);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Oops! Something went wrong.");
    }
  };

  // This Function Call Update Lead API
  const updateLeadApiCall = async (payload) => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `${UPDATE_LEAD_API}/${editLeadData._id}`,
        payload,
        {
          withCredentials: true,
        },
      );

      console.log(response);
      if (!response) {
        throw Error("Oops! Something went wrong.");
      }

      setIsLoading(false);
      if (response.data.success) {
        console.log(response.data.data);
        dispatch(updateLeadData(response.data.data));
        toast.success("Lead updated successfully");
        setIsEditEnable(false);
        // Reset Lead Input
        resetInputData();
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);

      if (err.response) {
        const error =
          err.response.data.message || "Opps! Something went wrong.";
        toast.error(error);
      } else {
        const error = err.message || "Opps! Something went wrong.";
        toast.error(error);
      }
    }
  };

  // This Function Handle to Edit/Update lead
  const handleUpdateLead = () => {
    try {
      const leadUpdateData = {
        fName: leadInput.fName,
        lName: leadInput.lName,
        email: leadInput.email,
        sector: editLeadData.sector,
        projectName: leadInput.projectName,
        preference: leadInput.preference,
        budget: leadInput.budget,
        preferredLocation: leadInput.preferredLocation,
        leadSource: leadInput.leadSource,
        caseType: leadInput.caseType,
        bankName: leadInput.bankName,
        nextActionDate: leadInput.nextActionDate,
        feedback: leadInput.feedback,
      };

      console.log(leadUpdateData.sector);

      // Check All fields.
      if (
        !leadUpdateData.fName.length > 0 ||
        !leadUpdateData.sector.length > 0
      ) {
        toast.error("First Name and Last Name are required!");
        return;
      } else if (
        editLeadData.fName === leadUpdateData.fName &&
        editLeadData.lName === leadUpdateData.lName &&
        editLeadData.email === leadUpdateData.email &&
        editLeadData.sector === leadUpdateData.sector &&
        editLeadData.projectName === leadUpdateData.projectName &&
        editLeadData.preference === leadUpdateData.preference &&
        editLeadData.budget === leadUpdateData.budget &&
        editLeadData.preferredLocation === leadUpdateData.preferredLocation &&
        editLeadData.leadSource === leadUpdateData.leadSource &&
        editLeadData.bankName === leadUpdateData.bankName &&
        editLeadData.nextActionDate === leadUpdateData.nextActionDate &&
        editLeadData.feedback === leadUpdateData.feedback
      ) {
        toast.error("No changes made");
        return;
      }
      updateLeadApiCall(leadUpdateData);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Oops! Something went wrong.");
    }
  };

  // This useEffect hook rerender the component whenever edit lead data changed
  useEffect(() => {
    if (isEditEnable) {
      setLeadInput(editLeadData);
      setLeadSector(editLeadData.sector);
    }
  }, [editLeadData, isEditEnable]);

  return (
    <div>
      {role === "admin" ||
        (role === "super-admin" && !isEditEnable && (
          <GroupSectorButton
            leadCategory={leadSector}
            setLeadCategory={setLeadSector}
          />
        ))}
      <form>
        <label htmlFor="fName" className="flex">
          <span className="w-3/12 select-none text-base">First Name:</span>
          <input
            type="text"
            id="fName"
            value={leadInput.fName}
            required
            className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
            onChange={(e) => {
              setLeadInput({ ...leadInput, fName: e.target.value });
            }}
          />
        </label>

        <label htmlFor="lName" className="flex">
          <span className="w-3/12 select-none text-base">Last Name :</span>
          <input
            type="text"
            id="lName"
            value={leadInput.lName}
            required
            className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
            onChange={(e) => {
              setLeadInput({ ...leadInput, lName: e.target.value });
            }}
          />
        </label>

        {!isEditEnable && (
          <label htmlFor="phone" className="flex">
            <span className="w-3/12 select-none text-base">Phone :</span>
            <input
              type="number"
              id="phone"
              value={leadInput.phone}
              required
              className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              onChange={(e) => {
                setLeadInput({ ...leadInput, phone: e.target.value });
              }}
            />
          </label>
        )}

        <label htmlFor="email" className="flex">
          <span className="w-3/12 select-none text-base">Email :</span>
          <input
            type="email"
            id="email"
            value={leadInput.email}
            required
            className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
            onChange={(e) => {
              setLeadInput({ ...leadInput, email: e.target.value });
            }}
          />
        </label>

        <label htmlFor="projectName" className="flex">
          <span className="w-3/12 select-none text-base">Project Name :</span>

          <select
            name=""
            id="projectName"
            value={leadInput.projectName}
            className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner outline-none focus:shadow-md"
            onChange={(e) => {
              setLeadInput({ ...leadInput, projectName: e.target.value });
            }}
          >
            <option value="">Select</option>
            {projects.map((e, i) => {
              return (
                <option key={i} value={`${e}`}>
                  {e}
                </option>
              );
            })}
          </select>
        </label>

        {/* This Part enables Inputs for Real Estate Leads */}
        {leadSector === "Real Estate" && (
          <>
            {/* Preference Input */}
            <label htmlFor="preference" className="flex">
              <span className="w-3/12 select-none text-base">Preference :</span>

              <select
                id="preference"
                required
                value={leadInput.preference}
                onChange={(e) => {
                  setLeadInput({ ...leadInput, preference: e.target.value });
                }}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Select</option>
                {preference.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </label>

            {/* Budget Input */}
            <label htmlFor="budget" className="flex">
              <span className="w-3/12 select-none text-base">Budget :</span>

              <select
                id="budget"
                required
                value={leadInput.budget}
                onChange={(e) => {
                  setLeadInput({ ...leadInput, budget: e.target.value });
                }}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Select</option>
                {budget.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </label>

            {/* Preferred Location input */}
            <label htmlFor="preferredLocation" className="flex">
              <span className="w-3/12 select-none text-base">
                Pref. Location :
              </span>

              <select
                id="preferredLocation"
                required
                value={leadInput.preferredLocation}
                onChange={(e) => {
                  setLeadInput({
                    ...leadInput,
                    preferredLocation: e.target.value,
                  });
                }}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Select</option>
                {preferredLocation.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </label>
          </>
        )}

        {/* This Part enables Inputs for Banking Leads */}
        {leadSector === "Banking" && (
          <>
            {/* Case Type Input */}
            <label htmlFor="caseType" className="flex">
              <span className="w-3/12 select-none text-base">Case Type :</span>

              <select
                id="caseType"
                required
                value={leadInput.caseType}
                onChange={(e) => {
                  setLeadInput({ ...leadInput, caseType: e.target.value });
                }}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Select</option>
                {caseType.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </label>

            {/* Bank Name Input */}
            <label htmlFor="bankName" className="flex">
              <span className="w-3/12 select-none text-base">Bank Name :</span>

              <select
                id="bankName"
                required
                value={leadInput.bankName}
                onChange={(e) => {
                  setLeadInput({ ...leadInput, bankName: e.target.value });
                }}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Select</option>
                {bankName.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </label>
          </>
        )}

        {/* Lead Source input */}
        <label htmlFor="leadSource" className="flex">
          <span className="w-3/12 select-none text-base">Lead Source :</span>

          <select
            id="leadSource"
            required
            value={leadInput.leadSource}
            onChange={(e) => {
              setLeadInput({
                ...leadInput,
                leadSource: e.target.value,
              });
            }}
            className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
          >
            <option value="">Select</option>

            {leadSector === "Real Estate"
              ? realEstateLeadSource.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })
              : bankingLeadSource.map((e, i) => {
                  return (
                    <option key={i} value={`${e}`}>
                      {e}
                    </option>
                  );
                })}
          </select>
        </label>

        {isEditEnable ? (
          <>
            {/* Lead Status input
            <label htmlFor="leadStatus" className="flex">
              <span className="w-3/12 select-none text-base">
                Lead Status :
              </span>

              <select
                id="leadStatus"
                required
                value={leadInput.leadStatus}
                onChange={(e) => {
                  setLeadInput({
                    ...leadInput,
                    leadStatus: e.target.value,
                  });
                }}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Select</option>

                {leadSector === "Real Estate"
                  ? realEstateLeadStatus.map((e, i) => {
                      return (
                        <option key={i} value={`${e}`}>
                          {e}
                        </option>
                      );
                    })
                  : bankingLeadStatus.map((e, i) => {
                      return (
                        <option key={i} value={`${e}`}>
                          {e}
                        </option>
                      );
                    })}
              </select>
            </label> */}

            {/* Next Action Date input */}
            <label htmlFor="nextActionDate" className="flex">
              <span className="w-3/12 select-none text-base">
                Next Action Date:
              </span>
              <input
                type="date"
                id="nextActionDate"
                value={leadInput.nextActionDate}
                required
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
                onChange={(e) => {
                  setLeadInput({
                    ...leadInput,
                    nextActionDate: e.target.value,
                  });
                }}
              />
            </label>
          </>
        ) : (
          <>
            {/* Assign Lead input */}
            <label htmlFor="leadRepresentative" className="flex">
              <span className="w-3/12 select-none text-base">
                Assign Lead :
              </span>

              <select
                id="preferredLocation"
                required
                // value={leadInput.leadRepresentative.name}
                onChange={handleSelectRepresentative}
                className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-1 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
              >
                <option value="">Self</option>
                {representativeName.map((e, i) => {
                  return (
                    <option key={i} value={e._id}>
                      {e.fName + " " + e.lName}
                    </option>
                  );
                })}
              </select>
            </label>
          </>
        )}

        <label htmlFor="feedback" className="flex">
          <span className="w-3/12 select-none text-base">Feedback :</span>
          <textarea
            type="text"
            id="feedback"
            value={leadInput.feedback}
            required
            className="m-2 w-7/12 rounded-md bg-slate-100 px-2 py-2 text-base shadow-inner shadow-slate-300 outline-none focus:shadow-md"
            onChange={(e) => {
              setLeadInput({ ...leadInput, feedback: e.target.value });
            }}
          />
        </label>

        {/* Add lead and Cancel Button */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => {
              resetInputData();
              handleModalCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={isEditEnable ? handleUpdateLead : handleCreateNewLead}
            loading={isLoading ? true : false}
          >
            {isEditEnable ? "Edit Lead" : "Add Lead"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddQuickLeads;
