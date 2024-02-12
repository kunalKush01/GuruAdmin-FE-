import { callApi } from "../../utility/utils/callApi";

export const getCattlesList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const importFile = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/import-file`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const exportData = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createCattleInfo = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/create`, payload),
    successCode: 201,
  });

export const deleteCattleInfo = (payload) =>
  callApi({
    requestFunction: (axios) => axios.delete(`cattle/${payload}`),
  });

export const getCattleInfoDetail = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`cattle/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateCattleInfo = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`cattle/edit`, payload),
  });
