import {callApi} from "../utility/utils/callApi";
import {API_BASE_URL} from "../axiosApi/authApiInstans";

export const getAllReporDisputeList = (payload) =>
    callApi({
        requestFunction: (axios) => axios.post(`${API_BASE_URL}dispute`, payload),
        showToastOnSuccess: false,
        showToastOnError: false,
    });
