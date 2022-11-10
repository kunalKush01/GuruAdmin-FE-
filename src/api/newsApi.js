import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createNews =(payload)=> callApi({
    requestFunction:(axios)=>axios.post(`${API_BASE_URL}news/create`,payload)
})


export const getAllNews =(payload)=> callApi({
    requestFunction:(axios)=>axios.post(`${API_BASE_URL}news`,payload),
    showToastOnSuccess:false,
    showToastOnError:false
})