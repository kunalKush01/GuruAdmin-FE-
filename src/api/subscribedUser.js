import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createSubscribedUser = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}user/register`, payload),
    successCode: 200,
  });


  export const getAllMasterCategories = (payload) =>
  
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}donation-category/list-master`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const getEventDates = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}event/get-dates`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllSubscribedUser = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}user`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getSubCategoryDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category/get`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateCategoryDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category/update`, payload),
  });


  export const addLangCategoryDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category/add-language`, payload),
  });



  export const deleteCategoryDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}donation-category/delete/${payload}`, ),
  });