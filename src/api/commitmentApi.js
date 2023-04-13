import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createCommitment = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}commitment/create`, payload),
    successCode: 200,
  });


export const getAllPaidDonationsReceipts = (payload) =>
callApi({
  requestFunction: (axios) =>
    axios.get(`${API_BASE_URL}commitment/all-donations/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
});



  export const getAllMasterCategories = (payload) =>
  
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}donation-category/list-master`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const getCommitmentDates = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}event/get-dates`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllCommitments = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}commitment`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getCommitmentDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}commitment/get-commitment`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateCommitmentDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}commitment/update`, payload),
  });


  export const addLangCommitmentDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category/add-language`, payload),
  });



  export const deleteCommitment = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}commitment/delete/${payload}`, ),
  });