import { callApi } from "../../utility/utils/callApi";

export const getCattlesStockList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`/item/stock-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getCattlesItemsList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createStockItem = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/create`, payload),
    successCode: 200,
  });
