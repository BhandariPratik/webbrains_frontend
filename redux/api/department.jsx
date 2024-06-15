"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../utils/common";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
   
    addEditDept: builder.mutation({
      query: (data) => ({ url: `/addEditDept`, method: "POST", body: data }),
    }),

    listDept: builder.query({
      query: (data) => ({
        url: `/listDept/?page=${data.page}&pageSize=${data.pageSize}&search_text=${data.search_text}`,
        method: "GET",
      }),
    }),

    deleteDept: builder.mutation({
      query: (data) => ({ url: `/deleteDept?id=${data.id}`, method: "DELETE" }),  
    }),

    deptDropdown: builder.mutation({
      query: () => ({ url: `/deptDropdown`, method: "GET" }),
    }),

    empGraph: builder.query({
      query: () => ({ url: `/empGraph`, method: "GET" }),
    }),

  }),
});

const useAddeditdept= departmentApi.endpoints.addEditDept.useMutation;
const useListDept = departmentApi.endpoints.listDept.useQuery;
const useDeleteDept = departmentApi.endpoints.deleteDept.useMutation;
const usedeptDropdown=departmentApi.endpoints.deptDropdown.useMutation;
const useempGraph =departmentApi.endpoints.empGraph.useQuery;

export {usedeptDropdown, useAddeditdept, useListDept, useDeleteDept,useempGraph};
