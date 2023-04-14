import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const loginPage = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}trust/sub-domain-details/${payload}`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
