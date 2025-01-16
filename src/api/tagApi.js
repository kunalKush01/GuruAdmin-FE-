import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";
const URL = process.env.REACT_APP_BASEURL_PUBLIC;
const trustId = localStorage.getItem("trustId");
export const getAllTags = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${URL}${trustId}/news/tags`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getAllEventTags = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${URL}${trustId}/event/tags`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
