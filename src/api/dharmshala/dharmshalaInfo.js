import { callApi, callDharmshalaApi } from "../../utility/utils/callApi";

export const getDharmshalaList = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`buildings/`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const importFile = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`dharmshala/import-file`, payload),
  });

export const exportData = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`buildings/`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createBuilding = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`buildings/`, payload),
    successCode: 201,
  });

export const deleteDharmshalaInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`buildings/${payload}`),
  });

export const getDharmshalaInfoDetail = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`buildings/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateDharmshalaInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) =>
      axios.put(`buildings/${payload.buildingId}`, payload),
  });
export const createRoomType = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`roomTypes/`, payload),
    successCode: 201,
  });

export const getRoomTypeList = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`roomTypes/`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const deleteRoomTypeInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`roomTypes/${payload}`),
  });
export const updateRoomTypeInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) =>
      axios.put(`roomTypes/${payload.roomTypeId}`, payload),
  });

export const getRoomTypeDetail = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`roomTypes/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getDharmshalaFloorList = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`buildings/${payload}/floors`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createDharmshalaFloor = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`floors/`, payload),
    successCode: 201,
  });
