import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

// Create a new import
export const createImport = (trustId, payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/suspense/imports/${trustId}`, payload),
    successCode: 201, // Status code for successful creation
  });

// Get all imports for a specific trust
export const getAllImports = (trustId) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/suspense/imports/${trustId}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

// Get import details by ID
export const getImportById = (trustId, id) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/suspense/imports/${trustId}/${id}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

// Update import status by ID
export const updateImportStatus = (trustId, id, status) =>
  callApi({
    requestFunction: (axios) =>
      axios.patch(`${API_BASE_URL}/suspense/imports/${trustId}/${id}/status`, {
        status,
      }),
    successCode: 200, // Status code for successful update
  });
