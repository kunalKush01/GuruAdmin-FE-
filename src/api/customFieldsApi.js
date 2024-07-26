import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const getDonationCustomFields = () =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/donation/custom-fields`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createDonationCustomFields = (data) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/donation/create-custom-field`, data),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getPledgeCustomFields = () =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/commitment/custom-fields`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createPledgeCustomFields = (data) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/commitment/create-custom-field`, data),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getDonationBoxCustomFields = () =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}/donation-box/custom/custom-fields`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createDonationBoxCustomFields = (data) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}/donation-box/create-custom-field`, data),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
