import { createSlice } from "@reduxjs/toolkit";

interface Business {
  address: string;
  name: string;
  pictureUrl: string;
  type: string;
  posts: string[];
  rating: number;
}

interface FuncObject {
  [key: string]: (...args: any[]) => any;
}

type BusinessList = Business[];

const initialState: { businessList: BusinessList; helper: FuncObject } = {
  businessList: [],
  helper: {},
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    updateBusinessList: (state, action) => {
      return {
        businessList: action.payload,
        helper: state.helper,
      };
    },
    updateHelper: (state, action) => {
      return {
        businessList: state.businessList,
        helper: action.payload,
      };
    },
  },
});

export const { updateBusinessList, updateHelper } = businessSlice.actions;
export default businessSlice.reducer;
