import axios from "axios";

import { FETCH_SALES_DATA_API } from "../../apiDetails";

export const AccountApiCall = async () => {
  const response = await axios.get(FETCH_SALES_DATA_API, {
    withCredentials: true,
  });

  console.log(response);
  if (response.data.success) {
    return response.data.data;
  }
};
