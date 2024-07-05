import { Button } from "antd";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiCalendarDate } from "react-icons/ci";
import { FaEye, FaEyeSlash, FaRegIdBadge, FaTransgender } from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import { MdAlternateEmail, MdOutlineLocalPhone } from "react-icons/md";
import { RiLockPasswordLine, RiProfileFill } from "react-icons/ri";
import { WiMoonAltFirstQuarter, WiMoonFirstQuarter } from "react-icons/wi";
import { useDispatch, useSelector } from "react-redux";

import {
  CREATE_EMPLOYEE_API,
  UPDATE_EMPLOYEE_DATA_API,
} from "../../apiDetails";
import {
  createEmployeeData,
  updateEmployeeData,
} from "../../slices/user/userDataSlice";
import { employeeDesignationList } from "../StaticData/StaticData";
import {
  validateEmailAddress,
  validatePhoneNumber,
  validateStrongPassword,
} from "../validateUserDetails";

const AddEmployee = ({ editEmployeeDetails }) => {
  const { role, sector } = useSelector((state) => state.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [employeeInputData, setEmployeeInputData] = useState(
    editEmployeeDetails
      ? editEmployeeDetails
      : {
          fName: "",
          lName: "",
          userId: "",
          designation: "",
          email: "",
          phone: "",
          gender: "",
          joiningDate: "",
          password: "",
          sector: "",
        },
  );

  const dispatch = useDispatch();
  console.log(employeeInputData);

  // This Function Call Create Employee Api
  const createEmployeeApi = async (payload) => {
    try {
      setIsLoading(true);
      const response = await axios.post(CREATE_EMPLOYEE_API, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log(response);
        dispatch(createEmployeeData(response.data.data));
        toast.success("New Employee created successfully!");
        setIsLoading(false);
        // Reset Employee input data
        setEmployeeInputData({
          fName: "",
          lName: "",
          userId: "",
          designation: "",
          email: "",
          phone: "",
          gender: "",
          joiningDate: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      let errorMsg = "";
      if (error.response) {
        errorMsg = error.response.data.message;
      } else {
        errorMsg = error.message || "Something went wrong!";
      }
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  // This Function Handle Submit the form
  const handleFormSubmit = () => {
    try {
      const employeeInputPayload = {
        fName: employeeInputData.fName.trim(),
        lName: employeeInputData.lName.trim(),
        userId: employeeInputData.userId.trim(),
        designation: employeeInputData.designation.trim(),
        email: employeeInputData.email.trim(),
        phone: employeeInputData.phone,
        sector: employeeInputData.sector,
        gender: employeeInputData.gender,
        joiningDate: employeeInputData.joiningDate,
        password: employeeInputData.password.trim(),
      };

      const isValidEmail = validateEmailAddress(employeeInputPayload.email);
      const isValidPhone = validatePhoneNumber(employeeInputPayload.phone);
      const isStrongPassword = validateStrongPassword(
        employeeInputPayload.password,
      );

      console.log(isStrongPassword);

      if (
        !employeeInputPayload.fName.length > 0 ||
        !employeeInputPayload.lName.length > 0 ||
        !employeeInputPayload.userId.length > 0 ||
        !employeeInputPayload.designation.length > 0 ||
        !employeeInputPayload.email.length > 0 ||
        !employeeInputPayload.phone.length > 0 ||
        !employeeInputPayload.gender.length > 0 ||
        !employeeInputPayload.joiningDate.length > 0
      ) {
        return toast.error("All fields required!");
      } else if (!isValidEmail && !isValidPhone) {
        return toast.error("Invalid Email address!");
      } else if (!isValidPhone) {
        return toast.error("Invalid Phone number!");
      } else if (!isStrongPassword) {
        return toast.error("Please enter a strong password");
      }

      console.log(employeeInputPayload);

      createEmployeeApi(employeeInputPayload);
    } catch (error) {
      const errorMsg = error.message || "Oops! Something went wrong";
      console.log(errorMsg);
      toast.error(errorMsg);
    }
  };

  // This Function call update employee api
  const updateEmployeeApi = async (payload) => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `${UPDATE_EMPLOYEE_DATA_API}/${editEmployeeDetails._id}`,
        payload,
        { withCredentials: true },
      );

      dispatch(updateEmployeeData(response.data.data));
      console.log(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      let errorMsg = "";
      if (error.response) {
        errorMsg = error.response.data.message;
      } else {
        errorMsg = error.message || "Something went wrong!";
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // This Function handle Update the form
  const handleFormUpdate = () => {
    employeeInputData;
    editEmployeeDetails;

    let updatedData = {};

    // It check the updated value
    Object.keys(editEmployeeDetails).forEach((e) => {
      if (employeeInputData[e] !== editEmployeeDetails[e]) {
        updatedData[e] = employeeInputData[e];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast.error("Employee Details not changed!");
      return;
    }

    updateEmployeeApi(updatedData);
  };

  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="my-5 flex  flex-wrap justify-center gap-2 overflow-hidden rounded-xl pb-4 shadow-lg lg:w-[60%]"
      >
        <div className="mb-3 w-full border-b-4 border-b-green-700 bg-[#004280] p-2 text-center text-3xl font-semibold text-white">
          <h3>Create An Employee</h3>
        </div>

        {/* First Name */}
        <label
          htmlFor="fName"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.fName
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 text-lg text-slate-500"
            }`}
          >
            First Name
          </span>
          <WiMoonAltFirstQuarter className="w-2/12 text-2xl text-white" />
          <input
            type="text"
            id="fName"
            value={employeeInputData.fName}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                fName: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
          />
        </label>

        {/* Last Name */}
        <label
          htmlFor="lName"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.lName
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 text-lg text-slate-500"
            }`}
          >
            Last Name
          </span>
          <WiMoonFirstQuarter className="w-2/12 text-2xl text-white" />
          <input
            type="text"
            id="lName"
            value={employeeInputData.lName}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                lName: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
          />
        </label>

        {/* Employee Id */}
        <label
          htmlFor="userId"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.userId
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 text-lg text-slate-500"
            }`}
          >
            Employee Id
          </span>
          <FaRegIdBadge className="w-2/12 text-xl text-white" />
          <input
            type="text"
            id="userId"
            value={employeeInputData.userId}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                userId: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
          />
        </label>

        {/* Employee Designation */}
        <label
          htmlFor="designation"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.designation
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 bg-white text-lg text-slate-500"
            }`}
          >
            Designation
          </span>
          <FaTransgender className="w-2/12 text-xl text-white" />
          <select
            type="text"
            id="designation"
            value={employeeInputData.designation}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                designation: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md p-2 text-lg outline-none"
          >
            {employeeDesignationList.map((e, i) => {
              return (
                <option key={i} value={e === "Select" ? "" : e}>
                  {e}
                </option>
              );
            })}
          </select>
        </label>

        {/* Employee Sector */}
        {role === "super-admin" && (
          <label
            htmlFor="sector"
            className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
          >
            <span
              className={`absolute z-50 my-1 rounded-md px-1 transition-all duration-300 ease-in-out ${
                employeeInputData.sector
                  ? "-top-4 left-2 bg-green-600 text-sm text-white"
                  : "left-[18%] top-1 bg-white text-lg text-slate-500"
              }`}
            >
              Sector
            </span>
            <FcDepartment className="w-2/12 text-xl text-white" />

            <select
              id="sector"
              value={employeeInputData.sector}
              onChange={(e) => {
                setEmployeeInputData({
                  ...employeeInputData,
                  sector: e.target.value,
                });
              }}
              className="w-10/12 rounded-r-md px-2 py-2 text-lg outline-none"
            >
              <option value="">Select</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Banking">Banking</option>
              <option value="Interior">Interior</option>
              <option value="All">All</option>
            </select>
          </label>
        )}

        {/* Employee Email Id */}
        <label
          htmlFor="email"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.email
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 text-lg text-slate-500"
            }`}
          >
            Email ID
          </span>
          <MdAlternateEmail className="w-2/12 text-xl text-white" />
          <input
            type="email"
            id="email"
            value={employeeInputData.email}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                email: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
          />
        </label>

        {/* Employee Phone Number */}
        <label
          htmlFor="phone"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.phone
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 text-lg text-slate-500"
            }`}
          >
            Phone
          </span>
          <MdOutlineLocalPhone className="w-2/12 text-xl text-white" />
          <input
            type="number"
            id="phone"
            value={employeeInputData.phone}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                phone: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
          />
        </label>

        {/* Employee Gender */}
        <label
          htmlFor="gender"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.gender
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 bg-white text-lg text-slate-500"
            }`}
          >
            Gender
          </span>
          <FaTransgender className="w-2/12 text-xl text-white" />
          <select
            type="text"
            id="gender"
            value={employeeInputData.gender}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                gender: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md p-2 text-lg outline-none"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Joining Date */}
        <label
          htmlFor="joiningDate"
          className="m-3 flex w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
        >
          <span
            className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
              employeeInputData.joiningDate
                ? "-top-3 left-2 bg-green-600 text-sm text-white"
                : "left-[18%] top-1 bg-white text-lg text-slate-500"
            }`}
          >
            Date Of Joining
          </span>
          <CiCalendarDate className="w-2/12 text-lg text-white" />
          <input
            type="date"
            id="joiningDate"
            value={employeeInputData.joiningDate}
            onChange={(e) => {
              setEmployeeInputData({
                ...employeeInputData,
                joiningDate: e.target.value,
              });
            }}
            className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
          />
        </label>

        {/* Create Employee login password */}
        {!editEmployeeDetails && (
          <label
            htmlFor="password"
            className="m-3 flex h-9 w-8/12 rounded-md border border-slate-500 bg-[#004280] lg:w-[45%]"
          >
            <span
              className={`absolute z-50 rounded-md px-1 transition-all duration-300 ease-in-out ${
                employeeInputData.password
                  ? "-top-3 left-2 bg-green-600 text-sm text-white"
                  : "left-[18%] top-1 text-lg text-slate-500"
              }`}
            >
              Password
            </span>
            <RiLockPasswordLine className="w-2/12 text-xl text-white" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={employeeInputData.password}
              onChange={(e) => {
                setEmployeeInputData({
                  ...employeeInputData,
                  password: e.target.value,
                });
              }}
              className="w-10/12 rounded-r-md px-2 py-1 text-lg outline-none"
            />
            <span className="absolute right-2 top-1 cursor-pointer text-2xl">
              {showPassword ? (
                <FaEye
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              ) : (
                <FaEyeSlash
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              )}
            </span>
          </label>
        )}

        {/* Create employee button  */}
        <Button
          type="primary"
          size="large"
          loading={isLoading ? true : false}
          onClick={editEmployeeDetails ? handleFormUpdate : handleFormSubmit}
          className="m-3 flex w-5/12 lg:w-[45%]"
        >
          {editEmployeeDetails ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddEmployee;
