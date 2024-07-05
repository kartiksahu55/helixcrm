import AddNewLead from "../components/Leads/NewLead";
import ReferralProgramLink from "../components/ReferralProgramLink";
import UserDataCard from "../components/UI/Card/UserDataCard";

const ReferralPage = () => {
  return (
    <>
      {/* ------#My-Referral Heading#------ */}
      <div className="my-4 mr-[10%]">
        {/* <h1 className="mb-4 w-48 rounded-md bg-[#004280] p-1 text-center text-3xl font-bold text-white shadow-md shadow-slate-600 ">
          My Referral
        </h1> */}

        <AddNewLead />
        <ReferralProgramLink />
        <UserDataCard></UserDataCard>
      </div>
    </>
  );
};

export default ReferralPage;
