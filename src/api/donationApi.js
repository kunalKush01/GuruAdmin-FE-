import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createDonation = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation/create`, payload),
    successCode: 200,
  });

export const getAllDonation = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}donation`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getDonationDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/get-news`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateDonationDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/update`, payload),
  });


  export const addLangDonationDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/add-language`, payload),
  });



  export const deleteDonationDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}news/delete/${payload}`, ),
  });