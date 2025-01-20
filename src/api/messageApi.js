import { API_AUTH_URL, API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const listMessages = (payload) =>
    callApi({
      requestFunction: (axios) => axios.post(`${API_BASE_URL}/message/list`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
    });