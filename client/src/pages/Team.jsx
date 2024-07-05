import { Button, Space } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

import EmployeeDetails from "../components/Employee/EmployeeDetails";
import LeadTable from "../components/TabularData/LeadTable";

const Team = () => {
  const [employeeLeadData, setEmployeeLeadData] = useState(null);

  const { role } = useSelector((state) => state.userData);
  console.log("Role: ", role);

  return (
    <div>
      {!employeeLeadData ? (
        <EmployeeDetails
          setEmployeeLeadData={setEmployeeLeadData}
        ></EmployeeDetails>
      ) : (
        <>
          <Button onClick={() => setEmployeeLeadData(null)}>Back</Button>
          {employeeLeadData && (
            <div className="w-full">
              <div className="top-8 rounded-lg p-1 font-serif text-xl font-semibold underline text-blue-900">
                {employeeLeadData.fName + " " + employeeLeadData.lName}
              </div>
            </div>
          )}
          <LeadTable employeeLeadData={employeeLeadData} />
        </>
      )}
    </div>
  );
};

export default Team;
