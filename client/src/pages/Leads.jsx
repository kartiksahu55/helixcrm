import { Button } from "antd";
import { FaDownload } from "react-icons/fa6";

import NewLead from "../components/Leads/NewLead";
import LeadTable from "../components/TabularData/LeadTable";

const Leads = () => {
  return (
    <div className="mt-2">
      <h2 className="font-serif text-2xl font-semibold">Leads</h2>
      <div className="absolute right-[2%] top-2 flex gap-2">
        <NewLead></NewLead>

        <Button
          type="secondary"
          className="group flex gap-1 bg-blue-500 text-white hover:bg-blue-600"
        >
          <FaDownload className="group-hover:animate-bounce inline-block mr-2" />
          <span>Export</span>
        </Button>
      </div>
      <LeadTable></LeadTable>
    </div>
  );
};

export default Leads;
