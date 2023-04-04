import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const getAllPunyarjak = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}punyarjak`, payload),
    showToastOnError:false,
    showToastOnSuccess:false,
  });

  export const createPunyarjak = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}punyarjak/add`, payload),
    successCode: 201,
  });

  export const getPunyarjakDetails = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}punyarjak/${payload}`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
  });


  export const updatePunyarjak = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}punyarjak/update`, payload),
  });
  
  
  export const deletePunyarjak = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}punyarjak/${payload}`, ),
  });