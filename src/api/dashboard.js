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

export const getAllTopDonor = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}dashboard/top-donar`, payload),
    successCode: 200,
    showToastOnSuccess:false,
    showToastOnError:false
  });

export const getAllRecentDonationList = (payload) =>
    callApi({
      requestFunction: (axios) =>
        axios.get(`${API_BASE_URL}dashboard/donation`, payload),
      successCode: 200,
      showToastOnSuccess:false,
      showToastOnError:false
    });

export const getAllChartData = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}dashboard/chart-data`, payload),
    successCode: 200,
    showToastOnSuccess:false,
    showToastOnError:false
  });