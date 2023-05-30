import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createNotice = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}notice/create`, payload),
    successCode: 200,
  });


  export const getGlobalNotices = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}notice/global`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const getNoticeDates = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}notice/get-dates`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllNotices = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}notice`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getNoticeDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}notice/get-notice`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateNoticeDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}notice/update`, payload),
  });


  export const addLangNoticeDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}notice/add-language`, payload),
  });



  export const deleteNoticeDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}notice/delete/${payload}`, ),
  });

  export const PublishNotice = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}notice/publish/${payload}`, ),
  });