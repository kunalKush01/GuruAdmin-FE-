import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";
export const createMaster = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/master/create-masters`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllMasters = ({ current, pageSize }) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/master/get-mastersList`, {
        params: {
          page: current,
          limit: pageSize,
        },
      }),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllMastersWithoutPagination = () =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/master/get-only-mastersList`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getMasterDataById = (id) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/master/get-masters/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateMasterData = (id, newData) =>
  callApi({
    requestFunction: (axios) =>
      axios.patch(`${API_BASE_URL}/master/update-masters/${id}`, newData),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const deleteMasterData = (masterId, rowId) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}/master/${masterId}/row/${rowId}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const addMasterInRow = (masterId, newRowData) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(
        `${API_BASE_URL}/master/addnewRow-masters/${masterId}`,
        newRowData
      ),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
