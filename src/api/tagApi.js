import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const getAllTags = (payload) =>
    callApi({
        requestFunction: (axios) => axios.post(`${API_BASE_URL}tag`, payload),
        showToastOnSuccess: false,
        showToastOnError: false,
    });