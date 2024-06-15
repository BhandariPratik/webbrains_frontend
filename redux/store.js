"use client"
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { employeeApi } from "./api/employee";
import { departmentApi } from "./api/department";
import { rootReducers } from "./rootReducer";
import { authApi } from "./api/auth";

export const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeeApi.middleware, authApi.middleware,departmentApi.middleware)
  
});

setupListeners(store.dispatch);
