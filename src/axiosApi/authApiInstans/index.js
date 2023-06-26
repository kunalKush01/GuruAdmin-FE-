import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_BASEURL;

export const authApiInstance = axios.create({
  baseURL: API_BASE_URL,
  responseType: "json",
});
const fcm_token = localStorage.getItem('fcm_token')

authApiInstance.defaults.timeout = 20000;
authApiInstance.defaults.headers.common["device-type"] = "ios";
authApiInstance.defaults.headers.common["device-name"] = "1234567890";
authApiInstance.defaults.headers.common["device-token"] = fcm_token;
authApiInstance.defaults.headers.common["is-debug"] = "0";
authApiInstance.defaults.headers.common["device-id"] = "12345678912";
authApiInstance.defaults.headers.common["app-version"] = "1.0";
authApiInstance.defaults.headers.common["os-version"] = "10";
authApiInstance.defaults.headers.common["environment"] = "development";
authApiInstance.defaults.headers.common["locale-code"] = "en";
authApiInstance.defaults.headers.common["tm"] = "";
authApiInstance.defaults.headers.common["app-signature"] = "";
authApiInstance.defaults.headers.common["ip-address"] = "192.163.11.89";
// authApiInstance.defaults.headers.common["location"] = "623d6ab8cb6c0f2dab19d391";
authApiInstance.defaults.headers.common["app-signature"] = "";
