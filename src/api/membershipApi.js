import { API_AUTH_URL, API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const getMemberSchema = () =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}memberSchema`),
    successCode: 200,
  });
