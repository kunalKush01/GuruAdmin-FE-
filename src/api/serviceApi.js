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
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/service`, payload),
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
