import { GrContactInfo } from "react-icons/gr";
import { MdOutlineContactPhone } from "react-icons/md";
import { TiHomeOutline } from "react-icons/ti";
import { Link, NavLink } from "react-router-dom";

import helixcrm_logo from "../assets/helixcrm-logo.png";

const navigationMenuTop = [
  {
    text: "Home",
    path: "/",
    icon: <GrContactInfo />,
  },
  {
    text: "Contact",
    path: "/contact",
    icon: <MdOutlineContactPhone />,
  },
  {
    text: "About",
    path: "/about",
    icon: <TiHomeOutline />,
  },
];

const TopNavbar = () => {
  return (
    <main className="sticky z-50 flex w-full overflow-y-hidden bg-gradient-to-t from-slate-300 via-slate-200 to-slate-300 shadow-md">
      <Link to={"/"}>
        <img className="w-48" src={helixcrm_logo} />
      </Link>
      <nav className="flex gap-2 text-xl font-medium ">
        {navigationMenuTop.map((e, i) => {
          return (
            <NavLink
              key={i}
              to={e.path}
              active="true"
              className="flex gap-2 p-2 hover:rounded-md hover:bg-white  hover:underline hover:shadow-md hover:shadow-slate-600 "
            >
              <span className="text-2xl">{e.icon}</span>
              {e.text}
            </NavLink>
          );
        })}
      </nav>
      <div className="text-lg ">
        <Link
          to={"/get-started/signin"}
          className=" rounded-l-md border border-slate-500 p-2 hover:bg-gradient-to-t hover:from-[#0093C1] hover:to-[#004280] hover:text-slate-100 active:bg-gradient-to-r"
        >
          Sign In
        </Link>
        <Link
          to={"/get-started/signup"}
          className="rounded-r-md border border-slate-500 p-2 hover:bg-gradient-to-t hover:from-[#0093C1] hover:to-[#004280] hover:text-slate-100 active:bg-gradient-to-l"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
};

export default TopNavbar;
