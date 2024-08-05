import axios from "axios";
import {
  logOut,
  selectAccessToken,
  selectRefreshToken,
  setTokens,
} from "../../redux/authSlice/index";
import { extractDataFromResponse, parseApiErrorResponse } from "./apiUtils";

import { toast } from "react-toastify";
import { API_AUTH_URL } from "../../axiosApi/authApiInstans";
import { store } from "../../redux/store";

/*
Api Response data sample
{
  "code": 200,
  "status": true,
  "message": "Success",
  "data": {
    "institute": {
      "_id": "61ff99fc5561dd0cf0fa622e",
      "name": "Demo institute",
      "country": "India",
      "state": "Rajasthan",
      "city": "Jodhpur",
      "address": "demo"
    }
  }
}
*/
const fcm_token = localStorage.getItem("fcm_token");
export const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "device-type": "android",
  "device-name": "1234567890",
  "device-token": fcm_token,
  "is-debug": "0",
  "device-id": "12345678912",
  "app-version": "1.0",
  "device-os-version": "10",
  environment: "development",
  "locale-code": "en",
  tm: "",
  "app-signature": "",
  merchant: "623d6ab8cb6c0f2dab19d390",
  location: "623d6ab8cb6c0f2dab19d391",
  "os-version": "11.2",
};

const ApiTimeOutToast = {
  toastId: "ApiTimeout",
};

export const refreshTokenRequest = async ({ refreshToken, axiosInstance }) => {
  try {
    const response = await axiosInstance.post(
      `${API_AUTH_URL}auth/refresh-token`,
      { refreshToken }
    );
    return extractDataFromResponse({
      response,
      showErrorToast: false,
      showSuccessToast: false,
    });
  } catch (error) {
    return parseApiErrorResponse({
      error,
      showToast: false,
    });
  }
};

export const callApi = async ({
  requestFunction,
  successCode = 200,
  showToastOnSuccess = true,
  showToastOnError = true,
  callRefreshTokenOnAuthError = true,
  refreshSuccessRestFail = false,
  authErrorCode = 401,
}) => {
  const accessToken = selectAccessToken(store.getState());

  const trustId = localStorage.getItem("trustId");

  const headers = {
    ...defaultHeaders,
    // 'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASEURL}${
      //store.getState()?.auth?.trustDetail?.id
      trustId
    }/`,
    headers,
    responseType: "json",
    timeout: 10000,
  });

  if (requestFunction) {
    try {
      const response = await requestFunction(axiosInstance);
      // console.log("response gs", response);

      return extractDataFromResponse({
        response,
        successCode,
        showSuccessToast: showToastOnSuccess,
        showErrorToast: showToastOnError,
      });
    } catch (error) {
      // console.log("gs logs-------->", error);

      if (error.code === "ECONNABORTED") {
        toast.error("Please check your internet connection.", {
          ...ApiTimeOutToast,
        });
      }
      if (error.response) {
        if (
          error.response.status === authErrorCode ||
          error.response.data.code === authErrorCode
        ) {
          if (callRefreshTokenOnAuthError) {
            const refreshToken = selectRefreshToken(store.getState());

            const refreshTokenResponseData = await refreshTokenRequest({
              axiosInstance,
              refreshToken,
            });
            if (refreshTokenResponseData.error) {
              store.dispatch(logOut());
              return { error: true };
            }
            const newAccessToken =
              refreshTokenResponseData?.tokens?.access?.token;
            const newRefreshToken =
              refreshTokenResponseData?.tokens?.refresh?.token;
            if (newAccessToken && newRefreshToken) {
              store.dispatch(
                setTokens({
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                })
              );

              return callApi({
                requestFunction,
                successCode,
                showToastOnSuccess,
                showToastOnError,
                callRefreshTokenOnAuthError: false,
                refreshSuccessRestFail:
                  newAccessToken &&
                  newRefreshToken &&
                  error?.response?.data?.code === 401,
              });
            }

            return { error: true };
          } else if (refreshSuccessRestFail) {
            store.dispatch(logOut());
            return { error: true };
          }
          return { error: true };
        }

        return parseApiErrorResponse({
          error,
          showToast: showToastOnError,
        });
      }
    }
  }
  return { error: true };
};

export const callDharmshalaApi = async ({
  requestFunction,
  successCode = 200,
  showToastOnSuccess = true,
  showToastOnError = true,
  callRefreshTokenOnAuthError = true,
  refreshSuccessRestFail = false,
  authErrorCode = 401,
}) => {
  const accessToken = selectAccessToken(store.getState());

  const trustId = localStorage.getItem("trustId");

  const headers = {
    ...defaultHeaders,
    // 'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    "x-dharmshala-id": trustId,
  };
  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_DHARMSHALA_BASEURL}`,
    headers,
    responseType: "json",
    timeout: 10000,
  });

  if (requestFunction) {
    try {
      const response = await requestFunction(axiosInstance);

      return extractDataFromResponse({
        response,
        successCode,
        showSuccessToast: showToastOnSuccess,
        showErrorToast: showToastOnError,
      });
    } catch (error) {

      if (error.code === "ECONNABORTED") {
        toast.error("Please check your internet connection.", {
          ...ApiTimeOutToast,
        });
      }
      if (error.response) {
        if (
          error.response.status === authErrorCode ||
          error.response.data.code === authErrorCode
        ) {
          if (callRefreshTokenOnAuthError) {
            const refreshToken = selectRefreshToken(store.getState());

            const refreshTokenResponseData = await refreshTokenRequest({
              axiosInstance,
              refreshToken,
            });
            if (refreshTokenResponseData.error) {
              store.dispatch(logOut());
              return { error: true };
            }
            const newAccessToken =
              refreshTokenResponseData?.tokens?.access?.token;
            const newRefreshToken =
              refreshTokenResponseData?.tokens?.refresh?.token;
            if (newAccessToken && newRefreshToken) {
              store.dispatch(
                setTokens({
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                })
              );

              return callApi({
                requestFunction,
                successCode,
                showToastOnSuccess,
                showToastOnError,
                callRefreshTokenOnAuthError: false,
                refreshSuccessRestFail:
                  newAccessToken &&
                  newRefreshToken &&
                  error?.response?.data?.code === 401,
              });
            }

            return { error: true };
          } else if (refreshSuccessRestFail) {
            store.dispatch(logOut());
            return { error: true };
          }
          return { error: true };
        }

        return parseApiErrorResponse({
          error,
          showToast: showToastOnError,
        });
      }
    }
  }
  return { error: true };
};
