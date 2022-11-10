import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApiInstance } from "../../axiosApi/authApiInstans";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { toast } from "react-toastify";
import { store } from "../store";
export const login = createAsyncThunk("Auth", async (data, thunkApi) => {
  const res = await authApiInstance.post("auth/login", data);
  return res.data
});



const authSlice = createSlice({
  name: "Auth",
  initialState: {
    userDetail: "",
    tokens: {
      accessToken: "",
      refreshToken: "",
    },

    isLogged: false,
    isLoading: false,
    selectLangCode:"en",
    availableLang:[]
  },
  reducers: {
    logOut: (state, action) => {
      state.userDetail = "";
      state.isLogged = false;
      (state.tokens.accessToken = ""), (state.tokens.refreshToken = "");
      state.isLoading = false;
      state.selectLangCode="en"
    },
    setTokens: (state, action) => {
        const { accessToken, refreshToken } = action.payload;
        state.tokens.accessToken = accessToken;
        state.tokens.refreshToken = refreshToken;
      },
    setlang:(state,action)=>{
      state.selectLangCode=action.payload
    },
    setAvailableLang:(state,action)=>{
      
      state.availableLang=action.payload
    }
  },

  extraReducers: {
    [login.pending]: (state, action) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
        
      state.userDetail = action.payload.result  ;
      state.isLogged = action.payload.tokens.access.token&&action.payload.tokens.refresh.token&&true;
      state.tokens.accessToken = action.payload.tokens.access.token;
      state.tokens.refreshToken = action.payload.tokens.refresh.token;

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
    key: 'auth',
    storage,
  }  

export const {logOut,setTokens,setlang,setAvailableLang} = authSlice.actions
export const selectAccessToken = (state)=>state.auth.tokens.accessToken 
export const selectRefreshToken = (state)=>state.auth.tokens.refreshToken

export default persistReducer(persistConfig,authSlice.reducer)
