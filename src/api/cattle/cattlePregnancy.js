import { callApi } from "../../utility/utils/callApi";

export const getCattlesPregnancyList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/pregnancy-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createPregnancyReport = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/add-pregnancy`, payload),
    successCode: 201,
  });

export const deletePregnancy = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`cattle/delete-pregnancy/${payload}`),
  });
