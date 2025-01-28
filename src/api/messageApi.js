import { API_AUTH_URL, API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const listMessages = (payload) =>
    callApi({
      requestFunction: (axios) => axios.post(`${API_BASE_URL}/message/list`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
    });

export const updateMessage = (messageId, payload) =>
    callApi({
      requestFunction: (axios) => axios.put(`${API_BASE_URL}/message/${messageId}`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
    });   
    
export const deleteMessage = (messageId) =>
    callApi({
      requestFunction: (axios) => axios.delete(`${API_BASE_URL}/message/${messageId}`),
      showToastOnSuccess: false,
      showToastOnError: false,
     });    