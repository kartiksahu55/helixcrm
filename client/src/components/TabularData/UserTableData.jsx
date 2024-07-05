import Search from "antd/es/input/Search";

import DatePick from "../UI/DatePick";
import TButton from "../UI/TButton";

const tableDB = [
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu555@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
  // {
  //   reg_date: "01/02/2023",
  //   full_name: "Kartik Chandra Sahu",
  //   email_id: "kartiksahu@gmail.com",
  //   phone_number: "9337323750",
  //   referral_id: "sarp_20230201001",
  // },
];

const UserTableData = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <div className="h-[100%] w-[95%] overflow-hidden ">
      {/* #Search Bar# */}
      <div className="top-6 flex h-10 flex-wrap">
        <div className="flex h-full w-[50%] ">
          <Search
            size="large"
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
        </div>

        <div className="flex h-full w-[40%] justify-center gap-3">
          <DatePick></DatePick>
        </div>
      </div>

      {/* #Table# */}
      <div className="top-10 h-[500px] overflow-auto pb-10">
        <table className="w-full table-auto text-slate-100">
          <thead>
            <tr className="sticky top-0 z-10 h-10 bg-cyan-600 shadow-md">
              <th className="">Sl. No</th>
              <th className="">Reg.Date</th>
              <th className="">Full Name</th>
              <th className="">Email ID</th>
              <th className="">Phone Num.</th>
              <th className="">Referral ID</th>
              <th className="">Referral</th>
              <th className="">Account</th>
              <th className="" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {tableDB.map((e, i) => {
              return (
                <tr
                  key={i}
                  className={`p-2 text-black ${
                    i % 2 !== 0 ? "bg-slate-100" : "bg-slate-200"
                  } hover:bg-cyan-600 hover:text-white`}
                >
                  <td className="px-2">{i + 1}</td>
                  <td className="px-2">{e.reg_date}</td>
                  <td className="px-2">{e.full_name}</td>
                  <td className="px-2">{e.email_id}</td>
                  <td className="px-2">{e.phone_number}</td>
                  <td className="px-2">{e.referral_id}</td>
                  <td className="px-2">
                    <TButton btnName={"Details"} iconName={"details"}></TButton>
                  </td>
                  <td className="px-2">
                    <TButton btnName={"Details"} iconName={"details"}></TButton>
                  </td>
                  <td className="px-2">
                    <TButton
                      btnName={"Edit"}
                      circle={true}
                      iconName={"edit"}
                    ></TButton>
                  </td>
                  <td className="px-2">
                    <TButton
                      btnName={"Delete"}
                      circle={true}
                      iconName={"delete"}
                    ></TButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTableData;
