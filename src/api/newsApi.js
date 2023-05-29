import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createNews = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/create`, payload),
    successCode: 200,
  });

export const getAllNews = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}news`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getNewsDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/get-news`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateNewsDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}news/update`, payload),
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
