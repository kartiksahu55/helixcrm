import { Badge, Calendar, Modal } from "antd";
import { useState } from "react";

import calendaricons from "../../../../public/icons/calendar-icons.png";

const getListData = (value) => {
  let listData;
  switch (value.date()) {
    case 5:
      listData = [
        {
          type: "warning",
          content: "This is warning event.",
        },
        {
          type: "success",
          content: "This is usual event.",
        },
      ];
      break;
    case 10:
      listData = [
        {
          type: "warning",
          content: "This is warning event.",
        },
        {
          type: "success",
          content: "This is usual event.",
        },
        {
          type: "error",
          content: "This is error event.",
        },
      ];
      break;
    case 15:
      listData = [
        {
          type: "warning",
          content: "This is warning event",
        },
        {
          type: "success",
          content: "This is very long usual event......",
        },
        {
          type: "error",
          content: "This is error event 1.",
        },
        {
          type: "error",
          content: "This is error event 2.",
        },
        {
          type: "error",
          content: "This is error event 3.",
        },
        {
          type: "error",
          content: "This is error event 4.",
        },
      ];
      break;
    default:
  }
  return listData || [];
};
const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};
const UserCalendar = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };
  return (
    <>
      <div
        className="group absolute right-10 top-2  flex rounded-md border border-sky-400 bg-sky-200 px-1 shadow-lg sm:w-14 md:w-20 lg:w-56"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <img
          src={calendaricons}
          alt="Calendar"
          width="50"
          className="cursor-pointer group-hover:scale-105"
        />
        <p className="top-5 h-6 rounded-md bg-white px-1 font-mono font-semibold hidden lg:block">
          Activity Calendar
        </p>
      </div>
      <Modal
        title={"Activity Calendar"}
        open={showCalendar}
        onCancel={() => setShowCalendar(!showCalendar)}
        width={1200}
      >
        <Calendar cellRender={cellRender} onChange={(e) => console.log(e)} />
      </Modal>
    </>
  );
};
export default UserCalendar;
