import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import { SEND_OTP_API } from "../apiDetails";
import OtpVerification from "./OTP/OtpVerification";
import Button from "./UI/Button";
import CardWhite from "./UI/CardWhite";
import Loader from "./UI/Loader/Loader";
import { validatePhoneNumber } from "./validateUserDetails";

const CLIENT_SECRET_KEY_TO_SEND_OTP =
  "sPectiCalaSSet2021apPverIfy956913_@stuff@Kartik";

const SignUp = () => {
  const [isOTPSentSeccess, setIsOTPSentSeccess] = useState(false);
  const [generatedOTP, setgeneratedOTP] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const checkIsUserLoggedIn = useSelector((state) => state.isUserLoggedIn);
  const { userId } = useSelector((state) => state.userData);

  // This Function Send OTP using API
  const sendOtpApi = async (phone) => {
    try {
      setIsloading(true);
      const response = await axios.post("https://helixcrmserver.vercel.app/api/v1/user/signup", {
        keyToGenerateOtp: CLIENT_SECRET_KEY_TO_SEND_OTP,
        phone,
        OTPType: "bulkV2",
      });

      setIsloading(false);

      if (response.data.success) {
        toast.success("OTP Sent Successfully");
        console.log(response);
        setIsOTPSentSeccess(!isOTPSentSeccess);
        setgeneratedOTP(response.data.otp);
      } else {
        throw Error("Something went wrong! Please try again.");
      }
    } catch (error) {
      setIsloading(false);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // This Function Execute Send OTP When User Submit the Form
  const handleSendOtp = (e) => {
    try {
      e.preventDefault();

      const phoneNum = e.target.phone.value;

      if (validatePhoneNumber(phoneNum)) {
        sendOtpApi(phoneNum);
        setPhone(phoneNum);
      } else {
        toast.error("Please Enter Valid Phone Number");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {/* #Create Account Card# */}
      {!isOTPSentSeccess && (
        <CardWhite>
          {/* ##Sign In Greeting Container## */}
          <div className="flex h-full w-1/2 flex-col items-center justify-center rounded-r-[120px] bg-gradient-to-t from-[#0093C1] to-[#004280]">
            <h2 className="text-3xl font-bold text-white ">Welcome To</h2>
            <h2 className="text-3xl font-bold text-white ">
            Helix CRMx
            </h2>
            <p className="my-5 w-10/12 text-center text-sm text-slate-300">
              already have an account
            </p>
            <Link to={"/get-started/signin"} className="absolute bottom-20">
              <Button btnName={"Sign In"} btnType={"secondaryButton"}></Button>
            </Link>
          </div>

          {/* ##Create Account Container## */}
          <div className="flex h-full w-1/2 flex-col items-center justify-center gap-1">
            <h2 className="text-3xl font-semibold">Create an Account</h2>
            <p className="my-1 text-sm text-gray-600">
              please enter your phone number to create.
            </p>

            {/* SignIn Form */}
            <form
              onSubmit={handleSendOtp}
              className="my-2 flex w-10/12 flex-col items-center gap-3"
            >
              <input
                type="number"
                name="phone"
                placeholder="Phone"
                className="w-full rounded-md border-none border-gray-400 bg-slate-100 px-2 py-1 text-xl shadow-inner shadow-slate-400 outline-none focus:bg-white"
              />

              {!isLoading ? (
                <Button btnName={"Send OTP"}></Button>
              ) : (
                <Loader type={"type1"}></Loader>
              )}
            </form>
          </div>
        </CardWhite>
      )}

      {/* OTP Verification */}

      {isOTPSentSeccess && (
        <OtpVerification
          phone={phone}
          OTP={generatedOTP}
          isOTPSentSeccess={isOTPSentSeccess}
          changePhoneNum={setIsOTPSentSeccess}
        ></OtpVerification>
      )}
      {checkIsUserLoggedIn && <Navigate to={`/${userId}/dashboard`} />}
    </>
  );
};

export default SignUp;
