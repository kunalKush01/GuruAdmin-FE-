import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";


export const forgotPassword = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}auth/forgot-password`, payload),
    showToastOnSuccess: true,
    showToastOnError: true,
  });