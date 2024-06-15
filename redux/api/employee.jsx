"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../utils/common";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addEmp: builder.mutation({
      query: (data) => ({ url: `/addEmployee`, method: "POST", body: data }),
    }),

    listEmp: builder.query({
      query: (data) => ({
        url: `/EmployeeList/?page=${data.page}&pageSize=${data.pageSize}&search_text=${data.search_text}&dept=${data.dept}&salary=${data.salary}`,
        method: "GET",
      }),
    }),

    deleteEmp: builder.mutation({
      query: (data) => ({ url: `/delEmployee?id=${data.id}`, method: "DELETE" }),  
    }),

    updateEmp: builder.mutation({
      query: (data) => ({ url: `/EmployeeUpdate`, method: "PUT", body: data }),
    }),
    
    EmpbyId: builder.mutation({
      query: (data) => ({ url: `/findByIdEmployee?id=${data.id}`, method: "GET"})
    }),

    salaryList: builder.mutation({
      query: () => ({ url: `/getSalary`, method: "GET"})
    }),

  }),
});

const useAddEmp= employeeApi.endpoints.addEmp.useMutation;
const useListEmp = employeeApi.endpoints.listEmp.useQuery;
const useDeleteEmp = employeeApi.endpoints.deleteEmp.useMutation;
const useFindbyId = employeeApi.endpoints.EmpbyId.useMutation;
const useUpdateEmp = employeeApi.endpoints.updateEmp.useMutation;
const useSalaryList = employeeApi.endpoints.salaryList.useMutation;


export { useAddEmp, useListEmp, useDeleteEmp,useFindbyId,useUpdateEmp,useSalaryList};
