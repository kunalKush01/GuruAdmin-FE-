import { callApi } from "../../utility/utils/callApi";

export const getAllDashboardData = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle-dashboard`, payload),
    successCode: 200,
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllChartData = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`cattle-dashboard/chart-data`, payload),
    successCode: 200,
    showToastOnSuccess: false,
    showToastOnError: false,
  });
