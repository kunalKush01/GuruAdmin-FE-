import { callApi } from "../../utility/utils/callApi";

export const getCattlesCategoryList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/category-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createCattleCategory = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/add-category`, payload),
    successCode: 201,
  });

export const updateCattleCategory = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`cattle/edit-category`, payload),
    successCode: 201,
  });

export const deleteCattleCategory = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`cattle/delete-category/${payload}`),
  });
