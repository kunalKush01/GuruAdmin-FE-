import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createEvent = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}event/create`, payload),
    successCode: 200,
  });


  export const getGlobalEvents = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}event/global`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const getEventDates = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}event/get-dates`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllEvents = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}event`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  export const getEventDetail = (payload) =>
    callApi({
      requestFunction: (axios) =>
        axios.post(`${API_BASE_URL}event/get-event`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
    });

export const updateEventDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}event/update`, payload),
  });


  export const addLangEventDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}event/add-language`, payload),
  });



  export const deleteEventDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}event/delete/${payload}`, ),
  });