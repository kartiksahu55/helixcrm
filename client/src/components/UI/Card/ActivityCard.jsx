import { Button, FloatButton } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// const activityDetails =

const ActivityCard = () => {
  // This Function converts timeStamp details to readable details
  const dateString = (string) => {
    const newDate = new Date(string);
    const month = newDate.getMonth();
    const date = newDate.getDate();
    const year = newDate.getFullYear();
    const day = newDate.getDay();

    return {
      date: monthName[month] + " " + date + ", " + year + " " + dayNames[day],
      time: newDate.getHours() + ":" + newDate.getMinutes(),
    };
  };

  const [activityData, setActivityData] = useState([
    {
      name: "Kartik Chandra Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Chandra Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Sahu",
      message: "Changed his Account no.",
      date: dateString("2024-01-02T06:56:41.223+00:00").date,
      time: dateString("2024-01-02T06:56:41.223+00:00").time,
      marked: false,
    },
    {
      name: "Kartik Sahu",
      message: "Changed his Account no.",
      time: dateString("2024-01-03T06:56:42.223+00:00").time,
      date: dateString("2024-01-03T06:56:42.223+00:00").date,
      marked: false,
    },
  ]);

  const handleMarkAllRead = () => {
    const markData = activityData.map((data) => {
      return { ...data, marked: true };
    });
    setActivityData(markData);
    toast.success("All marked read successfully");
  };
  const handleUserMarked = (e) => {
    const updateUserMarked = [...activityData];
    updateUserMarked[e] = { ...updateUserMarked[e], marked: true };
    setActivityData(updateUserMarked);
  };

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        tooltip="User Activities"
        className="bottom-4 right-10"
      >
        <div className="right-72 max-h-96 w-80 overflow-auto rounded-lg bg-white px-3 pb-3 shadow-md">
          <div className="sticky top-0 z-50 w-[100%] bg-white pt-2 text-lg font-semibold text-sky-600 underline">
            <h2 className="font-serif">Activities</h2>
          </div>
            <button
              onClick={handleMarkAllRead}
              className="absolute right-2 top-2 z-50 text-sm rounded-md border-2 border-slate-200 bg-slate-50 px-2 shadow-md active:shadow-inner"
            >
              Mark All As Read
            </button>

          {activityData.map((e, i) => {
            return (
              <div key={i} className="flex w-full gap-2 ">
                <div>
                  <input type="checkbox" className="h-3 w-3 cursor-pointer" />
                </div>
                <div className="w-11/12">
                  <h3
                    className={`mt-3 text-sm ${
                      e.marked
                        ? "text-slate-900"
                        : "cursor-pointer text-green-600"
                    }`}
                    onClick={e.marked ? null : () => handleUserMarked(i)}
                  >
                    {e.name} {e.message}
                  </h3>
                  <div className="flex justify-between text-xs tracking-wide text-slate-500 ">
                    <p>{e.date}</p>
                    <p>{e.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FloatButton.Group>
    </>
  );
};

export default ActivityCard;
