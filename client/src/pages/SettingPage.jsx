import { Switch } from "antd";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { Update_USER_Details_API } from "../apiDetails";
import user_default_avatar from "../assets/user-default-avatar.png";
import Button from "../components/UI/Button";
import UploadImage from "../components/UI/UploadImage";
import { isLoadingCheck, updateUserData } from "../slices/user/userDataSlice";

const SettingPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);

  const userData = useSelector((state) => state.userData);
console.log(userData);
  const dispatch = useDispatch();

  const [userInputData, setUserInputData] = useState({
    id: userData.id,
    fName: userData.fName,
    lName: userData.lName,
    userId: userData.userId,
    email: userData.email,
    phone: userData.phone,
    department: userData.department,
    panNumber: userData.panNumber,
    bankName: userData.bankName,
    accountNumber: userData.accountNumber,
    ifsc: userData.ifsc,
  });

  // This Function Call User Update API
  const userDetailUpdateAPICall = async (payload) => {
    try {
      dispatch(isLoadingCheck(true));
      const response = await axios.patch(
        `${Update_USER_Details_API}/${userData.id}`,
        payload,
        { withCredentials: true },
      );

      if (!response) {
        throw Error("Network Error!");
      } else if (!response.data.success) {
        throw Error("Something went wrong!");
      } else {
        dispatch(isLoadingCheck(false));
        dispatch(updateUserData(payload));
        toast.success("Updated successfully");
        // Toast.fire({
        //   icon: "success",
        //   title: "Updated successfully",
        // });
      }
    } catch (error) {
      dispatch(isLoadingCheck(false));
      console.log(error.message);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // This Function handle update user information on Button click
  const handleUpdateInfoButton = async (e) => {
    e.preventDefault();

    const convertToCapital = (string) => {
      const arr = string.split(" ").filter((e) => e !== "");
      return arr
        .map((e) => {
          return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
        })
        .join(" ");
    };

    try {
      const updateUserData = {
        id: userInputData.id,
        fName: convertToCapital(userInputData.fName),
        lName: convertToCapital(userInputData.lName),
        department: userInputData.department,
        panNumber: userInputData.panNumber?.trim().toUpperCase(),
        bankName: userInputData.bankName?.trim(),
        accountNumber: userInputData.accountNumber?.trim(),
        ifsc: userInputData.ifsc?.trim().toUpperCase(),
      };

      // Checking if data updated or not
      if (
        updateUserData.fName === userData.fName &&
        updateUserData.lName === userData.lName &&
        updateUserData.department === userData.department &&
        updateUserData.panNumber === userData.panNumber &&
        updateUserData.bankName === userData.bankName &&
        updateUserData.accountNumber === userData.accountNumber &&
        updateUserData.ifsc === userData.ifsc
      ) {
        console.log("Value Not Changed");
        throw Error("No changes made.");
      }

      await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          userDetailUpdateAPICall(updateUserData);
        }
      });
    } catch (error) {
      dispatch(isLoadingCheck(false));
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   const identifier = setTimeout(() => {
  //     console.log("Checking form validity!");
  //   }, 1000);

  //   return () => {
  //     console.log("CLEANUP");
  //     clearTimeout(identifier);
  //   };
  // }, []);

  return (
    <div className="top-4 ">
      <h2 className="text-3xl font-semibold">User Profile</h2>
      <div className="absolute my-2 flex flex-col gap-3">
        {/* #Upload Image# */}
        {/* <div className="flex">
          <div className="w-24 rounded-full bg-gradient-to-t from-slate-500 via-white to-slate-500 p-[6px]">
            <img src={user_default_avatar} className="rounded-full" />
          </div>

          <MdDeleteForever className="absolute left-16 top-0 cursor-pointer rounded-full bg-slate-600 p-[2px] text-xl text-white hover:bg-slate-700 active:scale-95" />
          <div className="-bottom-6 ml-4 ">
            <FaUpload className="absolute left-[216px] top-0 z-10 text-2xl text-[#004280]" />
            <input type="file" />
          </div>
        </div> */}
        <UploadImage />
      </div>

      {/* #form# */}
      <form className="absolute top-40 flex w-[90%] flex-wrap gap-4 rounded-2xl bg-slate-200 p-4 text-lg shadow-xl lg:w-[60%]">
        <div className="w-full text-right">
          <span>{enableEdit ? "Disable Edit" : "Enable Edit"}</span>
          <Switch
            className="mx-2 bg-slate-400"
            onChange={(e) => {
              setEnableEdit(e);
            }}
          ></Switch>
        </div>
        <label htmlFor="fName" className="w-[48%]">
          <div>First Name</div>
          <input
            type="text"
            id="fName"
            value={userInputData.fName}
            onChange={(e) => {
              setUserInputData({ ...userInputData, fName: e.target.value });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
        </label>
        <label htmlFor="lName" className="w-[48%]">
          <div>Last Name</div>
          <input
            type="text"
            id="lName"
            value={userInputData.lName}
            onChange={(e) => {
              setUserInputData({ ...userInputData, lName: e.target.value });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
        </label>
        <label htmlFor="userName" className="w-[48%]">
          <div>User Name</div>
          <input
            type="text"
            id="userName"
            value={userInputData.userId}
            onChange={(e) => {
              setUserInputData({ ...userInputData, userId: e.target.value });
            }}
            readOnly
            className="w-full rounded-md border-2 border-slate-300 bg-slate-200 px-2 py-1 text-xl outline-none"
          />
        </label>
        <label htmlFor="email" className="w-[48%]">
          <div>Email</div>
          <input
            type="email"
            id="email"
            value={userInputData.email}
            onChange={(e) => {
              setUserInputData({ ...userInputData, email: e.target.value });
            }}
            readOnly
            className="w-full rounded-md border-2 border-slate-300 bg-slate-200 px-2 py-1 text-xl outline-none"
          />
        </label>
        <label htmlFor="phone" className="w-[48%]">
          <div>Phone</div>
          <input
            type="text"
            id="phone"
            value={userInputData.phone}
            onChange={(e) => {
              setUserInputData({ ...userInputData, phone: e.target.value });
            }}
            readOnly
            className="w-full rounded-md border-2 border-slate-300 bg-slate-200 px-2 py-1 text-xl outline-none"
          />
        </label>
        <label htmlFor="department" className="w-[48%]">
          <div>Department</div>
          <select
            id="department"
            value={userInputData.department}
            onChange={(e) => {
              setUserInputData({
                ...userInputData,
                department: e.target.value,
              });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          >
            <option
              disabled={!enableEdit && "disabled"}
              value=""
              className="text-gray-500"
            >
              Select
            </option>
            <option disabled={!enableEdit && "disabled"} value="Real Estate">
              Real Estate
            </option>
            <option disabled={!enableEdit && "disabled"} value="Banking">
              Banking
            </option>
            <option disabled={!enableEdit && "disabled"} value="Interior">
              Interior
            </option>
            <option disabled={!enableEdit && "disabled"} value="All">
              All
            </option>
          </select>
        </label>

        {/* ##Bank Details## */}
        <label htmlFor="panNumber" className="w-[48%]">
          <div>PAN Number</div>
          <input
            type="text"
            id="panNumber"
            value={userInputData.panNumber}
            onChange={(e) => {
              setUserInputData({ ...userInputData, panNumber: e.target.value });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
        </label>
        <label htmlFor="bankName" className="w-[48%]">
          <div>Bank Name</div>
          <input
            type="text"
            id="bankName"
            value={userInputData.bankName}
            onChange={(e) => {
              setUserInputData({ ...userInputData, bankName: e.target.value });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
        </label>
        <label htmlFor="bankAccountNumber" className="w-[48%]">
          <div>Bank Account Number</div>
          <input
            type="number"
            id="bankAccountNumber"
            value={userInputData.accountNumber}
            onChange={(e) => {
              setUserInputData({
                ...userInputData,
                accountNumber: e.target.value,
              });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
        </label>
        <label htmlFor="ifscCode" className="w-[48%]">
          <div>IFSC Code</div>
          <input
            type="text"
            id="ifscCode"
            value={userInputData.ifsc}
            onChange={(e) => {
              setUserInputData({ ...userInputData, ifsc: e.target.value });
            }}
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
        </label>

        {/* ##Change-Password## */}
        <label htmlFor="oldPassword" className="w-[48%]">
          <div>Old Password</div>
          <input
            type={showOldPassword ? "text" : "password"}
            id="oldPassword"
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
          <span className="absolute right-2 top-9 cursor-pointer text-2xl">
            {showOldPassword ? (
              <FaEye onClick={() => setShowOldPassword(!showOldPassword)} />
            ) : (
              <FaEyeSlash
                onClick={() => setShowOldPassword(!showOldPassword)}
              />
            )}
          </span>
        </label>
        <label htmlFor="newPassword" className="w-[48%]">
          <div>New Password</div>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            readOnly={!enableEdit && "readOnly"}
            className={`w-full rounded-md px-2 py-1 text-xl capitalize  outline-none ${
              enableEdit
                ? "border-none bg-slate-50 shadow-inner shadow-slate-400 focus:bg-white focus:shadow-md"
                : "border-2 border-slate-300 bg-slate-200"
            }  `}
          />
          <span className="absolute right-2 top-9 cursor-pointer text-2xl">
            {showNewPassword ? (
              <FaEye onClick={() => setShowNewPassword(!showNewPassword)} />
            ) : (
              <FaEyeSlash
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            )}
          </span>
        </label>
        <div className="w-full text-right">
          {enableEdit && (
            <Button
              btnName={"Update Info"}
              onClick={handleUpdateInfoButton}
            ></Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingPage;
