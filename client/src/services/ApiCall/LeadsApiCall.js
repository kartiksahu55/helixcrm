import axios from "axios";

import { FETCH_LEADS_DATA_API } from "../../apiDetails";

export const LeadApiCall = async () => {
  const response = await axios.get(FETCH_LEADS_DATA_API, {
    withCredentials: true,
  });

  if (response) {
    return response.data.data;
  }
}