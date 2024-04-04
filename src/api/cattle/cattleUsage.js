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
    successCode: 201,
  });

export const getItemUsageDetail = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`item/get-usage/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateItemUsage = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`item/edit-usage`, payload),
  });

export const deleteUsage = (payload) =>
  callApi({
    requestFunction: (axios) => axios.delete(`item/delete-usage/${payload}`),
  });
