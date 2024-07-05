import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import { Update_USER_Details_API } from "../../apiDetails";
import success_msg_icon from "../../assets/success-msg-icon.svg";
import user_Banking_icon from "../../assets/user-banking-info-icon.svg";
import { bankName } from "../StaticData/StaticData";
import Button from "../UI/Button";
import CardWhite from "../UI/CardWhite";
import Loader from "../UI/Loader/Loader";

const AddUserBankingInfo = () => {
  const [isFillInfoSuccess, setIsFillInfoSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id, fName, userId } = useSelector((state) => state.userData);
  // const dispatch = useDispatch()

  const userDetailUpdate = async (payload) => {
    try {
      setIsLoading(true);
      return await axios.patch(`${Update_USER_Details_API}/${id}`, payload, {
        withCredentials: true,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        throw Error(error.response.data.message);
      } else {
        throw Error(error.message);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userBankDetails = {
        avatar: { public_id: "", secure_url: "" },
        panNumber: e.target.panNumber.value.trim(),
        bankName: e.target.bankName.value.trim(),
        accountNumber: e.target.accountNumber.value.trim(),
        ifsc: e.target.ifscCode.value.trim(),
      };

      if (
        userBankDetails.panNumber &&
        userBankDetails.bankName &&
        userBankDetails.accountNumber &&
        userBankDetails.ifsc
      ) {
        const response = await userDetailUpdate(userBankDetails);

        if (!response) {
          throw Error("Network Error!");
        } else if (!response.data.success) {
          throw Error("Something went wrong!");
        } else {
          setIsLoading(false);
          toast.success(response.data.message || "Details saved!");
          setIsFillInfoSuccess(true);
        }
      } else {
        throw Error("Please fill all the details");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <CardWhite>
        <div className="absolute z-10 w-full bg-[#0093C1] py-1 text-center text-[#36ec54] shadow-md">
          Congrats! {fName} 🎉 Your account created successfully...
        </div>
        <div className="flex w-3/5 flex-col items-center gap-2">
          <p className="my-1 text-sm text-gray-600">
            Fill some additional details to set up your account.
          </p>
          <form
            onSubmit={handleFormSubmit}
            className="my-2 flex w-10/12 flex-col items-center gap-3"
          >
            <input
              type="text"
              name="panNumber"
              placeholder="PAN Number"
              className="shadow-inner shadow-slate-400 w-10/12 rounded-md bg-slate-100 px-2 py-1 outline-none focus:bg-white focus:shadow-md"
            />

            <select
              type="text"
              name="bankName"
              placeholder="Bank Name"
              className="shadow-inner shadow-slate-400 w-10/12 rounded-md bg-slate-100 px-2 py-1 outline-none focus:bg-white focus:shadow-md"
            >
              {bankName.map((e, i) => (
                <option key={i}>{e}</option>
              ))}
            </select>

            <input
              type="number"
              name="accountNumber"
              placeholder="Bank account number"
              className="shadow-inner shadow-slate-400 w-10/12 rounded-md bg-slate-100 px-2 py-1 outline-none focus:bg-white focus:shadow-md"
            />

            <input
              type="text"
              name="ifscCode"
              placeholder="IFSC code"
              className="shadow-inner shadow-slate-400 w-10/12 rounded-md bg-slate-100 px-2 py-1 outline-none focus:bg-white focus:shadow-md"
            />

            {isLoading ? (
              <Loader type={"type1"} />
            ) : (
              <Button btnName={"Save"} />
            )}
            <span
              className="absolute bottom-[-35px] cursor-pointer text-sm text-gray-400 hover:text-gray-800 active:scale-95"
              onClick={() => setIsFillInfoSuccess(true)}
            >
              Skip Now
            </span>
          </form>
        </div>
        <div className="flex h-full w-2/5 flex-col items-center justify-center bg-gradient-to-t from-sky-600 to-[#004280]">
          <img src={user_Banking_icon} />
        </div>
      </CardWhite>

      {isFillInfoSuccess && (
        <div
          className={`delay-2000 absolute z-20 flex h-full w-full translate-y-px flex-col items-center justify-center text-white backdrop-brightness-[25%] transition-all ease-in-out`}
        >
          <h2 className="text-3xl font-semibold">
            Congratulation {fName} 🎉🎊
          </h2>
          <img src={success_msg_icon} className="top-22 absolute max-h-56 " />
          <h2 className="text-3xl font-semibold">You are All set</h2>
          <h2 className="my-6 text-2xl font-semibold">
            Welcome to Spectical Asset Refferal Program
          </h2>
          {/* <Link to={`/${userId}/dashboard`} className="">
            <Button btnName={"Dashboard"} btnWidth={"w-46"}></Button>
          </Link> */}
          <Navigate to={`/${userId}/dashboard`} />
        </div>
      )}
    </>
  );
};

export default AddUserBankingInfo;
