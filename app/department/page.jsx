"use client";
import React, { useState, useEffect, useDeferredValue } from "react";
import Image from "next/image";
import searchIcon from "../../public/search.svg";
import Pagination from "@mui/material/Pagination";
import DeleteModal from "@/components/DeleteModal";
import withAuth from "@/components/withAuth";
import crossIcon from "../../public/x-circle.svg";
import pencilIcon from "../../public/pencil.svg";
import trashIcon from "../../public/trash.svg";
import moment from "moment";
import AddEditDept from "@/components/AddEditDept";
import { useListDept, useDeleteDept } from "@/redux/api/department";

const Department = () => {
  const [page, setpage] = useState(1);
  const [searchVal, setSearchval] = useState("");
  const [deleterecord, setdeleteRecord] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const deferredValue = useDeferredValue(searchVal);
  const [addEdit, setAddEdit] = useState(false);
  const [deptDetail, setDeptdetail] = useState(null);

  let reqdata = {
    page: page,
    pageSize: 5,
    search_text: deferredValue
  }

  const { data, isLoading, isSuccess, refetch } = useListDept(reqdata);
  const [deleteResource] = useDeleteDept();

  useEffect(() => {
    refetch();
  }, [searchVal]);


  const handleDelete = async () => {
    let deleteData = {
      id: deleteId,
    };
    try {
      let res = await deleteResource(deleteData);
      if (res) {
        setDeleteId("");
        refetch();
        alert(res?.data?.message)
      }
      else {
        alert(res.error.data.message)
      }
    } catch (error) {
      console.log(error)
    }
    setdeleteRecord(false);
  };

  return (
    <>
      <>
        {deleterecord && (
          <DeleteModal
            setDeleteModal={() => (setdeleteRecord(false), setDeleteId(""))}
            deleteUser={handleDelete}
          />
        )}

        {addEdit && (
          <AddEditDept onClose={() => (setAddEdit(false),setDeptdetail(null))} refetch={refetch} deptDetail={deptDetail} setDeptdetail={setDeptdetail} />
        )}

        <div className='p-3'>
          <div className="flex flex-col md:flex-row items-center justify-between p-2 ">
            <div className='font-bold text-2xl '>Department Management</div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
              <div className='p-2 rounded flex items-center border-black shadow '>
                <Image src={searchIcon} alt="search" />
                <input
                  onChange={(e) => (setSearchval(e.target.value), setpage(1))}
                  type="text"
                  value={searchVal}
                  className='w-full outline-none'
                  placeholder="Search here..."
                />
                {searchVal != "" && (
                  <Image
                    src={crossIcon}
                    onClick={() => setSearchval("")}
                    alt=""
                    className="mr-3 cursor-pointer"
                  />
                )}
              </div>
              <span onClick={() => setAddEdit(true)} className='cursor-pointer bg-pink-600 px-2 py-2 rounded text-white hover:bg-pink-400 no-underline'>
                Add Department
              </span>
            </div>
          </div>

          <div className="mt-6 ">
            <table className='border-2 border-gray-300 w-full shadow'>
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left py-2 p-1 text-sm"> Id</th>
                  <th className="text-left text-sm ">Department</th>
                  <th className="text-left text-sm ">Total Emp</th>
                  <th className="text-left text-sm"> Created On</th>
                  <th className="text-left text-sm"> Updated On</th>
                  <th className="text-center text-sm min-w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {isSuccess && data?.data?.length > 0 ? (
                  data?.data?.map((para, ind) => (
                    <tr
                      key={ind}
                      className="border-b border-b-1"
                    >
                      <td className="text-left text-sm py-2 px-1">
                        {ind + 1 + (page - 1) * 5}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.department}`}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.totalEmployees}`}
                      </td>



                      <td className="text-left text-sm">
                        {moment(para?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                      </td>

                      <td className="text-left text-sm">
                        {moment(para?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                      </td>

                      <td className="flex justify-center pt-2">

                        <Image
                          src={pencilIcon}
                          alt="edit"
                          className=" mx-1 cursor-pointer inline-block"
                          width={20}
                          height={20}
                          onClick={() => (setAddEdit(true), setDeptdetail(para))}
                        />

                        <Image
                          src={trashIcon}
                          alt="delete"
                          className="mx-1 cursor-pointer inline-block"
                          width={20}
                          height={20}
                          onClick={() => (
                            setdeleteRecord(true), setDeleteId(para?._id)
                          )}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="">
                    <td className={`text-center`} colSpan={18}>
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {data?.totalCount > 5 && (
            <div className='flex justify-end mt-2' >
              <Pagination
                count={Math.ceil(data?.totalCount / 5)}
                onChange={(e, value) => {
                  setpage(value);
                }}
                variant="outlined"
                shape="rounded"
              />
            </div>
          )}
        </div>
      </>

    </>
  );
};
export default withAuth(Department);
