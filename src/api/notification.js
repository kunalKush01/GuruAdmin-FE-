import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";


export const getAllNotification = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}notification`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const readNotification = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}notification/seen`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });