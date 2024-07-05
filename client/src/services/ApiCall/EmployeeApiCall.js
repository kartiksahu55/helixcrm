import axios from "axios";

import { FETCH_EMPLOYEE_DATA_API } from "../../apiDetails";

const EmployeeApiCall = async () => {
  const response = await axios.get(FETCH_EMPLOYEE_DATA_API, {
    withCredentials: true,
  });

  if (!response) {
    throw Error("Oops! Something went wrong.");
  }
  const employee = response.data.data.map((e) => {
    return { ...e, menu: false };
  });
  console.log(employee);
  return employee;
};

export { EmployeeApiCall };
