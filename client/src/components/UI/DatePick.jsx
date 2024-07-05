import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

const onRangeChange = (dates, dateStrings) => {
  if (dates) {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
  } else {
    console.log("Clear");
  }
};

const DatePick = () => (
  <RangePicker className="h-50" onChange={onRangeChange} />
);
export default DatePick;
