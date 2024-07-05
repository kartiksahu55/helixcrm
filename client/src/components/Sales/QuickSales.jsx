/* eslint-disable react/prop-types */
import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { CREATE_SALES_API, UPDATE_SALES_DATA_API } from "../../apiDetails";
import {
  updateAccountData,
  updateLeadData,
} from "../../slices/user/userDataSlice";
import { bankName } from "../StaticData/StaticData";

const inputClass =
  "focus:border-blue-400 rounded border px-2 outline-none lg:w-[220px] md:w-[220px] w-[65vw] h-7";

const QuickSales = ({
  // setIsStatusFinal,
  setIsModalOpen,
  selectedLeadDetails,
  selectedSalesData,
  setStatusUpdateLeadData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputRealEstateSales, setInputRealEstateSales] = useState({
    incentivePaymentDate: "",
    incentiveAmt: "",
    bookingDate: "",
    brokerageAmt: "",
    brokerageInvoiceDate: "",
    brokerageReceivingDate: "",
    dateOfDiscountPayment: "",
    dimension: "",
    discount: "",
    // discountAfterTds: "",
    homeLoan: "",
    salesValue: "",
    unitAlloted: "",
  });

  // Banking Sales Input Data
  const [inputBankingSales, setInputBankingSales] = useState({
    advanceIncentive: "",
    bsaIncentiveAmt: "",
    bsaIncentiveDate: "",
    bankName: "",
    disbursementDate: "",
    disbursementSlab: "",
    expectedIncentiveFromBank: "",
    expectedTotalDisbursement: "",
    fileNumber: "",
    incentiveAmt: "",
    incentivePaymentDate: "",
    sanctionAmt: "",
    totalDisbursement: "",
  });

  const resetInputData = () => {
    const resetData = (input, setInput) => {
      const keys = Object.keys(input);
      let inputSalesData = input;

      keys.forEach((e) => {
        inputSalesData[e] = "";
      });

      setInput(inputSalesData);
    };

    if (selectedSalesData.sector === "Real Estate") {
      resetData(inputRealEstateSales, setInputRealEstateSales);
    } else if (selectedSalesData.sector === "Banking") {
      resetData(inputBankingSales, setInputBankingSales);
    }
  };

  const dispatch = useDispatch();

  // Check Lead Sector
  let isRealEstate = false;
  let isBanking = false;
  console.log(selectedLeadDetails);
  if (selectedLeadDetails?.sector === "Real Estate") {
    isRealEstate = true;
  } else if (selectedSalesData?.sector === "Real Estate") {
    isRealEstate = true;
  } else if (selectedLeadDetails?.sector === "Banking") {
    isBanking = true;
  } else if (selectedSalesData?.sector === "Banking") {
    isBanking = true;
  }

  // Call Create sales api to create sales data
  const createSalesApi = async (payload) => {
    try {
      setIsLoading(true);
      const response = await axios.post(CREATE_SALES_API, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(
          updateLeadData({
            ...selectedLeadDetails,
            salesDataCreated: true,
          }),
        );
        setIsModalOpen(false);
        setStatusUpdateLeadData(null);
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      const err = error.response.data?.message || error.message;
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    try {
      let payload = null;
      const leadData = {
        leadId: selectedLeadDetails._id,
        leadRepresentative: selectedLeadDetails.leadRepresentative,
        sector: selectedLeadDetails.sector ? selectedLeadDetails.sector : "",
        firmName: selectedLeadDetails.firmName
          ? selectedLeadDetails.firmName
          : "",
        fName: selectedLeadDetails.fName ? selectedLeadDetails.fName : "",
        lName: selectedLeadDetails.lName ? selectedLeadDetails.lName : "",
        phone: selectedLeadDetails.phone ? selectedLeadDetails.phone : "",
        email: selectedLeadDetails.email ? selectedLeadDetails.email : "",
        leadSource: selectedLeadDetails.leadSource
          ? selectedLeadDetails.leadSource
          : "",
        projectName: selectedLeadDetails.projectName
          ? selectedLeadDetails.projectName
          : "",
      };

      const checkAllFields = (payload) => {
        for (let e in payload) {
          if (payload[e] === "") {
            throw new Error("All fields are required!");
          }
        }
      };

      if (isRealEstate) {
        payload = {
          ...leadData,
          realEstateSales: {
            bookingDate: inputRealEstateSales.bookingDate,
            brokerageAmt: inputRealEstateSales.brokerageAmt,
            brokerageInvoiceDate: inputRealEstateSales.brokerageInvoiceDate,
            brokerageReceivingDate: inputRealEstateSales.brokerageReceivingDate,
            dateOfDiscountPayment: inputRealEstateSales.dateOfDiscountPayment,
            dimension: inputRealEstateSales.dimension,
            discount: inputRealEstateSales.discount,
            // discountAfterTds: inputRealEstateSales.discountAfterTds,
            homeLoan: inputRealEstateSales.homeLoan,
            incentiveAmt: inputRealEstateSales.incentiveAmt,
            incentivePaymentDate: inputRealEstateSales.incentivePaymentDate,
            salesValue: inputRealEstateSales.salesValue,
            unitAlloted: inputRealEstateSales.unitAlloted,
          },
        };

        // Check All input fields
        checkAllFields(payload.realEstateSales);
      } else if (isBanking) {
        payload = {
          ...leadData,
          bankingSales: {
            incentiveAmt: inputBankingSales.incentiveAmt,
            incentivePaymentDate: inputBankingSales.incentivePaymentDate,
            sanctionAmt: inputBankingSales.sanctionAmt,
            advanceIncentive: inputBankingSales.advanceIncentive,
            bsaIncentiveAmt: inputBankingSales.bsaIncentiveAmt,
            bsaIncentiveDate: inputBankingSales.bsaIncentiveDate,
            bankName: inputBankingSales.bankName,
            disbursementDate: inputBankingSales.disbursementDate,
            disbursementSlab: inputBankingSales.disbursementSlab,
            expectedIncentiveFromBank:
              inputBankingSales.expectedIncentiveFromBank,
            expectedTotalDisbursement:
              inputBankingSales.expectedTotalDisbursement,
            fileNumber: inputBankingSales.fileNumber,
            totalDisbursement: inputBankingSales.totalDisbursement,
          },
        };

        // Check All input fields
        checkAllFields(payload.bankingSales);
      }

      await createSalesApi(payload);
    } catch (error) {
      toast.error(error.message);
    }
  };

  //
  const updateSalesApi = async (payload, id) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${UPDATE_SALES_DATA_API}/${id}`,
        payload,
        { withCredentials: true },
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(updateAccountData({ _id: id, ...payload }));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Update Sales Data
  const handleUpdateSales = async () => {
    const salesId = selectedSalesData._id;
    let payload = null;

    console.log("selectedSalesData: ", selectedSalesData);
    if (selectedSalesData.sector === "Real Estate") {
      console.log("Real Estate: ", inputRealEstateSales);
      payload = { realEstateSales: inputRealEstateSales };
    } else if (selectedSalesData.sector === "Banking") {
      console.log("Banking: ", inputBankingSales);
      payload = { bankingSales: inputBankingSales };
    }

    updateSalesApi(payload, salesId);
  };

  useEffect(() => {
    if (selectedSalesData) {
      selectedSalesData.sector === "Real Estate"
        ? setInputRealEstateSales(selectedSalesData.realEstateSales)
        : setInputBankingSales(selectedSalesData.bankingSales);
    }
  }, [selectedSalesData]);

  return (
    <>
      <div className="mb-2 mt-4 font-semibold">
        {selectedSalesData && (
          <div className="mb-3 border-b-2 border-sky-800 font-semibold">
            <h3 className=" font-mono text-base">
              Name: {selectedSalesData?.fName + " " + selectedSalesData?.lName}{" "}
              ({selectedSalesData?.sector})
            </h3>
            <h3 className="font-mono">
              Phone:{" +91 "}
              {selectedSalesData?.phone}
            </h3>
          </div>
        )}
        <span className=" border-b-2 border-sky-800 font-mono text-lg">
          Sales Data{" "}
          <span className="text-xs font-thin text-slate-500">
            (All fields are requires*)
          </span>
        </span>
      </div>
      {/* Sales Detail Form  */}
      <form
        action=""
        className="flex flex-wrap  justify-between gap-y-2 text-base"
      >
        {isRealEstate && (
          <>
            <div>
              <label htmlFor="bookingDate" className="block">
                Date Of Booking
              </label>
              <input
                type="date"
                id="bookingDate"
                value={inputRealEstateSales.bookingDate}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    bookingDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="salesValue" className="block">
                Sales Value
              </label>
              <input
                type="number"
                id="salesValue"
                value={inputRealEstateSales.salesValue}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    salesValue: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="brokerageInvoiceDate" className="block">
                Brockerage Invoice Date
              </label>
              <input
                type="date"
                id="brokerageInvoiceDate"
                value={inputRealEstateSales.brokerageInvoiceDate}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    brokerageInvoiceDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="brokerageAmt" className="block">
                Brokerage Amount
              </label>
              <input
                type="number"
                id="brokerageAmt"
                value={inputRealEstateSales.brokerageAmt}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    brokerageAmt: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="brokerageReceivingDate" className="block">
                Brockerage Receving Date
              </label>
              <input
                type="date"
                id="brokerageReceivingDate"
                value={inputRealEstateSales.brokerageReceivingDate}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    brokerageReceivingDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="unitAlloted" className="block">
                Unit Alloted
              </label>
              <input
                type="text"
                id="unitAlloted"
                value={inputRealEstateSales.unitAlloted}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    unitAlloted: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="dimension" className="block">
                Dimension
              </label>
              <input
                type="text"
                id="dimension"
                value={inputRealEstateSales.dimension}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    dimension: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="discount" className="block">
                Discount %
              </label>
              <input
                type="number"
                id="discount"
                value={inputRealEstateSales.discount}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    discount: e.target.value,
                  })
                }
              />
            </div>

            {/* <div>
              <label htmlFor="discountAfterTds" className="block">
                Discount Amount After TDS
              </label>
              <input
                type="number"
                id="discountAfterTds"
                value={inputRealEstateSales.discountAfterTds}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    discountAfterTds: e.target.value,
                  })
                }
              />
            </div> */}

            <div>
              <label htmlFor="dateOfDiscountPayment" className="block">
                Date of Discount Payment
              </label>
              <input
                type="date"
                id="dateOfDiscountPayment"
                value={inputRealEstateSales.dateOfDiscountPayment}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    dateOfDiscountPayment: e.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="incentivePaymentDate" className="block">
                Incentive Payment Date
              </label>
              <input
                type="date"
                id="incentivePaymentDate"
                value={inputRealEstateSales.incentivePaymentDate}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    incentivePaymentDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="incentiveAmt" className="block">
                Incentive Amount
              </label>
              <input
                type="number"
                id="incentiveAmt"
                value={inputRealEstateSales.incentiveAmt}
                className={inputClass}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    incentiveAmt: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="homeLoan" className="block">
                Home loan
              </label>
              <select
                type="text"
                id="homeLoan"
                value={inputRealEstateSales.homeLoan}
                className={`${inputClass} h-7`}
                onChange={(e) =>
                  setInputRealEstateSales({
                    ...inputRealEstateSales,
                    homeLoan: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </>
        )}

        {isBanking && (
          <>
            <div>
              <label htmlFor="disbursementDate" className="block">
                Disburesement Date
              </label>
              <input
                type="date"
                id="disbursementDate"
                value={inputBankingSales.disbursementDate}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    disbursementDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="sanctionAmt" className="block">
                Sanction Amount
              </label>
              <input
                type="number"
                id="sanctionAmt"
                value={inputBankingSales.sanctionAmt}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    sanctionAmt: e.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="incentivePaymentDate" className="block">
                Incentive Payment Date
              </label>
              <input
                type="date"
                id="incentivePaymentDate"
                value={inputBankingSales.incentivePaymentDate}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    incentivePaymentDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="incentiveAmt" className="block">
                Incentive Amount
              </label>
              <input
                type="number"
                id="incentiveAmt"
                value={inputBankingSales.incentiveAmt}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    incentiveAmt: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="fileNumber" className="block">
                File Number
              </label>
              <input
                type="number"
                id="fileNumber"
                value={inputBankingSales.fileNumber}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    fileNumber: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="bankName" className="block">
                Bank Name
              </label>
              <select
                id="bankName"
                value={inputBankingSales.bankName}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    bankName: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                {bankName.map((e, i) => {
                  return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="totalDisbursement" className="block">
                Total Disbursement
              </label>
              <input
                type="number"
                id="totalDisbursement"
                value={inputBankingSales.totalDisbursement}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    totalDisbursement: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="expectedTotalDisbursement" className="block">
                Expected Total Disbursement
              </label>
              <input
                type="number"
                id="expectedTotalDisbursement"
                value={inputBankingSales.expectedTotalDisbursement}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    expectedTotalDisbursement: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="expectedIncentiveFromBank" className="block">
                Expected Incentive From Bank
              </label>
              <input
                type="number"
                id="expectedIncentiveFromBank"
                value={inputBankingSales.expectedIncentiveFromBank}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    expectedIncentiveFromBank: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="disbursementSlab" className="block">
                Disbursement Slab
              </label>
              <input
                type="number"
                id="disbursementSlab"
                value={inputBankingSales.disbursementSlab}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    disbursementSlab: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="advanceIncentive" className="block">
                Advance incentive
              </label>
              <input
                type="number"
                id="advanceIncentive"
                value={inputBankingSales.advanceIncentive}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    advanceIncentive: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="bsaIncentiveAmt" className="block">
                BSA Incentive paid Amt
              </label>
              <input
                type="number"
                id="bsaIncentiveAmt"
                value={inputBankingSales.bsaIncentiveAmt}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    bsaIncentiveAmt: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="bsaIncentiveDate" className="block">
                BSA Incentive paid Date
              </label>
              <input
                type="date"
                id="bsaIncentiveDate"
                value={inputBankingSales.bsaIncentiveDate}
                className={inputClass}
                onChange={(e) =>
                  setInputBankingSales({
                    ...inputBankingSales,
                    bsaIncentiveDate: e.target.value,
                  })
                }
              />
            </div>
          </>
        )}
      </form>
      <div className="mt-3 flex justify-end gap-2">
        <Button
          onClick={() => {
            // selectedSalesData && setSelectedSalesData(null);
            // resetInputData();
            setIsModalOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          loading={isLoading}
          onClick={selectedSalesData ? handleUpdateSales : handleFormSubmit}
        >
          {selectedSalesData
            ? isLoading
              ? "Updating..."
              : "Update"
            : isLoading
              ? "Creating..."
              : "Create"}
        </Button>
      </div>
    </>
  );
};

export default QuickSales;
