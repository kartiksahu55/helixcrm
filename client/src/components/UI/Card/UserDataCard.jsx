import { FaUserFriends } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { MdRealEstateAgent } from "react-icons/md";
import { MdReadMore } from "react-icons/md";
import { useSelector } from "react-redux";

const UserDataCard = ({ selectedSector, leadSectorSelected }) => {
  const leadStatusData = (statusType) => {
    return leadSectorSelected?.filter((e) => e.leadStatus === statusType)
      .length;
  };

  console.log(selectedSector);

  const realEstateUserDetails = [
    {
      text: "Total Leads",
      data: leadSectorSelected?.length,
      icon: <IoIosPeople />,
      bgColor: "bg-sky-100",
      textColor: "text-sky-500",
    },

    {
      text: "Site Visit Scheduled",
      data: leadStatusData("Site Visit Scheduled"),
      icon: <FaUserFriends />,
      bgColor: "bg-sky-100",
      textColor: "text-sky-500",
    },

    {
      text: "Total Booking",
      data: leadStatusData("Booked"),
      icon: <FaHandshake />,
      bgColor: "bg-sky-100",
      textColor: "text-sky-500",
    },

    {
      text: "Total Sales",
      data: 5,
      icon: <MdRealEstateAgent />,
      bgColor: "bg-green-100",
      textColor: "text-green-500",
    },

    {
      text: "Total Revenue",
      data: 450000,
      icon: <GiMoneyStack />,
      bgColor: "bg-red-100",
      textColor: "text-red-500",
    },
  ];

  const bankingUserDetails = [
    {
      text: "Total Leads",
      data: leadSectorSelected?.length,
      icon: <IoIosPeople />,
      bgColor: "bg-sky-100",
      textColor: "text-sky-500",
    },

    {
      text: "Logged In",
      data: leadStatusData("Logged In"),
      icon: <FaUserFriends />,
      bgColor: "bg-sky-100",
      textColor: "text-sky-500",
    },

    {
      text: "Total Disbursed",
      data: leadStatusData("Disbursed"),
      icon: <FaHandshake />,
      bgColor: "bg-sky-100",
      textColor: "text-sky-500",
    },

    {
      text: "Total Sales",
      data: 5,
      icon: <MdRealEstateAgent />,
      bgColor: "bg-green-100",
      textColor: "text-green-500",
    },

    {
      text: "Total Revenue",
      data: 450000,
      icon: <GiMoneyStack />,
      bgColor: "bg-red-100",
      textColor: "text-red-500",
    },
  ];

  return (
    <div className="mt-4 flex flex-wrap rounded-xl pl-0">
      {(selectedSector === "Real Estate"
        ? realEstateUserDetails
        : bankingUserDetails
      ).map((e, i) => {
        return (
          <div
            key={i}
            className="mb-2 ml-0 mr-5 flex h-16 min-w-fit gap-4 rounded-2xl bg-white pl-1 pr-2 shadow-md transition-all duration-300 hover:bg-slate-100"
          >
            <div
              className={`h-10 w-12 rounded-lg ${e.bgColor} ${e.textColor} text-4xl shadow-inner`}
            >
              {e.icon}
            </div>
            <div className="w-2/3">
              <div className="text-xl font-semibold">{e.data}</div>
              <div className="text-sm text-slate-500">{e.text}</div>
              <MdReadMore
                className={`absolute right-0 top-0 cursor-pointer text-2xl text-slate-500 hover:text-green-500`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserDataCard;
