import { createSlice } from "@reduxjs/toolkit";

export interface Business {
  address: string;
  name: string;
  pictureUrl: string;
  type: string;
  posts: string[];
  rating: number;
}

type BusinessList = Business[];

const initialState: {
  businessList: BusinessList;
  helper?: any;
} = {
  businessList: [],
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    updateBusinessList: (state, action) => {
      return {
        ...state,
        businessList: action.payload,
      };
    },
    setHelper: (state, action) => {
      return {
        ...state,
        helper: action.payload,
      };
    },
  },
});

export const { updateBusinessList, setHelper } = businessSlice.actions;
export default businessSlice.reducer;
