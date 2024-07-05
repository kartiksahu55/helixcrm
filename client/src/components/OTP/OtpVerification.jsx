import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiTimer2Fill } from "react-icons/ri";
import { TbRefreshDot } from "react-icons/tb";
import { TiEdit } from "react-icons/ti";

import { SEND_OTP_API } from "../../apiDetails";
import otp_verification_icon from "../../assets/otp-verification-icon.svg";
import AddUserLoginInfo from "../AddInfo/AddUserLoginInfo";
import Button from "../UI/Button";
import CardWhite from "../UI/CardWhite";
import Loader from "../UI/Loader/Loader";

const CLIENT_SECRET_KEY_TO_SEND_OTP =
  "kArtik@_heLixcRM&3894658@stuff";

const OtpVerification = ({ phone, OTP, changePhoneNum }) => {
  const [generatedOTP, setgeneratedOTP] = useState(OTP);
  const [userReceivedOTP, setUserReceivedOTP] = useState("");
  const [verifyOTPSuccess, setVerifyOTPSuccess] = useState(false);
  const [resendOTPType, setResendOTPtype] = useState("bulkV2");
  const [expireOTPTimer, setExpireOTPTimer] = useState(59);
  const [isOTPExpired, setIsOTPExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // This Function Resend OTP using API
  const sendOtpApi = async (resendOTPType) => {
    try {
      setIsLoading(true);
      const response = await axios.post(SEND_OTP_API, {
        keyToGenerateOtp: CLIENT_SECRET_KEY_TO_SEND_OTP,
        phone,
        OTPType: resendOTPType,
      });

      if (response.data.success) {
        setIsLoading(false);
        toast.success("OTP Sent Successfully");
        console.log(response);
        setgeneratedOTP(response.data.otp);
        setExpireOTPTimer(59);
        setIsOTPExpired(false);
      } else {
        throw Error("Something went wrong! Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
      toast.error(error.message);
    }
  };

  // This Function Execute OTP Validation When User Submit OTP
  const handleValidateOTP = (e) => {
    e.preventDefault();
    try {
      if (isOTPExpired) {
        throw Error("OTP han been expired!");
      }
      if (userReceivedOTP == generatedOTP) {
        toast.success("OTP verified successfully!");
        setVerifyOTPSuccess(true);
      } else {
        toast.error("The OTP Entered is Incorrect!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (expireOTPTimer > 0) {
        setExpireOTPTimer(expireOTPTimer - 1);
      } else {
        clearInterval(interval);
        setIsOTPExpired(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [expireOTPTimer]);

  return (
    <>
      {!verifyOTPSuccess && (
        <CardWhite>
          <div className="flex w-3/5 flex-col items-center gap-3">
            <h2 className="text-3xl font-semibold">Create Account</h2>
            <p className="text-sm text-gray-600">
              Enter 6 digit otp received in your phone number...
            </p>
            <div className="flex gap-3 ">
              <p className="font-semibold tracking-widest text-sky-800">
                +91 {phone}{" "}
              </p>
              <span
                onClick={() => changePhoneNum(false)}
                className="cursor-pointer text-xl text-red-400"
              >
                <TiEdit />
              </span>
            </div>

            <form
              className="flex flex-col items-center gap-2"
              onSubmit={handleValidateOTP}
            >
              <input
                type="text"
                name="userOTP"
                placeholder="OTP"
                maxLength={6}
                minLength={6}
                onChange={(e) => setUserReceivedOTP(e.target.value)}
                className="w-44 rounded-md border-gray-400 bg-slate-100 px-2 py-1 text-center text-2xl font-semibold tracking-[10px] shadow-inner shadow-slate-400 outline-none focus:bg-white"
              />

              {isOTPExpired ? (
                <p className="my-2 text-sm font-semibold tracking-widest text-red-500 ">
                  OTP has been expired!
                </p>
              ) : (
                <div className="my-2 flex items-center gap-1">
                  <RiTimer2Fill className="animate-spin text-lg text-sky-800" />
                  <input
                    type="text"
                    readOnly
                    className="w-14 px-1 text-center"
                    value={`00:${
                      expireOTPTimer < 10
                        ? "0" + expireOTPTimer
                        : expireOTPTimer
                    }`}
                  />
                  <span>|</span>
                  <p className="font-semibold tracking-wide text-sky-800">
                    OTP has been sent.
                  </p>
                </div>
              )}

              {userReceivedOTP &&
              userReceivedOTP.length === 6 &&
              !isOTPExpired ? (
                <Button btnName={"Validate"}></Button>
              ) : (
                <span className="w-32 rounded-lg bg-slate-200 px-2 py-1 text-center text-lg text-slate-400">
                  Validate
                </span>
              )}
            </form>

            <div className="mt-4 text-sm text-slate-500 ">
              {isOTPExpired && !isLoading && (
                <select
                  required
                  className="absolute right-28 w-14 outline-none"
                  onChange={(e) => {
                    setResendOTPtype(e.target.value);
                  }}
                >
                  <option value="voice">Voice</option>
                  <option value="bulkV2">Text</option>
                </select>
              )}
              {!isOTPExpired ? (
                <span className="flex gap-1 text-slate-300">
                  <TbRefreshDot></TbRefreshDot>
                  Resend OTP
                </span>
              ) : isLoading ? (
                <Loader type={"type1"}></Loader>
              ) : (
                <span
                  className="flex cursor-pointer gap-1 hover:text-sky-800"
                  onClick={() => {
                    sendOtpApi(resendOTPType);
                  }}
                >
                  <TbRefreshDot></TbRefreshDot>
                  Resend OTP
                </span>
              )}
            </div>
          </div>

          {/* #Right SVG Container# */}
          <div className="flex h-full w-2/5 flex-col items-center justify-center bg-gradient-to-t from-sky-600 to-[#004280]">
            <img src={otp_verification_icon} />
          </div>
        </CardWhite>
      )}

      {verifyOTPSuccess && <AddUserLoginInfo phone={phone} />}
    </>
  );
};

export default OtpVerification;
