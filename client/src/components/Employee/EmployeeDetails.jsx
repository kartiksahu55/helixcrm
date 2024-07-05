import { Button } from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import emptyInboxSvg from "../../assets/empty-inbox.svg";
import { EmployeeApiCall } from "../../services/ApiCall/EmployeeApiCall";
import { fetchEmployeeData } from "../../slices/user/userDataSlice";
import AddEmployee from "../Employee/AddEmployee";
import GroupSectorButton from "../UI/GroupSectorButton";

const EmployeeDetails = ({ setEmployeeLeadData }) => {
  const [isAddEmployeeComponent, setIsAddEmployeeComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshEmployee, setRefreshEmployee] = useState(true);
  const [editEmployeeDetails, setEditEmployeeDetails] = useState(null);

  const dispatch = useDispatch();

  const employeeData = useSelector((state) => state.employeeData);
  const { role, sector } = useSelector((state) => state.userData);
  const [leadCategory, setLeadCategory] = useState(
    role === "super-admin" ? "Real Estate" : sector,
  );

  const filteredEmployeeData = employeeData?.filter(
    (e) => e.sector === leadCategory,
  );
  // const filteredLeadData = employeeData.filter((e) =>
  //   employeeLeadData
  //     ? e.leadOf === employeeLeadData._id
  //     : e.sector === leadCategory,
  // );

  // This Function handle to open the Employee menu bar
  const handleEmployeeMenuBar = (key) => {
    const employee = employeeData.map((e) => {
      return e._id === key ? { ...e, menu: true } : { ...e, menu: false };
    });
    dispatch(fetchEmployeeData(employee));
  };

  // This Function handle to close the Employee menu bar
  const handleCancelEmployeeMenu = () => {
    const employee = employeeData.map((e) => {
      return { ...e, menu: false };
    });
    dispatch(fetchEmployeeData(employee));
  };

  const handleShowLeadData = (e) => {
    setEmployeeLeadData(e);
    handleCancelEmployeeMenu();
  };

  // This Function handle to edit/update the Employee details
  const handleEditEmployeeData = (e) => {
    setEditEmployeeDetails(e);
    handleCancelEmployeeMenu();
  };

  // This Hook Call Fetch Leads Data Api
  useEffect(() => {
    if (employeeData.length === 0 && refreshEmployee) {
      (async () => {
        setIsLoading(true);
        console.log("inside");
        try {
          const employee = await EmployeeApiCall();
          console.log(employee);
          dispatch(fetchEmployeeData(employee));
        } catch (error) {
          console.log(error.message);
          const errorMsg = error.message || "Internal server Error";
          toast.error(errorMsg);
        } finally {
          setIsLoading(false);
          setRefreshEmployee(false);
        }
      })();
    }
  }, [refreshEmployee]);

  return (
    <>
      <Button
        className="bg-blue-800 text-white hover:bg-white"
        onClick={() => {
          !editEmployeeDetails
            ? setIsAddEmployeeComponent(!isAddEmployeeComponent)
            : !isAddEmployeeComponent;
          setEditEmployeeDetails(null);
        }}
      >
        {isAddEmployeeComponent || editEmployeeDetails
          ? "Go Back"
          : "Add New Employee"}
      </Button>

      {isAddEmployeeComponent || editEmployeeDetails ? (
        <AddEmployee editEmployeeDetails={editEmployeeDetails} />
      ) : (
        <div className="w-full ">
          {employeeData?.length === 0 ? (
            // This Run when employee data doesn't exist.
            <div className="h-72 w-64 overflow-hidden rounded-xl shadow-lg">
              {!isLoading ? (
                <div>
                  <div className="rounded-b-[60px] bg-slate-200 shadow-md">
                    <img src={emptyInboxSvg} className="w-2/3 " />
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-semibold">Empty Employee Data</p>
                    <p className="mt-2 text-sm">
                      Looks like you haven't created employee data yet...
                    </p>
                    <Button
                      onClick={() =>
                        setIsAddEmployeeComponent(!isAddEmployeeComponent)
                      }
                      className="mt-3 bg-slate-200"
                    >
                      Add Employee
                    </Button>
                  </div>
                </div>
              ) : (
                // Show Loading Container
                <div className="h-full animate-pulse">
                  <div className="h-2/5 rounded-b-[60px] bg-slate-200 shadow-md">
                    {/* <img src={emptyInboxSvg} className="w-2/3 " /> */}
                  </div>
                  <div className="w-2/3 p-2 text-center">
                    <div className="col-span-2 my-5 h-4 rounded bg-slate-600"></div>
                    <div className="col-span-1 my-5 h-4 rounded bg-slate-400"></div>
                    <div className="mt-3 rounded-lg bg-slate-200 py-2">
                      Loading...
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show Employee Details
            <>
              <div className="mt-5">
                <div className=" text-2xl font-semibold">
                  Employees: {filteredEmployeeData?.length}
                </div>
                <span className="text-slate-600">
                  All the employees are listed here
                </span>
              </div>

              {role === "super-admin" ? (
                <div>
                  <GroupSectorButton
                    leadCategory={leadCategory}
                    setLeadCategory={setLeadCategory}
                  />
                </div>
              ) : (
                ""
              )}

              <Search
                placeholder="Search Employee"
                enterButton
                className="my-3 w-1/2"
              ></Search>
              <div className=" flex flex-wrap gap-4 rounded-xl">
                {filteredEmployeeData.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="min-h-72 m-0 w-64 rounded-xl border border-sky-700 bg-slate-200 p-3 text-left shadow-md transition-all hover:border-none hover:shadow-2xl"
                    >
                      <div className="h-7/12 tracking-wide">
                        {/* Dropdown UI */}
                        {e.menu && (
                          <ul
                            className={`absolute right-0 z-10 h-20 w-32 rounded-lg bg-white p-2 shadow-lg ${
                              e.dropDown ? "hidden" : ""
                            }`}
                          >
                            <MdCancel
                              className="absolute -right-1 -top-1 cursor-pointer text-lg text-red-600 active:scale-90"
                              onClick={handleCancelEmployeeMenu}
                            />
                            <li
                              className="my-1 cursor-pointer  px-2 hover:rounded-md hover:bg-slate-200 active:scale-95"
                              onClick={() => handleShowLeadData(e)}
                            >
                              Leads
                            </li>
                            <li
                              className="my-1 cursor-pointer  px-2 hover:rounded-md hover:bg-slate-200 active:scale-95"
                              onClick={() => handleEditEmployeeData(e)}
                            >
                              Edit Details
                            </li>
                          </ul>
                        )}

                        <BsThreeDotsVertical
                          className="absolute right-0 cursor-pointer text-xl hover:text-blue-700"
                          onClick={() => handleEmployeeMenuBar(e._id)}
                        />
                        <div className="h-16 w-16">
                          <img src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp" />
                        </div>
                        <p className="text-center text-lg font-semibold">
                          {e.fName + " " + e.lName}
                        </p>
                        <p className="text-center text-slate-600">
                          {e.designation}
                        </p>
                        <p className="text-center text-slate-600">
                          Emploee Id: {e.userId}
                        </p>
                      </div>
                      <div className="h-5/12 rounded-xl bg-white p-2 font-semibold">
                        <div className="flex">
                          <div className="text-center">
                            <p>Total Leads</p>
                            <p>0</p>
                          </div>
                          <div className="text-center">
                            <p>Total Sales</p>
                            <p>0</p>
                          </div>
                        </div>
                        <div className="flex text-sm font-semibold">
                          <div className="w-2/12 py-2">
                            <MdEmail className="my-1 text-lg" />
                            <FaPhoneSquareAlt className="text-base" />
                          </div>
                          <div className="mt-3 w-10/12 overflow-hidden font-normal">
                            <div>Phone: {e.phone}</div>
                            <div className="my-1">Email: {e.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EmployeeDetails;
