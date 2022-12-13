import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";


export const getAllNotification = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}user`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });