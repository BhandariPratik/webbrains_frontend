"use client";
import React, { useState, useEffect, useDeferredValue, useRef } from "react";
import Image from "next/image";
import searchIcon from "../../public/search.svg";
import Pagination from "@mui/material/Pagination";
import DeleteModal from "@/components/DeleteModal";
import { TextField, Autocomplete } from "@mui/material";
import withAuth from "@/components/withAuth";
import crossIcon from "../../public/x-circle.svg";
import Link from "next/link";
import pencilIcon from "../../public/pencil.svg";
import trashIcon from "../../public/trash.svg";
import { useListEmp, useDeleteEmp, useSalaryList } from "@/redux/api/employee";
import { useListDept, usedeptDropdown } from "@/redux/api/department";
import moment from "moment";

const Employee = () => {
  const [page, setpage] = useState(1);
  const [searchVal, setSearchval] = useState("");
  const [deleterecord, setdeleteRecord] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const deferredValue = useDeferredValue(searchVal);
  const ref = useRef(false)
  const [deptList, setDeptList] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [salList, setsalList] = useState([]);
  const [selectedSal, setSelectedSal] = useState(null);


  let reqdata = {
    page: page,
    pageSize: 5,
    search_text: deferredValue,
    dept: selectedDept ? selectedDept.value : '',
    salary: selectedSal ? selectedSal.value : ''
  }

  const { data, isLoading, isSuccess, refetch } = useListEmp(reqdata);
  const [dropdown] = usedeptDropdown();
  const [deleteResource] = useDeleteEmp();
  const [salaryList] = useSalaryList();

  useEffect(() => {
    refetch();
  }, [searchVal]);

  useEffect(() => {
    if (ref.current == false) {
      handleDeptList();
      handlesalaryList();
    }
    ref.current = true
  }, [])

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

  const handleDeptList = async () => {
    let res = await dropdown();
    if (res?.data) {
      const data = await res?.data?.data?.map((para) => ({
        label: para.department,
        value: para.department,
      }));
      await setDeptList(data)
    }
  }

  const handlesalaryList = async () => {
    let res = await salaryList();
    if (res?.data) {
      const data = await res?.data?.salary.map((para) => ({
        label: para.salary,
        value: para.salary,
      }));
      await setsalList(data)
    }
  }

  return (
    <>

      <>
        {deleterecord && (
          <DeleteModal
            setDeleteModal={() => (setdeleteRecord(false), setDeleteId(""))}
            deleteUser={handleDelete}
          />
        )}

        <div className='p-3'>
          <div className="flex flex-col md:flex-row items-center justify-between p-2 ">
            <div className='font-bold text-2xl '>Employee Management</div>

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
              <Link href={"/addEditEmp"} className='bg-pink-600 px-2 py-2 rounded text-white hover:bg-pink-400 no-underline'>
                Add Employee
              </Link>
            </div>
          </div>


          <div className='rounded pt-3 flex items-center justify-between'>
            <div className=' flex items-center gap-3 pr-3'>
              <span className='whitespace-nowrap'>Filter By</span>
              <Autocomplete
                getOptionLabel={(option) =>
                  option.label != undefined ? String(option.label) : ""
                }
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option?.id}>
                      {option.label}
                    </li>
                  );
                }}
                disablePortal
                id="combo-box-demo"
                options={deptList ? deptList : []}
                renderInput={(params) => (
                  <TextField {...params} label="Department" />
                )}
                className="w-[160px] !min-w-0"
                value={selectedDept}
                onChange={(val, para) => (setSelectedDept(para), setpage(1))}
              />

              <Autocomplete
                getOptionLabel={(option) =>
                  option.label != undefined ? String(option.label) : ""
                }
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option?.id}>
                      {option.label}
                    </li>
                  );
                }}
                disablePortal
                id="combo-box-demo"
                options={salList ? salList : []}
                renderInput={(params) => (
                  <TextField {...params} label="Salary" />
                )}
                className="w-[130px] !min-w-0"
                value={selectedSal}
                onChange={(val, para) => (
                  setSelectedSal(para), setpage(1)
                )}
              />
            </div>
          </div>

          <div className="mt-6 ">
            <table className='border-2 border-gray-300 w-full shadow'>
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left py-2 p-1 text-sm"> Id</th>
                  <th className="text-left text-sm "> FullName</th>
                  <th className="text-left text-sm"> Email</th>
                  <th className="text-left text-sm"> Image</th>
                  <th className="text-left text-sm"> Address</th>
                  <th className="text-left text-sm"> City</th>
                  <th className="text-left text-sm"> Country</th>
                  <th className="text-left text-sm"> Department</th>
                  <th className="text-left text-sm"> Salary</th>
                  <th className="text-left text-sm"> State</th>
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
                        {`${para?.firstname} ${para.lastname}`}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.email}`}
                      </td>

                      <td className="text-left text-sm">
                        {para?.image  ?
                          <img
                            src={`${para?.image}`}
                            alt="image"
                            className="mx-1 w-7 h-7 rounded-sm"
                          /> : '--'}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.address1} ${para.address2}`}
                      </td>

                      <td className="text-left text-sm">
                        {para?.city}
                      </td>

                      <td className="text-left text-sm">
                        {para?.country}
                      </td>

                      <td className="text-left text-sm">
                        {para?.department}
                      </td>

                      <td className="text-left text-sm">
                        {para?.salary}
                      </td>

                      <td className="text-left text-sm">
                        {para?.state}
                      </td>

                      <td className="text-left text-sm">
                        {moment(para?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                      </td>

                      <td className="flex justify-center pt-2">
                        <Link
                          href={`/addEditEmp?Id=${para._id}`}
                        >
                          <Image
                            src={pencilIcon}
                            alt="edit"
                            className=" mx-1 cursor-pointer inline-block"
                            width={20}
                            height={20}
                          />
                        </Link>
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
                onChange={(e, value) => {setpage(value);
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
export default withAuth(Employee);
