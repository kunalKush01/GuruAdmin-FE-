import { callApi } from "../../utility/utils/callApi";

export const getCattlesUsageList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/usage`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
