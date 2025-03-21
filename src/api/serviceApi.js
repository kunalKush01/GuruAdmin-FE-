import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";
export const addService = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/service/create`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllServices = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}/service`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateService = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}/service/update`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const deleteService = (serviceId) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}/service/delete/${serviceId}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createBooking = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/booking/create`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllBookedServices = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/booking/list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getBookingById = (id) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}/booking/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getServiceById = (id) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}/service/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const deleteBooking = (id) =>
  callApi({
    requestFunction: (axios) => axios.delete(`${API_BASE_URL}/booking/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
