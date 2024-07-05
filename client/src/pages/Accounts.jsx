import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { AccountTable } from "../components/TabularData/AccountTable";
import GroupSectorButton from "../components/UI/GroupSectorButton";
import { AccountApiCall } from "../services/ApiCall/AccountApiCall";
import { fetchAccountData } from "../slices/user/userDataSlice";

export const Accounts = () => {
  const [leadSector, setLeadSector] = useState("Real Estate");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshLead, setRefreshLead] = useState(false);

  const dispatch = useDispatch();

  let accountData = useSelector((state) => state.accountData);
  //   Sector/Category wise filter
  const filteredAccountData = accountData.filter(
    (e) => e.sector === leadSector,
  );

  console.log(refreshLead);

  useEffect(() => {
    const fetchSalesDataApi = async () => {
      try {
        setIsLoading(true);
        const data = await AccountApiCall();
        console.log(data);
        dispatch(fetchAccountData(data));
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (accountData.length === 0 || refreshLead) {
      fetchSalesDataApi();
      setRefreshLead(false);
    }
  }, [refreshLead]);

  return (
    <>
      <div className="mt-2">
        <h2 className="font-serif text-2xl font-semibold">Accounts</h2>
        <GroupSectorButton
          leadCategory={leadSector}
          setLeadCategory={setLeadSector}
        ></GroupSectorButton>
        <AccountTable
          accountData={filteredAccountData}
          leadSector={leadSector}
          isLoading={isLoading}
          setRefreshLead={setRefreshLead}
        />
      </div>
    </>
  );
};

export default Accounts;
