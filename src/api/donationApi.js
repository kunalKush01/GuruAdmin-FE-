import { API_AUTH_URL, API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createDonation = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation/create`, payload),
    successCode: 200,
  });

export const donationDownloadReceiptApi = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_AUTH_URL}public/donation-pdf/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllDonation = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}donation`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const exportAllDonation = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}donation`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const importDonationFile = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`donation/import-file`, payload),
  });

export const getAllPaidDonations = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}commitment/donations/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateDonation = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation/update`, payload),
  });

// export const updateDonationDetail = (payload) =>
//   callApi({
//     requestFunction: (axios) =>
//       axios.put(`${API_BASE_URL}news/update`, payload),
//   });

export const addLangDonationDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}news/add-language`, payload),
  });

export const deleteDonationDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}news/delete/${payload}`),
  });
