import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createMember = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}members/create`, payload),
    successCode: 200,
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getMemberSchema = () =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}memberSchema`),
    successCode: 200,
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllMembers = (payload) => {
  return callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}members`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const getMembersById = (id) => {
  return callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}members/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
export const updateMembersById = (id, payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}members/update/${id}`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};

export const getMasterByKey = (key) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/master/get-masters-by-key/${key}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

// New function to fetch masters by an array of keys
export const getMastersByKeys = async (keys) => {
  // Create an array of promises for fetching data for each key
  const promises = keys.map((key) => getMasterByKey(key));

  // Await all promises and return the results
  return Promise.all(promises);
};

export const importMemberFile = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("createdByUserId", payload.createdByUserId);
    Object.keys(payload.targetFields).forEach((key) => {
      formData.append(`targetFields[${key}]`, payload.targetFields[key]);
    });
    formData.append("sourceFields", JSON.stringify(payload.sourceFields));

    const response = await callApi({
      requestFunction: (axios) =>
        axios.post(`${API_BASE_URL}members/imports`, formData, {
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
export const getDonationForMember = (payload) => {
  return callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation/by-member`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
};
