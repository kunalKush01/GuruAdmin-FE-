import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createBoxCollection = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-box/create`, payload),
    successCode: 200,
  });

export const getAllBoxCollection = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}donation-box`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getCollectionBoxDetail = ({donationBoxId}) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}donation-box/${donationBoxId}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateCollectionBoxDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-box/update`, payload),
  });


  export const addLangNewsDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/add-language`, payload),
  });



  export const deleteNewsDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}news/delete/${payload}`, ),
  });