import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DriverLocationState = {
  latitude: string;
  longitude: string;
};

const initialState: DriverLocationState = {
  latitude: "",
  longitude: "",
};

const driverLocationSlice = createSlice({
  name: "driverLocation",
  initialState,
  reducers: {
    setDriverLocation: (state, action: PayloadAction<DriverLocationState>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const { setDriverLocation } = driverLocationSlice.actions;
export default driverLocationSlice.reducer;
