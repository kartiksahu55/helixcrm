import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { FETCH_USER_DETAILS } from "./apiDetails";
// import EmployeeDetails from "./components/Employee/EmployeeDetails";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Loader from "./components/UI/Loader/Loader";
import LoggedInLayout from "./layouts/LoggedInLayout";
import AboutPage from "./pages/AboutPage";
import Accounts from "./pages/Accounts";
import ChatPage from "./pages/ChatPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import GetStarted from "./pages/GetStarted";
import GroupPage from "./pages/GroupPage";
import HomePage from "./pages/HomePage";
import Leads from "./pages/Leads";
import NoPage from "./pages/NoPage";
// import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ReferralPage from "./pages/ReferralPage";
import SettingPage from "./pages/SettingPage";
import SupportPage from "./pages/SupportPage";
import Team from "./pages/Team";
import {
  fetchUserData,
  isLoadingCheck,
  isUserLoggedIn,
} from "./slices/user/userDataSlice";

function App() {
  const checkIsUserLoggedIn = useSelector((state) => state.isUserLoggedIn);
  const { userId, role } = useSelector((state) => state.userData);
  const checkIsLoading = useSelector((state) => state.isLoadingCheck);
  const dispatch = useDispatch();

  console.log("Role: ", role);

  useEffect(() => {
    (async () => {
      try {
        dispatch(isLoadingCheck(true));
        const response = await axios.get(FETCH_USER_DETAILS, {
          withCredentials: true,
        });

        if (response.data) {
          dispatch(isLoadingCheck(false));
          dispatch(fetchUserData(response.data.data));
          dispatch(isUserLoggedIn(true));
        } else {
          throw Error("Something went wrong!");
        }
      } catch (error) {
        console.log(error);
        dispatch(isLoadingCheck(false));
      }
    })();
  }, []);
  console.log("App Rendering");
  return (
    <>
      {checkIsLoading && !checkIsUserLoggedIn ? (
        <div className="flex h-[100vh] w-[100vw] bg-slate-500 ">
          <Loader type={"type3"}></Loader>
        </div>
      ) : (
        <Routes path="/" element={<HomePage />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NoPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="get-started" element={<GetStarted />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Logged In User Dashboard */}
          <Route path={userId} element={<LoggedInLayout />}>
            <Route path="*" element={<NoPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            {role === "super-admin" || role === "admin" ? (
              <>
                <Route path="team" element={<Team />} />
                <Route path="accounts" element={<Accounts />} />
              </>
            ) : (
              ""
            )}
            <Route path="leads" element={<Leads />} />
            <Route path="group" element={<GroupPage />} />
            <Route path="setting" element={<SettingPage />} />
            <Route path="referral" element={<ReferralPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="support" element={<SupportPage />} />
            {/* <Route path="employee" element={<EmployeeDetails />} /> */}
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
