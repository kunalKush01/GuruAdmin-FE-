import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";

export default class JwtService {
  constructor(jwtOverrideConfig) {
    // ✅ Initialize configs and fields
    this.jwtConfig = { ...jwtDefaultConfig, ...jwtOverrideConfig };
    this.isAlreadyFetchingAccessToken = false;
    this.subscribers = [];

    // ✅ Axios request interceptor
    axios.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken();
        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Axios response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;
              this.setToken(r.data.accessToken);
              this.setRefreshToken(r.data.refreshToken);
              this.onAccessTokenFetched(r.data.accessToken);
            });
          }

          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(axios(originalRequest));
            });
          });
          return retryOriginalRequest;
        }

        return Promise.reject(error);
      }
    );
  }

  // ✅ Notify all subscribers with new access token
  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args);
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
