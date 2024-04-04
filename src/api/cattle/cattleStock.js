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

export const getSupplyList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/supply-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createSupplyItem = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/add-supply`, payload),
    successCode: 201,
  });

export const createStockItem = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/create`, payload),
    successCode: 201,
  });

export const getItemDetail = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`item/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateItem = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`item/edit`, payload),
  });

export const getSupplyDetail = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`item/get-supply/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateSupply = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`item/edit-supply`, payload),
  });

export const deleteSupplies = (payload) =>
  callApi({
    requestFunction: (axios) => axios.delete(`item/delete-supply/${payload}`),
  });

export const deleteItem = (payload) =>
  callApi({
    requestFunction: (axios) => axios.delete(`item/${payload}`),
  });
