import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const getMemberSchema = () =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}memberSchema`),
    successCode: 200,
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllMembers = (payload) => {
  return callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}members`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const getMembersById = (id) => {
  return callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}members/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
