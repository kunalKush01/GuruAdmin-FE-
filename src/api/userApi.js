import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";
// subscribed user 
export const createUser = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}user/register`, payload),
    successCode: 201,
  });


// configration sub admin 
export const createSubAdmin = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}sub-admin/create`, payload),
    successCode: 201,
  });

export const getAllUser = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}sub-admin`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const getAllUserRoles = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}sub-admin/role`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  export const getSubAdminDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}sub-admin/${payload}`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
  });

  export const updateSubAdminUser = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}sub-admin/update`, payload),
  });
  
  export const deleteSubAdmin = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}sub-admin/delete/${payload}`, payload),
  });