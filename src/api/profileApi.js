import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const getAllTrustType = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}trust/trust-type`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateProfile = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}trust/update`, payload),
  });
export const getUpdatedTrustDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}trust/get-trust`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const addLangProfileDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}trust/add-language`, payload),
  });
export const getAllTrustPrefeces = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}preference`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllAccounts = () =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}trust/account`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createAccount = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}trust/account`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateAccount = (payload, id) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}trust/account/${id}`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const deleteAccount = (id, payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}trust/account/${id}`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAccountById = (id) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}trust/account/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
