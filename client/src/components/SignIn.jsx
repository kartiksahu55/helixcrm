import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import { SIGNIN_API } from "../apiDetails";
import {
  fetchUserData,
  isUserLoggedIn,
} from "../slices/user/userDataSlice";
import Button from "./UI/Button";
import CardWhite from "./UI/CardWhite";
import Loader from "./UI/Loader/Loader";
import {
  validateEmailAddress,
  validatePhoneNumber,
} from "./validateUserDetails";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const checkIsUserLoggedIn = useSelector((state) => state.isUserLoggedIn);
  const isLoading = useSelector((state) => state.isLoadingCheck);
  const { userId } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  // This Function Call Signin API
  const signinApiCall = async (loginDetails) => {
    try {
      setIsLoadingBtn(true);
      return axios.post(`${SIGNIN_API}`, loginDetails, {
        withCredentials: true,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };

  // This Function Handle Signin/Login process
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const signinData = {
        email: e.target.email.value,
        phone: e.target.phone.value,
        password: e.target.password.value,
      };

      // Check user input data
      if (signinData.email && signinData.phone) {
        throw Error("Please enter only email or phone.");
      } else if (
        !signinData.email &&
        !signinData.phone &&
        !signinData.password
      ) {
        throw Error("Please enter login id and password");
      } else if (!signinData.password) {
        throw Error("Please enter login id and password");
      } else if (!validateEmailAddress(signinData.email) && !signinData.phone) {
        throw Error("Please enter a valid email.");
      } else if (!validatePhoneNumber(signinData.phone) && !signinData.email) {
        throw Error("Please enter a valid phone number.");
      }

      const response = await signinApiCall(signinData);
      console.log("response: ", response);
      if (!response) {
        throw Error("Network error!");
      } else if (!response.data.success) {
        throw Error("Oops! Something went wrong.");
      } else {
        setIsLoadingBtn(false);
        toast.success("Signed in successfully");
        // Redux_Toolkit Store Data
        dispatch(isUserLoggedIn(true));
        dispatch(fetchUserData(response.data.data));
        console.log(response.data.data);
      }
    } catch (error) {
      setIsLoadingBtn(false);

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (!checkIsUserLoggedIn) {
      dispatch(fetchUserData({}));
    }
  }, [checkIsUserLoggedIn]);

  console.log("checking Success", checkIsUserLoggedIn, isLoading);

  return (
    <>
      {/* #Sign in Card# */}
      <CardWhite>
        {/* ##Sign in Container## */}
        <div className="flex h-full w-1/2 flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold">Sign In</h2>
          <p className="my-1 text-sm text-gray-600">
            use your email or password
          </p>

          {/* SignIn Form */}
          <form
            onSubmit={handleSignIn}
            className="my-2 flex w-10/12 flex-col items-center gap-2"
          >
            <input
              type="text"
              name="email"
              placeholder="Email"
              className=" w-full rounded-md border-none border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white"
            />

            <p className="text-gray-600">or</p>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className=" w-full rounded-md border-none border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white"
            />

            <div className="w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className=" w-full rounded-md border-none border-gray-400 bg-slate-100 px-2 py-1 shadow-inner shadow-slate-400 outline-none focus:bg-white"
              />
              <span className="absolute right-2 top-2 cursor-pointer text-xl">
                {showPassword ? (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                )}
              </span>
            </div>

            <Link to={"/"} className="cursor-pointer text-sm text-gray-700">
              Forgot Password?
            </Link>

            {isLoadingBtn ? (
              <Loader type={"type1"} />
            ) : (
              <Button btnName={"Sign In"}></Button>
            )}
          </form>
        </div>

        {/* ##Sign Up Greeting Container## */}
        <div className="flex h-full w-1/2 flex-col items-center justify-center rounded-l-[120px] bg-gradient-to-t from-sky-600 to-[#004280]">
          <h2 className="text-3xl font-bold text-white ">Welcome To</h2>
          <h2 className="text-3xl font-bold text-white ">Helix CRM</h2>
          <p className="my-5 w-10/12 text-center text-sm text-slate-300">
            Register with your personal details to use all App features.
          </p>
          <Link to={"/get-started/signup"} className="absolute bottom-20">
            <Button btnName={"Sign Up"} btnType={"secondaryButton"}></Button>
          </Link>
        </div>
      </CardWhite>
      {checkIsUserLoggedIn && <Navigate to={`/${userId}/dashboard`} />}
    </>
  );
};

export default SignIn;
