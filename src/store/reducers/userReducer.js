import { createSlice } from "@reduxjs/toolkit";

const userListSlice = createSlice({
    name: "userListState",
    initialState: {
      user: [],      
      loaded: false,
    },
    reducers: {
      setusersList: (state, action) => {
        
       
        state.user = action.payload;
        
      },
      dataLoaded: (state) => {
        state.loaded = true;
      },
    },
  });
  export const { setusersList, dataLoaded } = userListSlice.actions;
  export default userListSlice.reducer;