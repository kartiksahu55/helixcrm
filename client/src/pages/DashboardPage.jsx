import { DatePicker } from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

import { FETCH_USER_DETAILS } from "../apiDetails";
import { month } from "../components/StaticData/StaticData";
import UserCalendar from "../components/UI/Calendar/UserCalendar";
import ActivityCard from "../components/UI/Card/ActivityCard";
import UserDataCard from "../components/UI/Card/UserDataCard";
import BarChart from "../components/UI/Chart/BarChart";
import LineChart from "../components/UI/Chart/LineChart";
import GroupSectorButton from "../components/UI/GroupSectorButton";

const DashboardPage = () => {
  const [selectedSector, setSelectedSector] = useState("Real Estate");
  const [leadSectorData, setLeadSectorData] = useState([]);
  const [accountSectorData, setAccountSectorData] = useState([]);
  const [selectYear, setSelectYear] = useState(new Date().getFullYear());

  const leadData = useSelector((state) => state.leadData);
  const { role } = useSelector((state) => state.userData);
  const accountData = useSelector((state) => state.accountData);

  const onYearChange = (date, dateString) => {
    setSelectYear(+dateString || new Date().getFullYear());
  };

  // Select Date in month and year format
  function dateSelect(data) {
    return data
      .map((data) => {
        const m = new Date(data.createdAt).getMonth();
        const y = new Date(data.createdAt).getFullYear();
        return { month: month[m], year: y };
      })
      .filter((e) => e.year === selectYear);
  }

  // Create Number of Sales Data for Chart
  function numOfSales() {
    const monthData = dateSelect(accountSectorData);
    const staticMonth = month;
    let salesPerMonth = [];

    for (let valueA of staticMonth) {
      let sales = 0;
      for (let valueB of monthData) {
        if (valueA === valueB.month) {
          sales++;
        }
      }
      salesPerMonth.push({ month: valueA, sales });
    }
    return salesPerMonth;
  }

  useEffect(() => {
    const sectorData = (data) => {
      return data.filter((e) => e.sector === selectedSector);
    };

    setLeadSectorData(sectorData(leadData));
    setAccountSectorData(sectorData(accountData));
  }, [selectedSector]);
  console.log("accountData: ", accountData);

  return (
    <>
      <div className="w-[95%] justify-start">
        {role === "super-admin" && (
          <GroupSectorButton
            leadCategory={selectedSector}
            setLeadCategory={setSelectedSector}
          />
        )}

        <UserDataCard
          selectedSector={selectedSector}
          leadSectorSelected={leadSectorData}
        />
        <UserCalendar></UserCalendar>
        <div className="my-8 inline-block">
          <div className="bg-blue-600 px-2 py-1 text-right rounded-t-md shadow-md">
            <span className="mr-2 text-lg font-bold text-white">
              <FaCalendarAlt className="mr-1 inline-block" />
              Year
            </span>
            <DatePicker onChange={onYearChange} picker="year" />
          </div>

          <BarChart
            chartData={{
              data: numOfSales(),
              legend:
                selectedSector === "Real Estate"
                  ? "Number of Sales"
                  : selectedSector === "Banking"
                    ? "Number of Disbursedment"
                    : "Number of Project",
            }}
          />
          <BarChart
            chartData={{ data: numOfSales(), legend: "Number of Sales" }}
          />
          {/* <LineChart chartData={chartData}></LineChart> */}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
