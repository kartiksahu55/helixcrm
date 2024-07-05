import { configureStore } from "@reduxjs/toolkit";

import userDataReducer from "../slices/user/userDataSlice"

export const store = configureStore({
    reducer: userDataReducer
});
