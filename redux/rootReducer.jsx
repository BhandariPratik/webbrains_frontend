"use client"
import { employeeApi } from "./api/employee";
import { authApi } from "./api/auth";
import { departmentApi } from "./api/department";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [departmentApi.reducerPath]:departmentApi.reducer
});
