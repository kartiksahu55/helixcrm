import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { SIGNUP_API } from "../../apiDetails";
import user_Login_icon from "../../assets/user-login-info-icon.svg";
import { fetchUserData } from "../../slices/user/userDataSlice";
import Button from "../UI/Button";
import CardWhite from "../UI/CardWhite";
import Loader from "../UI/Loader/Loader";
import { validateStrongPassword } from "../validateUserDetails";
import AddUserBankingInfo from "./AddUserBankingInfo";

const AddUserLoginInfo = ({ phone }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFillInfoSuccess, setIsFillInfoSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [userIdName, setUserIdName] = useState({});

  const dispatch = useDispatch();

  const signUpApiCall = async (userLoginDetails) => {
    try {
      setIsLoading(true);
      return await axios.post(SIGNUP_API, userLoginDetails, {
        withCredentials: true,
      });
    } catch (error) {
      if (error.response) {
        throw Error(error.response.data.message);
      } else {
        throw Error(error.message);
      }
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    try {
      const userLoginDetails = {
        phone,
        fName: e.target.fName.value.trim(),
        lName: e.target.lName.value.trim(),
        email: e.target.email.value.trim(),
        sector: e.target.sector.value.trim(),
        password: e.target.password.value.trim(),
      };

      if (userLoginDetails.fName.length === 0) {
        throw Error("Please enter your full name");
      } else if (userLoginDetails.password.length === 0) {
        throw Error("Please enter your password");
      } else if (!validateStrongPassword(userLoginDetails.password)) {
        throw Error(
          "Please enter a strong password (min length=8, atleast one small, capital letter, and special case",
        );
      } else if (userLoginDetails.password != e.target.confirmPassword.value) {
        throw Error("Password doesn't match!");
      } else {
        // Calling SignUp API
        const response = await signUpApiCall(userLoginDetails);

        console.log(response.data._id);
        if (!response) {
          throw Error("Network Error");
        } else if (!response.data.success) {
          throw Error("Something went wrong! Please try again.");
        } else {
          console.log("Success");
          setIsLoading(false);
          toast.success("Account Created Successfully.");
          console.log(response.data.data._id);
          dispatch(fetchUserData(response.data.data));
          setIsFillInfoSuccess(true);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {!isFillInfoSuccess && (
        <CardWhite>
          <div className="flex w-3/5 flex-col items-center gap-2">
            <h2 className="text-3xl font-semibold ">Create Account</h2>
            <form
              className="my-2 flex w-10/12 flex-col items-center gap-3"
              onSubmit={handleCreateAccount}
            >
              <label className="w-10/12">
                <input
                  type="text"
                  name="fName"
                  placeholder="First Name"
                  required
                  className="w-full rounded-md border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white focus:shadow-md"
                />
                <span className="absolute text-xl text-red-400">*</span>
              </label>

              <label className="w-10/12">
                <input
                  type="text"
                  name="lName"
                  placeholder="Last Name"
                  required
                  className="w-full rounded-md border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white focus:shadow-md"
                />
                <span className="absolute text-xl text-red-400">*</span>
              </label>

              <label className="w-10/12">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  maxLength={40}
                  className="w-full rounded-md border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white focus:shadow-md"
                />
                <span className="absolute text-xl text-red-400">*</span>
              </label>

              <label className="w-10/12">
                <select
                  name="sector"
                  required
                  className="w-full rounded-md border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white focus:shadow-md"
                >
                  <option value="" className="text-gray-500">
                    Select Referal Sector
                  </option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Banking">Banking</option>
                  <option value="Interior">Interior</option>
                  <option value="All">All</option>
                </select>
                <span className="absolute text-xl text-red-400">*</span>
              </label>

              <label className="w-10/12">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  minLength={8}
                  required
                  className="w-full rounded-md border-gray-400 bg-slate-100 py-1 pl-2 pr-8 shadow-inner shadow-slate-400 outline-none focus:bg-white focus:shadow-md"
                />
                <span className="absolute right-2 top-2 cursor-pointer text-xl">
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
                <span className="absolute text-xl text-red-400">*</span>
              </label>

              <label className="w-10/12">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  minLength={8}
                  required
                  className="w-full rounded-md border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white focus:shadow-md"
                />
                <span className="absolute right-2 top-2 cursor-pointer text-xl">
                  {showConfirmPassword ? (
                    <FaEye
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    />
                  )}
                </span>
                <span className="absolute text-xl text-red-400">*</span>
              </label>

              {!isLoading ? (
                <Button btnName={"Create"}></Button>
              ) : (
                <Loader type={"type1"} />
              )}
            </form>
          </div>
          <div className="flex h-full w-2/5 flex-col items-center justify-center bg-gradient-to-t from-sky-600 to-[#004280]">
            <img src={user_Login_icon} />
          </div>
        </CardWhite>
      )}

      {isFillInfoSuccess && <AddUserBankingInfo />}
    </>
  );
};

export default AddUserLoginInfo;
