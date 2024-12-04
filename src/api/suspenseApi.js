import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createImport = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
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
export const getAllFileUploaded = (page = 1, limit = 10) => {
  return callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}suspense/import-history`, {
        params: { page, limit },
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
