import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Space, Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { TbRefresh } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { DELETE_LEAD_API, FETCH_LEADS_DATA_API } from "../../apiDetails";
import { LeadApiCall } from "../../services/ApiCall/LeadsApiCall";
import { deleteLeadData, fetchLeadData } from "../../slices/user/userDataSlice";
import AssignLead from "../Leads/AssignLead";
import LeadStatusUpdate from "../Leads/LeadStatusUpdate";
import QuickLeadsForm from "../Leads/QuickLeadsForm";
import {
  budget,
  leadStatusColor,
  month,
  projects,
  realEstateLeadStatus,
} from "../StaticData/StaticData";
import CallLead from "../UI/Call/CallLead";
import GroupSectorButton from "../UI/GroupSectorButton";

const columns = [
  {
    title: "Sl No.",
    dataIndex: "slNum",
    width: "75px",
    fixed: "left",
  },
  {
    title: "Name",
    dataIndex: "name",
    // render: (text) => <a>{text}</a>,
    width: "150px",
  },
  {
    title: "Reg. Date",
    dataIndex: "date",
    sorter: true,
    width: "120px",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    width: "120px",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "200px",
  },
  {
    title: "Sales Representative",
    dataIndex: "salesRepresentative",
    width: "175px",
  },
  {
    title: "Project Name",
    dataIndex: "projectName",
    width: "180px",
    filters: projects.map((e) => {
      return {
        text: e,
        value: e,
      };
    }),
  },
  {
    title: "Lead Status",
    dataIndex: "leadStatus",
    width: "140px",
    filters: realEstateLeadStatus.map((e) => {
      return {
        text: e,
        value: e,
      };
    }),
  },

  {
    title: "Preference",
    dataIndex: "preference",
    width: "140px",
  },

  {
    title: "Budget",
    dataIndex: "budget",
    width: "120px",
    filters: budget.map((e) => {
      return {
        text: e,
        value: e,
      };
    }),
  },
  {
    title: "Preferred Location",
    dataIndex: "preferredLocation",
    width: "160px",
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    width: "120px",
  },
  {
    title: "Lead Source",
    dataIndex: "leadSource",
    width: "120px",
  },
  {
    title: "Next Action Date",
    dataIndex: "nextActionDate",
    width: "145px",
  },
  {
    title: "Feedback",
    dataIndex: "feedback",
    width: "200px",
  },
  {
    title: "Quick Action",
    dataIndex: "quickAction",
    fixed: "right",
    width: "210px",
    // children: [
    //   {
    //     title: "Quick Action",
    //     dataIndex: "quickAction",
    //     fixed: "right",
    //     width: "170px",
    //   },
    //   {
    //     title: "Assign",
    //     dataIndex: "assignLead",
    //     fixed: "right",
    //     width: "80px",
    //   },
    // ],
  },
  {
    title: "Assign",
    dataIndex: "assignLead",
    fixed: "right",
    width: "80px",
  },
];

export const LeadTable = ({ employeeLeadData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshLead, setRefreshLead] = useState(false);
  const [isEditEnable, setIsEditEnable] = useState(false);
  const [editLeadData, setEditLeadData] = useState(null);
  const [isAssignLeadEnable, setIsAssignLeadEnable] = useState(false);
  const [assignLeadData, setAssignLeadData] = useState(null);
  const [isCallLeadEnable, setIsCallLeadEnable] = useState(false);
  const [callLeadData, setCallLeadData] = useState("");
  // const [isStatusUpdateLeadEnable, setIsStatusUpdateLeadEnable] =
  //   useState(false);
  const [statusUpdateLeadData, setStatusUpdateLeadData] = useState(null);

  const leadData = useSelector((state) => state.leadData);

  const dispatch = useDispatch();
  // const leadData = useSelector((state) => state.leadData);
  const { role, sector } = useSelector((state) => state.userData);

  const [leadSector, setLeadSector] = useState(
    role === "super-admin" ? "Real Estate" : sector,
  );

  console.log("employeeLeadData: ", employeeLeadData);

  // let filterData = [];

  // // This Function Filter the leads according to Lead Sector OR Employee/Representative name
  // const filterLead = () => {
  //   let filteredLeadData = new Array();
  //   for (let leads of leadData) {
  //     let data = new Array();
  //     for (let representative of leads.leadRepresentative) {
  //       // Execute, to Filter according to Representative name
  //       if (employeeLeadData) {
  //         if (representative._id === employeeLeadData._id) {
  //           data.push(representative);
  //         }
  //       }
  //       // Execute, to Filter according to Lead Sector
  //       else {
  //         if (representative.sector === leadSector) {
  //           data.push(representative);
  //         }
  //       }
  //     }
  //     if (data.length) {
  //       filteredLeadData.push({ ...leads, leadRepresentative: data });
  //     }
  //   }

  //   return filteredLeadData;
  // };

  // const filteredLeadData = filterLead();
  // console.log(filteredLeadData);

  // console.log("filter: ", filterData);

  // const filteredLeadData = leadData.filter((e) =>
  //   employeeLeadData
  //     ? e.leadRepresentative?._id === employeeLeadData._id
  //     : e.sector === leadSector,
  // ).reverse();

  // console.log("filteredLeadData: ", filteredLeadData);

  // Filter Table columns According to Sector
  const filteredColumns = columns.filter((e) => {
    // Select Table Column data According to Role
    if (role === "admin" || role === "super-admin") {
      // Select Table Column data According to Sector
      if (leadSector === "Real Estate") {
        return e.dataIndex !== "bankName";
      } else if (leadSector === "Banking") {
        return (
          e.dataIndex !== "budget" &&
          e.dataIndex !== "preferredLocation" &&
          e.dataIndex !== "preference"
        );
      } else {
        return e;
      }
    } else {
      return (
        e.dataIndex !== "salesRepresentative" &&
        e.dataIndex !== "bankName" &&
        e.dataIndex !== "budget" &&
        e.dataIndex !== "preferredLocation"
      );
    }
  });
  // .map((e) => {
  //   // If user is not an admin or a super admin, Assing lead fuction will not show

  //   if (role === "admin" || role == "super-admin") {
  //     return e;
  //   }

  //   console.log("Role: ", role);

  //   // Select Table -> Action -> Children data bassed on user role
  //   if (e.dataIndex === "action") {
  //     let childrenData = [];
  //     for (let i = 0; i < e.children.length; i++) {
  //       if (e.children[i].dataIndex !== "assignLead") {
  //         childrenData.push(e.children[i]);
  //       }
  //     }
  //     e.children = childrenData;
  //     console.log("columnData: ", e);
  //     return e;
  //   } else {
  //     return e;
  //   }
  // });

  // This Function Call Delete Lead Api
  const deleteLeadApiCall = async (leadId, payload) => {
    try {
      const response = await axios.delete(`${DELETE_LEAD_API}/${leadId}`, {
        data: payload,
        withCredentials: true,
      });
      console.log(response);
      if (!response) {
        throw Error("Oops! Something went wrong.");
      }
      dispatch(deleteLeadData(leadId));
      toast.success("Lead deleted successfully.");
    } catch (error) {
      console.log(error);
      const errMessage = error.message || "Oops! Something went wrong.";
      console.log(errMessage);
      toast.error(errMessage);
    }
  };

  // This Function Handle Delete Lead
  const handleLeadDelete = async (e) => {
    const leadId = e._id;
    const payload = { sector: e.sector };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLeadApiCall(leadId, payload);
      }
    });

    // confirm({
    //   title: "Do you want to delete?",
    //   icon: <ExclamationCircleFilled />,
    //   content: "This Lead will get permanently deleted!",
    //   okType: "danger",
    //   onOk() {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(deleteLeadApiCall(e._id) ? resolve : reject, 1000);
    //     }).catch(() => console.log("Oops errors!"));
    //   },
    //   onCancel() {
    //     return;
    //   },
    // });
  };

  // This Function handle Assign lead component
  const handleAssignLead = (e) => {
    const assignLead = leadData.filter((element) => element._id === e._id);
    setAssignLeadData(assignLead[0]);
    setIsAssignLeadEnable(!isAssignLeadEnable);
  };

  // This Function handle lead component
  const handleLeadCall = (e) => {
    setIsCallLeadEnable(true);
    setCallLeadData(e);
  };

  const handleLeadStatusUpdate = (e) => {
    setStatusUpdateLeadData(e);
  };

  // This Function Edit Lead Deatils
  const handleLeadEditEnable = (e) => {
    setIsEditEnable(true);
    setEditLeadData(e);
  };
  const handleModalCancel = () => {
    setIsEditEnable(false);
    setIsAssignLeadEnable(false);
    setEditLeadData(null);
  };

  // This Function Convert the timestamp to date, month, years
  const dateConverter = (string) => {
    const date = new Date(string);
    return (
      date.getDate() + "  " + month[date.getMonth()] + " " + date.getFullYear()
    );
  };
  // console.log(filteredLeadData);
  const data = leadData
    .filter((e) =>
      employeeLeadData
        ? e.leadRepresentative?._id === employeeLeadData._id
        : e.sector === leadSector,
    )
    .reverse()
    .map((e, i) => {
      const color = leadStatusColor.filter(
        (element) => element.status === e.leadStatus,
      )[0].color;

      return {
        key: i,
        slNum: i + 1,
        name: e.fName + " " + e.lName,
        phone: e.phone,
        email: e.email,
        projectName: e.projectName,
        leadStatus: (
          <div
            className={`border first-letter:rounded ${color} text-center text-white`}
          >
            {e.leadStatus}
          </div>
        ),
        leadSource: e.leadSource,
        preference: e.preference,
        budget: e.budget,
        bankName: e.bankName,
        salesRepresentative: e.leadRepresentative?.name,
        preferredLocation: e.preferredLocation,
        nextActionDate: e.nextActionDate,
        feedback: e.feedback,
        date: dateConverter(e.createdAt),
        quickAction: (
          <div className="mx-2 flex gap-3">
            {/* Call Action */}
            <Tooltip title={"Call"} color="blue">
              <Button
                type="primary"
                disabled={e.salesDataCreated}
                onClick={() => handleLeadCall(e)}
                className="w-8 p-0 text-xl"
              >
                <IoIosCall />
              </Button>
            </Tooltip>

            {/* Update Lead Status Action */}
            <Tooltip
              title={e.salesDataCreated ? "Lead Booked" : "Update Lead Status"}
              color="blue"
            >
              <Button
                type="primary"
                disabled={e.salesDataCreated}
                onClick={() => handleLeadStatusUpdate(e)}
                className="w-8 p-0 text-xl"
              >
                <TbStatusChange />
              </Button>
            </Tooltip>

            {/* Edit Action */}
            <Tooltip title={"Edit Lead"} color="blue">
              <Button
                type="primary"
                disabled={e.salesDataCreated}
                onClick={() => handleLeadEditEnable(e)}
                className="w-8 p-0 text-xl"
              >
                <FaEdit />
              </Button>
            </Tooltip>

            {/* Delete Action */}
            <Tooltip title={"Delete Lead"} color="red">
              <Button
                danger
                onClick={() => handleLeadDelete(e)}
                className="w-8 p-0 text-xl"
              >
                <MdDeleteSweep />
              </Button>
            </Tooltip>
          </div>
        ),
        assignLead: (
          <Button
            type="primary"
            onClick={() => handleAssignLead(e)}
            className="p-1"
          >
            Assign
          </Button>
        ),
      };
    });

  // This Hook Call Fetch Leads Data Api
  useEffect(() => {
    if (leadData.length == 0 || refreshLead) {
      (async () => {
        setIsLoading(true);
        try {
          const data = await LeadApiCall();
          console.log(data);
          dispatch(fetchLeadData(data));
          setIsLoading(false);
          setRefreshLead(false);
        } catch (error) {
          console.log(error.message);
          const errorMsg = error.message || "Internal server Error";
          toast.error(errorMsg);
          setIsLoading(false);
          setRefreshLead(false);
        }
      })();
    }
  }, [refreshLead]);

  return (
    <>
      <div className="mr-[2%]">
        {!employeeLeadData &&
          (role === "admin" ||
            (role === "super-admin" && (
              <GroupSectorButton
                leadCategory={leadSector}
                setLeadCategory={setLeadSector}
              />
            )))}

        <div className="font- top-6">
          Showing Total Leads 1-10 of {data.length} results
        </div>

        {/* It selected Employee name for the lead table */}
        {/* <h2 className="top-7 font-serif text-2xl">
          {employeeLeadData
            ? employeeLeadData.fName + " " + employeeLeadData.lName
            : ""}
        </h2> */}
        <div className="text-right">
          {/* Refresh Table Data */}
          <Space>
            <Search
              placeholder="Search Leads"
              enterButton
              className="lg:w-80"
            ></Search>
            <Button
              icon={<TbRefresh className="text-xl text-blue-500" />}
              loading={refreshLead}
              onClick={() => setRefreshLead(true)}
            ></Button>
          </Space>

          <Table
            columns={filteredColumns}
            dataSource={data}
            bordered
            scroll={{ y: "60vh" }}
            loading={isLoading}
          />
        </div>
      </div>

      {/* This Part of Component Edit the Leads Details */}
      <Modal
        title={"Edit Details"}
        open={isEditEnable}
        footer={null}
        onCancel={handleModalCancel}
        width={700}
      >
        <QuickLeadsForm
          handleModalCancel={handleModalCancel}
          isEditEnable={isEditEnable}
          setIsEditEnable={setIsEditEnable}
          editLeadData={editLeadData}
          setEditLeadData={setEditLeadData}
        />
      </Modal>

      {isAssignLeadEnable ? (
        <AssignLead
          isAssignLeadEnable={isAssignLeadEnable}
          setIsAssignLeadEnable={setIsAssignLeadEnable}
          assignLeadData={assignLeadData}
          assignLeadSector={leadSector}
        />
      ) : (
        ""
      )}

      {isCallLeadEnable && (
        <CallLead
          isCallLeadEnable={isCallLeadEnable}
          setIsCallLeadEnable={setIsCallLeadEnable}
          callLeadData={callLeadData}
        />
      )}

      {statusUpdateLeadData && (
        <LeadStatusUpdate
          // isStatusUpdateLeadEnable={isStatusUpdateLeadEnable}
          // setIsStatusUpdateLeadEnable={setIsStatusUpdateLeadEnable}
          statusUpdateLeadData={statusUpdateLeadData}
          setStatusUpdateLeadData={setStatusUpdateLeadData}
        />
      )}
    </>
  );
};

export default LeadTable;
