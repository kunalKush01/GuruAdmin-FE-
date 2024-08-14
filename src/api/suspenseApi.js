import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createImport = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    // Append targetFields as individual fields in the formData
    Object.keys(payload.targetFields).forEach((key) => {
      formData.append(`targetFields[${key}]`, payload.targetFields[key]);
    });
    // formData.append("targetFields", JSON.stringify(payload.targetFields));
    formData.append("sourceFields", JSON.stringify(payload.sourceFields));

    const response = await callApi({
      requestFunction: (axios) =>
        axios.post(`${API_BASE_URL}suspense/imports`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      successCode: 201,
      showToastOnSuccess: true,
      showToastOnError: true,
    });

    return response;
  } catch (error) {
    console.error("Error creating import:", error);
    throw new Error("Error creating import");
  }
};

export const getAllSuspense = async () => {
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}suspense/imports`),
  });
};
