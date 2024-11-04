import {callApi} from "../utility/utils/callApi";
import {API_BASE_URL} from "../axiosApi/authApiInstans";

export const getAllReporDisputeList = (payload) =>
    callApi({
        requestFunction: (axios) => axios.post(`${API_BASE_URL}dispute`, payload),
        showToastOnSuccess: false,
        showToastOnError: false,
    });

    export const updateDisputeStatus = (disputeId) =>
      callApi({
        requestFunction: (axios) =>
          axios.put(`${API_BASE_URL}dispute/update-status/${disputeId}`),
        showToastOnSuccess: true, // Show toast if you want a success message
        showToastOnError: true, // Show toast if you want an error message
      });