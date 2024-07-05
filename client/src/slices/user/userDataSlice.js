import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoggedIn: false,
  isLoadingCheck: false,
  userData: {},
  employeeData: [],
  leadData: [],
  accountData: [],
};

export const userDataSlice = createSlice({
  name: "userDetail",
  initialState,
  reducers: {
    // User Loggedin Status Data
    isUserLoggedIn: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },

    // Loadding Status Data
    isLoadingCheck: (state, action) => {
      state.isLoadingCheck = action.payload;
    },

    // User Data
    fetchUserData: (state, action) => {
      const userData = {
        id: action.payload._id,
        userId: action.payload.userId,
        fName: action.payload.fName,
        lName: action.payload.lName,
        phone: action.payload.phone,
        email: action.payload.email,
        gender: action.payload.gender,
        firmName: action.payload.firmName,
        sector: action.payload.sector,
        designation: action.payload.designation,
        role: action.payload.role,
        avatar: action.payload.avatar,
        panNumber: action.payload.panNumber,
        bankName: action.payload.bankName,
        accountNumber: action.payload.accountNumber,
        ifsc: action.payload.ifsc,
      };
      state.userData = userData;
    },

    updateUserData: (state, action) => {
      const userData = { ...state.userData, ...action.payload };
      state.userData = userData;
    },

    // Employee Data
    createEmployeeData: (state, action) => {
      const newEmployee = action.payload;
      state.employeeData.push(newEmployee);
    },

    fetchEmployeeData: (state, action) => {
      // console.log(action.payload);
      state.employeeData = action.payload;
    },

    updateEmployeeData: (state, action) => {
      console.log(action.payload);
      state.employeeData = state.employeeData.map((e) => {
        return action.payload._id === e._id ? { ...e, ...action.payload } : e;
      });
    },

    // Lead Data
    fetchLeadData: (state, action) => {
      state.leadData = action.payload;
    },

    addNewLeadData: (state, action) => {
      const newLead = action.payload;
      state.leadData.push(newLead);
    },

    updateLeadData: (state, action) => {
      console.log(action);
      state.leadData = state.leadData.map((e) => {
        return action.payload._id === e._id ? { ...e, ...action.payload } : e;
      });
    },

    deleteLeadData: (state, action) => {
      state.leadData = state.leadData.filter((e) => e._id !== action.payload);
    },

    // Account Data
    fetchAccountData: (state, action) => {
      state.accountData = action.payload;
    },

    updateAccountData: (state, action) => {
      state.accountData = state.accountData.map((e) =>
        action.payload._id === e._id ? { ...e, ...action.payload } : e,
      );
    },

    deleteAccountData: (state, action) => {
      state.accountData = state.accountData.filter(
        (e) => e._id !== action.payload,
      );
    },
  },
});

export const {
  isUserLoggedIn,
  isLoadingCheck,
  fetchUserData,
  updateUserData,
  fetchEmployeeData,
  updateEmployeeData,
  createEmployeeData,
  fetchLeadData,
  addNewLeadData,
  updateLeadData,
  deleteLeadData,
  fetchAccountData,
  updateAccountData,
  deleteAccountData,
} = userDataSlice.actions;

export default userDataSlice.reducer;
