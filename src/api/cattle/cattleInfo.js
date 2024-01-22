import { callApi } from "../../utility/utils/callApi";

export const getCattlesList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
