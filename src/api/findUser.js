import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const findAllUsersByName = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}find-user/name`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  export const findAllUsersByNumber = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}find-user/number`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const findAllComitmentByUser = (payload) =>
    callApi({
        requestFunction: (axios) => axios.post(`${API_BASE_URL}find-user/commitment`, payload),
        showToastOnSuccess: false,
        showToastOnError: false,
    });