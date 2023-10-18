import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApiInstance } from "../../axiosApi/authApiInstans";

const TOASTSLIDE = {
  toastId: "apnaMandirSuperAdminError",
};

export const login = createAsyncThunk("Auth", async (params, thunkApi) => {
  try {
    const res = await authApiInstance.post("auth/login", params?.data);
    if (params?.onCallback) {
      params?.onCallback(true);
    }
    return res.data.data;
  } catch (error) {
    const message = error?.response?.data?.message ?? "Something went wrong";
    toast.error(message, { ...TOASTSLIDE });
    if (params?.onCallback) {
      params?.onCallback(false);
    }
    // thunkApi.rejectWithValue(error?.response?.data);
    throw error.response;
  }
});

const authSlice = createSlice({
  name: "Auth",
  initialState: {
    userDetail: "",
    tokens: {
      accessToken: "",
      refreshToken: "",
    },
    // notifyIds:[],
    isLogged: false,
    isLoading: false,
    selectLang: {
      name: "english",
      langCode: "en",
      id: "6332cbba8054b2cac94da3d1",
    },
    availableLang: [],
    trustDetail: {},
    lacalSearch: "",
  },
  reducers: {
    logOut: (state, action) => {
      state.userDetail = "";
      state.isLogged = false;
      (state.tokens.accessToken = ""), (state.tokens.refreshToken = "");
      state.isLoading = false;
      state.selectLang = {
        name: "english",
        langCode: "en",
        id: "6332cbba8054b2cac94da3d1",
      };
    },
    // selectedData: (state, action) => {
    //   state.notifyIds = [...action.payload];
    // },
    addFacility(state, action) {
      state.trustDetail.trustFacilities = Array.isArray(action.payload)
        ? action.payload
        : [...state.trustDetail.trustFacilities, action.payload];
    },
    clearFacilities(state) {
      state.trustDetail.trustFacilities = [];
    },
    handleProfileUpdate(state, action) {
      state.trustDetail = { ...state.trustDetail, ...action.payload };
    },

    handleTrustDetail(state, action){
      state.trustDetail = action.payload
    },

    handleTokenLogin(state, action) {
      state.userDetail = action.payload.result;
      state.isLogged =
        action.payload.tokens.access.token &&
        action.payload.tokens.refresh.token &&
        true;
      state.tokens.accessToken = action.payload.tokens.access.token;
      state.tokens.refreshToken = action.payload.tokens.refresh.token;
      state.trustDetail = action.payload.trust;
      state.isLoading = false;
    },

    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.tokens.accessToken = accessToken;
      state.tokens.refreshToken = refreshToken;
    },
    setlang: (state, action) => {
      state.selectLang = action.payload;
    },
    setAvailableLang: (state, action) => {
      state.availableLang = action.payload;
    },
    setSearchbarValue: (state, action) => {
      state.lacalSearch = action?.payload ?? "";
    },
  },

  extraReducers: {
    [login.pending]: (state, action) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.userDetail = action.payload.result;
      state.isLogged =
        action.payload.tokens.access.token &&
        action.payload.tokens.refresh.token &&
        true;
      state.tokens.accessToken = action.payload.tokens.access.token;
      state.tokens.refreshToken = action.payload.tokens.refresh.token;
      state.trustDetail = action.payload.trust;
      state.isLoading = false;
      // toast.success(action.payload.message)
    },
    [login.rejected]: (state, action) => {
      state.userDetail = "";
      state.isLogged = false;
      (state.tokens.accessToken = ""), (state.tokens.refreshToken = "");
      state.isLoading = false;
    },
  },
});
const persistConfig = {
  key: "auth",
  storage,
};

export const {
  logOut,
  addFacility,
  clearFacilities,
  handleProfileUpdate,
  setTokens,
  setlang,
  handleTrustDetail,
  // selectedData,
  handleTokenLogin,
  setAvailableLang,
  setSearchbarValue,
} = authSlice.actions;
export const selectAccessToken = (state) => state.auth.tokens.accessToken;
export const selectRefreshToken = (state) => state.auth.tokens.refreshToken;

export default persistReducer(persistConfig, authSlice.reducer);
