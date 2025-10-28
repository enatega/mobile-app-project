import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DriverLocationState = {
  latitude: number | undefined;
  longitude: number | undefined;
};

const initialState: DriverLocationState = {
  latitude: undefined,
  longitude: undefined,
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
