import { API_AUTH_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const loginPage = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_AUTH_URL}public/sub-domain-details/${payload}`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const checkUserTrust = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_AUTH_URL}auth/user-trusts`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
