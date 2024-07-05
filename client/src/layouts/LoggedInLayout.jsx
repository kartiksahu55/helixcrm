import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import ActivityCard from "../components/UI/Card/ActivityCard";
import Loader from "../components/UI/Loader/Loader";
import { AccountApiCall } from "../services/ApiCall/AccountApiCall";
import { EmployeeApiCall } from "../services/ApiCall/EmployeeApiCall";
import { LeadApiCall } from "../services/ApiCall/LeadsApiCall";
import {
  fetchAccountData,
  fetchEmployeeData,
  fetchLeadData,
} from "../slices/user/userDataSlice";
import SideNavbar from "./SideNavbar";

const LoggedInLayout = () => {
  const [isCollaps, setIsCollaps] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const checkIsLoadingCheck = useSelector((state) => state.isLoadingCheck);
  const dispatch = useDispatch();

  // console.log(checkIsLoadingCheck);
  // console.log("IsLoading: ", checkIsLoadingCheck);

  const getEmployeeData = async () => {
    // setIsLoading(true);
    console.log("inside");
    try {
      const employee = await EmployeeApiCall();
      dispatch(fetchEmployeeData(employee));
    } catch (error) {
      console.log(error.message);
      const errorMsg = error.message || "Internal server Error";
      toast.error(errorMsg);
    } finally {
      // setIsLoading(false);
    }
  };

  const getSalesDataApi = async () => {
    try {
      const data = await AccountApiCall();
      console.log(data);
      dispatch(fetchAccountData(data));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

 const getLeadsDataApi = async () => {
    setIsLoading(true);
    try {
      const data = await LeadApiCall()
      console.log(data);
      dispatch(fetchLeadData(data));
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      const errorMsg = error.message || "Internal server Error";
      toast.error(errorMsg);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getEmployeeData();
    getSalesDataApi();
    getLeadsDataApi()
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <SideNavbar checkIsCollaps={setIsCollaps}></SideNavbar>
      <main
        className={`absolute right-0 top-12 h-[calc(100vh-48px)] overflow-auto pl-8 transition-all duration-500 ${
          isCollaps ? "w-[calc(100vw-220px)]" : "w-[calc(100vw-90px)]"
        } ${
          checkIsLoadingCheck || isLoading ? "bg-slate-500 " : "bg-slate-50"
        }`}
      >
        {checkIsLoadingCheck || isLoading ? (
          <Loader type={"type3"}></Loader>
        ) : (
          <Outlet />
        )}
      </main>
      <div className=" z-50 transition-all">
        <ActivityCard></ActivityCard>
      </div>
    </>
  );
};

export default LoggedInLayout;
