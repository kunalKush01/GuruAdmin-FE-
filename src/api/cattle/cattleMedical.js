import { API_BASE_URL } from "../../axiosApi/authApiInstans";
import { callApi } from "../../utility/utils/callApi";

export const getCattlesMedicalList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/medical-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createCattleMedicalRecord = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}cattle/add-medical`, payload),
    successCode: 201,
  });

export const findAllCattle = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}cattle/find-cattle`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const findAllCattleBreed = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}cattle/find-cattle-breed`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getMedicalInfoDetail = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`cattle/get-medical/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateMedicalInfo = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`cattle/edit-medical`, payload),
  });

export const deleteMedicalRecord = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`cattle/delete-medical/${payload}`),
  });
