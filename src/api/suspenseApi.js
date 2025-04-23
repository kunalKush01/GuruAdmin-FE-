import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";
const ADMIN_PUBLIC_URL = process.env.REACT_APP_BASEURL;
export const createImport = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("createdBy", payload.createdBy);
    formData.append("accountId", payload.accountId);
    Object.keys(payload.targetFields).forEach((key) => {
      formData.append(`targetFields[${key}]`, payload.targetFields[key]);
    });
    formData.append("sourceFields", JSON.stringify(payload.sourceFields));

    const response = await callApi({
      requestFunction: (axios) =>
        axios.post(`${API_BASE_URL}suspense/imports`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      showToastOnSuccess: false,
      showToastOnError: false,
    });

    return response;
  } catch (error) {
    console.error("Error creating import:", error);
    throw new Error("Error creating import");
  }
};
export const getAllSuspense = (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}suspense/importsList`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const getAllFileUploaded = (page = 1, limit = 10, uploadType) => {
  return callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}suspense/import-history`, {
        params: { page, limit, uploadType },
      }),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};

export const deleteSuspense = async (id) => {
  return callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}suspense/imports/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const addSuspense = async (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}suspense/import`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};

export const updateSuspense = async ({ id, updatedData }) => {
  return callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}suspense/imports/${id}`, updatedData),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const extractDataFromImage = async (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${ADMIN_PUBLIC_URL}public/extract-text`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const getImagePaymentByID = async (id) => {
  return callApi({
    requestFunction: (axios) =>
      axios.get(`${ADMIN_PUBLIC_URL}public/image-payment/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const searchSupense = async (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}suspense/search`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};

export const syncSuspenseWithSearch = async () => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}suspense/sync-search`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const getPossibleOrBestMatch = async (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}suspense/match-suspense`,payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const matchTransaction = async (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}suspense/match-transactions`,payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
