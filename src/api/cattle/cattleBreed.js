import { callApi } from "../../utility/utils/callApi";

export const getCattlesBreedList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/breed-list`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createBreed = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`cattle/add-breed`, payload),
    successCode: 201,
  });

export const updateBreed = (payload) =>
  callApi({
    requestFunction: (axios) => axios.put(`cattle/edit-breed`, payload),
  });

export const deleteCattleBreed = (payload) =>
  callApi({
    requestFunction: (axios) => axios.delete(`cattle/delete-breed/${payload}`),
  });
