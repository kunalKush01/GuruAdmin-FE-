import { API_AUTH_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const forgotPassword = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_AUTH_URL}auth/forgot-password`, payload),
  });

export const resetPassword = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_AUTH_URL}auth/reset-password`, payload),
    showToastOnError: true,
  });

export const setPassword = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_AUTH_URL}auth/set-password`, payload),
  });
