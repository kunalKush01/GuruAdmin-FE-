import { createSlice } from "@reduxjs/toolkit";


const searchSlice = createSlice({
  name: "LocalSearch",
  initialState: {
    
    LocalSearch: "",
  },
  reducers: {    
    setSearchbarValue: (state, action) => {
      state.LocalSearch = action?.payload ?? "";
    },
  },

  
});


export const {
  
  setSearchbarValue,
} = searchSlice.actions;


export default  searchSlice.reducer
