import { createSlice } from "@reduxjs/toolkit";

interface Business {
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
  currentBusiness?: Business;
} = {
  businessList: [],
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    updateBusinessList: (state, action) => {
      return {
        businessList: action.payload,
        currentBusiness: state.currentBusiness,
      };
    },
    setCurrentBusinessData: (state, action) => {
      return {
        businessList: state.businessList,
        currentBusiness: action.payload,
      };
    },
  },
});

export const { updateBusinessList, setCurrentBusinessData } =
  businessSlice.actions;
export default businessSlice.reducer;
