import { callApi } from "../../utility/utils/callApi";

export const getCattlesUsageList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/usage-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createItemUsage = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/add-usage`, payload),
    successCode: 200,
  });
