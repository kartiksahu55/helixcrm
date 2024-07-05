import { Button, Modal, Space, Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep, MdSwitchAccount } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { DELETE_SALES_DATA_API } from "../../apiDetails";
import { deleteAccountData } from "../../slices/user/userDataSlice";
import QuickSales from "../Sales/QuickSales";

//   Real Estate Start
const columnsRealEstate = [
  {
    title: "Sl No.",
    dataIndex: "slNum",
    width: "80px",
    fixed: "left",
  },
  {
    title: "Name",
    dataIndex: "name",
    width: "150px",
  },
  {
    title: "Sales Representative",
    dataIndex: "leadRepresentative",
    width: "150px",
  },
  {
    title: "Booking Date",
    dataIndex: "bookingDate",
    sorter: true,
    width: "120px",
  },
  {
    title: "Sales Value",
    dataIndex: "salesValue",
    sorter: true,
    width: "120px",
  },
  {
    title: "Brokerage Amount",
    dataIndex: "brokerageAmt",
    sorter: true,
    width: "120px",
  },
  {
    title: "Unit Alloted",
    dataIndex: "unitAlloted",
    sorter: true,
    width: "120px",
  },
  {
    title: "Dimension",
    dataIndex: "dimension",
    sorter: true,
    width: "120px",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    sorter: true,
    width: "120px",
  },
  {
    title: "Discount amount after tds",
    dataIndex: "discountAfterTds",
    sorter: true,
    width: "130px",
  },
  {
    title: "Date of discount amount  payment",
    dataIndex: "dateOfDiscountPayment",
    sorter: true,
    width: "160px",
  },
  {
    title: "Brockerage invoice date",
    dataIndex: "brokerageInvoiceDate",
    sorter: true,
    width: "120px",
  },
  {
    title: "Brockerage receving date",
    dataIndex: "brokerageReceivingDate",
    sorter: true,
    width: "120px",
  },
  {
    title: "Home loan",
    dataIndex: "homeLoan",
    width: "120px",
  },
  {
    title: "Quick Action",
    dataIndex: "quickAction",
    fixed: "right",
    width: "150px",
  },
];
//   Real Estate End

//   Banking Start
const columnBanking = [
  {
    title: "Sl No.",
    dataIndex: "slNum",
    width: "80px",
    fixed: "left",
  },
  {
    title: "Name",
    dataIndex: "name",
    width: "150px",
  },
  {
    title: "Sales Representative",
    dataIndex: "leadRepresentative",
    width: "150px",
  },
  {
    title: "Sanction Amount",
    dataIndex: "sanctionAmt",
    width: "150px",
  },
  {
    title: "File Number",
    dataIndex: "fileNumber",
    width: "150px",
  },
  {
    title: "Bank",
    dataIndex: "bankName",
    width: "150px",
  },
  {
    title: "Total Disbursement",
    dataIndex: "totalDisbursement",
    width: "150px",
  },
  {
    title: "Expected Total Disbursement",
    dataIndex: "expectedTotalDisbursement",
    width: "150px",
  },
  {
    title: "Expected Incentive from Bank",
    dataIndex: "expectedIncentiveFromBank",
    width: "150px",
  },
  {
    title: "Disbursement Slab",
    dataIndex: "disbursementSlab",
    width: "150px",
  },
  {
    title: "Advance Incentive",
    dataIndex: "advanceIncentive",
    width: "150px",
  },
  {
    title: "BSA Incentive Paid Amount",
    dataIndex: "bsaIncentiveAmt",
    width: "150px",
  },
  {
    title: "BSA Incentive Paid Date",
    dataIndex: "bsaIncentiveDate",
    width: "150px",
  },
  {
    title: "Quick Action",
    dataIndex: "quickAction",
    fixed: "right",
    width: "150px",
  },
];
//   Banking End

const columnInterior = [
  {
    title: "Sl No.",
    dataIndex: "slNum",
    width: "80px",
    fixed: "left",
  },
  {
    title: "Name",
    dataIndex: "name",
    width: "150px",
  },
  {
    title: "Quick Action",
    dataIndex: "quickAction",
    fixed: "right",
    width: "150px",
  },
];
//   Banking End
export const AccountTable = ({
  accountData,
  leadSector,
  isLoading,
  setRefreshLead,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState(null);

  const dispatch = useDispatch();

  const myAccountData = accountData.reverse() || [];

  const handleEditSalesDetails = (e) => {
    setSelectedSalesData(e);
    setIsModalOpen(!isModalOpen);
  };

  // This function call delete sales api
  const deleteSalesApiCall = async (id) => {
    try {
      const response = await axios.delete(`${DELETE_SALES_DATA_API}/${id}`, {
        withCredentials: true,
      });
      console.log(response);
      if (!response) {
        throw Error("Oops! Something went wrong.");
      }
      dispatch(deleteAccountData(id));
      toast.success("Sales data deleted successfully.");
    } catch (error) {
      console.log(error);
      const errMessage = error.message || "Oops! Something went wrong.";
      console.log(errMessage);
      toast.error(errMessage);
    }
  };

  // This function handle delete sales
  const handleDeleteSales = (e) => {
    console.log(e._id);
    const salesId = e._id;
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
        deleteSalesApiCall(salesId);
      }
    });
  };

  // Data for Table
  const data = myAccountData?.map((e, i) => {
    // Functon convert number to IN-currency
    const inrCurrencyFormater = (numData) => {
      if (numData) {
        return numData.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    };
    return {
      key: i,
      slNum: i + 1,
      name: e.fName + " " + e.lName,
      leadRepresentative: e.leadRepresentative?.name,
      //   Real Estate
      bookingDate: e?.realEstateSales?.bookingDate,
      salesValue: inrCurrencyFormater(e?.realEstateSales?.salesValue),
      brokerageAmt: inrCurrencyFormater(e?.realEstateSales?.brokerageAmt),
      unitAlloted: e?.realEstateSales?.unitAlloted,
      dimension: e?.realEstateSales?.dimension,
      discount: e?.realEstateSales?.discount + "%",
      discountAfterTds: inrCurrencyFormater(
        e?.realEstateSales?.discountAfterTds,
      ),
      dateOfDiscountPayment: e?.realEstateSales?.dateOfDiscountPayment,
      brokerageInvoiceDate: e?.realEstateSales?.brokerageInvoiceDate,
      brokerageReceivingDate: e?.realEstateSales?.brokerageReceivingDate,
      homeLoan: e?.realEstateSales?.homeLoan,
      //   Banking
      sanctionAmt: inrCurrencyFormater(e?.bankingSales?.sanctionAmt),
      fileNumber: e?.bankingSales?.fileNumber,
      bankName: e?.bankingSales?.bankName,
      totalDisbursement: inrCurrencyFormater(
        e?.bankingSales?.totalDisbursement,
      ),
      expectedTotalDisbursement: inrCurrencyFormater(
        e?.bankingSales?.expectedTotalDisbursement,
      ),
      expectedIncentiveFromBank: inrCurrencyFormater(
        e?.bankingSales?.expectedIncentiveFromBank,
      ),
      disbursementSlab: inrCurrencyFormater(e?.bankingSales?.disbursementSlab),
      advanceIncentive: inrCurrencyFormater(e?.bankingSales?.advanceIncentive),
      bsaIncentiveAmt: inrCurrencyFormater(e?.bankingSales?.bsaIncentiveAmt),
      bsaIncentiveDate: e?.bankingSales?.bsaIncentiveDate,
      quickAction: (
        <div className="mx-2 flex gap-3">
          {/* Edit Action */}
          <Tooltip title={"Edit Sales Details"} color="blue">
            <Button
              type="primary"
              onClick={() => handleEditSalesDetails(e)}
              className="w-8 p-0 text-xl"
            >
              <FaEdit />
            </Button>
          </Tooltip>

          {/* Delete Action */}
          <Tooltip title={"Delete Sales"} color="red">
            <Button
              danger
              onClick={() => handleDeleteSales(e)}
              className="w-8 p-0 text-xl"
            >
              <MdDeleteSweep />
            </Button>
          </Tooltip>
        </div>
      ),
    };
  });
  return (
    <>
      <div>
        <div className="font- top-6">
          Showing Total Sales 1-10 of {data.length} results
        </div>

        {/* It selected Employee name for the lead table */}
        <h2 className="top-7 font-serif text-2xl">
          {selectedSalesData
            ? selectedSalesData.fName + " " + selectedSalesData.lName
            : ""}
        </h2>
        {/* Refresh Table Data */}
        <div className="right-5 text-right">
          <Space>
            <Search
              placeholder="Search Leads"
              enterButton
              className="lg:w-80"
            ></Search>
            <Button
              icon={<TbRefresh className="text-xl text-blue-500" />}
              loading={isLoading}
              onClick={() => setRefreshLead(true)}
            ></Button>
          </Space>
        </div>

        <Table
          columns={
            leadSector === "Real Estate"
              ? columnsRealEstate
              : leadSector === "Banking"
                ? columnBanking
                : columnInterior
          }
          dataSource={data}
          bordered
          scroll={{ y: "60vh" }}
          loading={isLoading}
        ></Table>
      </div>

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedSalesData(null);
        }}
      >
        <QuickSales
          selectedSalesData={selectedSalesData}
          setSelectedSalesData={setSelectedSalesData}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </>
  );
};

export default AccountTable;
