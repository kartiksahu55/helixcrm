import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSupport } from "react-icons/bi";
import { FaSlideshare } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaBuildingUser, FaPeopleGroup } from "react-icons/fa6";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { ImMakeGroup } from "react-icons/im";
import { IoMdLogOut } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import {
  MdAccountBalanceWallet,
  MdDashboard,
  MdMenuOpen,
} from "react-icons/md";
import { TbSettingsCog } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";

import { LOGOUT_API } from "../apiDetails";
import helixcrm_wt_collapsed_logo from "../assets/helixcrm-logo-collapsed.png";
import helixcrm_wt_logo from "../assets/helixcrm-logo-wt.png";
import user_default_avatar from "../assets/user-default-avatar.png";
import {
  fetchEmployeeData,
  fetchLeadData,
  fetchUserData,
  isUserLoggedIn,
} from "../slices/user/userDataSlice";

const userNavigationSideMainMenu = [
  {
    text: "Dashboard",
    path: "dashboard",
    icon: <MdDashboard />,
  },
  {
    text: "Team",
    path: "team",
    icon: <ImMakeGroup />,
  },
  {
    text: "Leads",
    path: "leads",
    icon: <FaBuildingUser />,
  },
  {
    text: "Accounts",
    path: "accounts",
    icon: <MdAccountBalanceWallet />,
  },
  {
    text: "Referral",
    path: "referral",
    icon: <FaSlideshare />,
  },
  {
    text: "Group",
    path: "group",
    icon: <FaPeopleGroup />,
  },
  {
    text: "Setting",
    path: "setting",
    icon: <TbSettingsCog />,
  },
];

const userNavigationSideOtherMenu = [
  {
    text: "Chat",
    path: "chat",
    icon: <HiChatBubbleLeftRight />,
  },
  {
    text: "Support",
    path: "support",
    icon: <BiSupport />,
  },
];

const SideNavbar = ({ checkIsCollaps }) => {
  const [isCollaps, setIsCollaps] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUserNavigation, setFilteredUserNavigation] = useState([]);

  const { fName, lName, userId, role, avatar } = useSelector(
    (state) => state.userData,
  );
  const checkIsUserLoggedIn = useSelector((state) => state.isUserLoggedIn);
  const userRole = useSelector(state=>state.userData.role)
  const dispatch = useDispatch();

  console.log("userData: ", role);

  // This Function Used to LoggedOut the User
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(LOGOUT_API, { withCredentials: true });
      console.log(response);
      if (response.data.success) {
        dispatch(isUserLoggedIn(false));
        dispatch(fetchEmployeeData([]));
        dispatch(fetchLeadData([]));
        setIsLoggedOut(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response.status === 401) {
        dispatch(isUserLoggedIn(false));
        dispatch(fetchEmployeeData([]));
        dispatch(fetchLeadData([]));
        setIsLoggedOut(true);
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.log(error.response.status);
    } finally {
      setIsLoading(false);
    }
  };

  // This Function Handle to Collaps Navbar
  const handleCollapsSideBar = () => {
    setIsCollaps(!isCollaps);
    checkIsCollaps(!isCollaps);
  };

  useEffect(() => {
    if (role === "super-admin" || role === "admin") {
      setFilteredUserNavigation(userNavigationSideMainMenu);
    } else if (role === "employee") {
      setFilteredUserNavigation(
        userNavigationSideMainMenu.filter((e) => {
          if (e.path !== "team" || e.path !== "team") {
            return e;
          }
        }),
      );
    }
  }, [isLoggedOut]);

  return (
    <>
      {/* ------#SideBar#------ */}
      <main
        className={`absolute left-0 z-50 h-screen overflow-hidden bg-[#004280] pl-3 transition-all duration-500 ${
          isCollaps ? "w-[220px]" : "w-[90px]"
        }`}
      >
        {/* ------##Logo-Bar##------ */}
        <div className="top-4">
          <div className="absolute brightness-0 grayscale invert transition-all">
            {isCollaps ? (
              <img src={helixcrm_wt_logo} className="w-40" />
            ) : (
              <img src={helixcrm_wt_collapsed_logo} className="w-11 " />
            )}
          </div>
          <span
            className={`absolute right-0 cursor-pointer text-4xl text-white transition-all duration-500 ${
              !isCollaps && "-rotate-180"
            }`}
          >
            <MdMenuOpen onClick={handleCollapsSideBar}></MdMenuOpen>
          </span>
        </div>

        {/* ------##Use Avatar##------ */}
        <div className="right-2 top-20 flex h-20 w-20 rounded-full bg-white bg-gradient-to-t from-sky-100 via-blue-900 to-sky-100 bg-origin-padding shadow-md">
          <img
            src={avatar ? avatar.secure_url : user_default_avatar}
            alt=""
            className="h-[72px] rounded-full "
          />
        </div>

        {/* ------##Main-Menu-Bar##------ */}
        <div className="top-24 w-[105%] ">
          {filteredUserNavigation.map((e, i) => {
            return (
              <NavLink
                key={i}
                to={`/${userId}/${e.path}`}
                active="true"
                className={`mt-1 flex w-full gap-4 rounded-l-md p-1 text-xl text-slate-200 transition-all duration-500 hover:bg-slate-50 hover:text-[#004280] hover:shadow-md hover:shadow-slate-500 ${
                  isCollaps ? "pl-4" : "pl-0"
                }`}
              >
                <div className="text-3xl">{e.icon}</div>
                <div className={`${!isCollaps && "hidden"} w-full `}>
                  {e.text}
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* ------##Other-Menu-Bar##------ */}
        <div className="top-36 w-[105%]">
          <p className="text-sm font-semibold">Other</p>
          {userNavigationSideOtherMenu.map((e, i) => {
            return (
              <NavLink
                key={i}
                to={`/${userId}/${e.path}`}
                active="true"
                className={`mt-1 flex w-[calc(100%-16px)] gap-4 rounded-l-2xl p-1 text-xl text-slate-200 transition-all duration-500 hover:bg-slate-50 hover:text-[#004280] hover:shadow-md hover:shadow-slate-500 ${
                  isCollaps ? "pl-4" : "pl-0"
                }`}
              >
                <div className="text-3xl">{e.icon}</div>
                <div className={`${!isCollaps && "hidden"} w-full `}>
                  {e.text}
                </div>
              </NavLink>
            );
          })}
        </div>
      </main>

      {/* ------#TopBar#------ */}
      <main
        className={`absolute right-0 z-40 h-12 bg-slate-300 shadow-lg transition-all duration-500 ${
          isCollaps ? "w-[calc(100vw-220px)]" : "w-[calc(100vw-90px)]"
        }`}
      >
        <div className="absolute left-5 top-[20%] rounded-md bg-slate-100 px-2 font-serif text-xl tracking-wider text-sky-800 shadow-md ">
          {role.toUpperCase() + " " + "DASHBOARD"}
        </div>
        <div className="absolute right-[3%] flex h-full gap-6 tracking-wider text-[#050505]">
          <div className="flex gap-1 rounded-md bg-slate-50 px-2 py-1 font-semibold">
            <FaUserCircle className="text-xl" />
            <span>
              {fName} {lName}
            </span>
          </div>
          <IoNotifications className="cursor-pointer rounded-md p-1 text-3xl shadow-md hover:bg-[#004280] hover:text-slate-300 active:scale-95" />
          <div
            className={`flex cursor-pointer gap-1 rounded-md p-1 shadow-md ${
              isLoading ? "animate-pulse" : ""
            }`}
            onClick={isLoading ? "" : () => handleLogout()}
          >
            <IoMdLogOut
              className={`text-2xl ${isLoading ? "animate-spin" : ""}`}
            />

            <span>Logout</span>
          </div>
        </div>
      </main>
      {!checkIsUserLoggedIn && <Navigate to="/get-started/signin" />}
    </>
  );
};

export default SideNavbar;
