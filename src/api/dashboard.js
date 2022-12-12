import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";


export const getAllDashboardData = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}dashboard`, payload),
    successCode: 200,
    showToastOnSuccess:false,
    showToastOnError:false
  });