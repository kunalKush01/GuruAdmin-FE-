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

export const deleteCattleInfo = (payload) =>
  callApi({
    requestFunction: (axios) => axios.delete(`cattle/${payload}`),
  });
