'use client';
import React, { useEffect, useState, useRef } from 'react';
import Joi from 'joi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAddEmp, useFindbyId, useUpdateEmp } from '@/redux/api/employee';
import withAuth from '@/components/withAuth';
import { Autocomplete, TextField } from '@mui/material';
import { usedeptDropdown } from '@/redux/api/department';

const AddEditEMP = () => {
    const { push } = useRouter();
    const useSearch = useSearchParams();
    let Id = useSearch.get('Id');
    const [createEmp] = useAddEmp();
    const [updateEmp] = useUpdateEmp();
    const [empData] = useFindbyId();
    const [dropdown] = usedeptDropdown();
    const status = useRef(true)
    const [viewImg, setViewImg] = useState(null);
    const [deptList, setDeptList] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        image: null,
        address1: '',
        address2: '',
        country: '',
        state: '',
        city: '',
        department: '',
        salary: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status.current) {
            handleSetEmpData();
            handleDeptList();
        }
        status.current = false
    }, [])

    const handleSetEmpData = (async () => {
        if (Id) {
            const res = await empData({ id: Id })
            setFormData({
                firstName: res?.data?.data?.firstname,
                lastName: res?.data?.data?.lastname,
                email: res?.data?.data?.email,
                image: res?.data?.data?.image,
                address1: res?.data?.data?.address1,
                address2: res?.data?.data?.address2,
                country: res?.data?.data?.country,
                state: res?.data?.data?.state,
                city: res?.data?.data?.city,
                salary: res?.data?.data?.salary,
            })
            setSelectedDept({ value: res?.data?.data?.department, label: res?.data?.data?.department })
        }
    })

    const schema = Joi.object({
        firstName: Joi.string().required().messages({
            'string.empty': 'First name is required',
        }),
        lastName: Joi.string().required().messages({
            'string.empty': 'Last name is required',
        }),
        image: Joi.any().optional(),
        address2: Joi.any().optional(),
        address1: Joi.string().required().messages({
            'string.empty': 'Address 1 is required',
        }),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
        }),
        country: Joi.string().required().messages({
            'string.empty': 'Country is required',
        }),
        state: Joi.string().required().messages({
            'string.empty': 'State is required',
        }),
        city: Joi.string().required().messages({
            'string.empty': 'City is required',
        }),
        department: Joi.string().required().messages({
            'string.empty': 'Department is required',
        }),
        salary: Joi.number().required().messages({
            'number.base': 'Salary must be a number',
            'number.empty': 'Salary is required',
        }),
    });

    const validate = () => {
        const { error } = schema.validate({ ...formData, department: selectedDept == null ? '' : selectedDept.value },
            { abortEarly: false });
        if (!error) return null;
        const newErrors = {};
        error.details.forEach((item) => {
            newErrors[item.path[0]] = item.message;
        });
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value,
        });


    };

    const handleChangeImage = async (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData, ['image']: file,
        });
        await setViewImg(URL.createObjectURL(file))
    }

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

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            let newdata = new FormData();
            newdata.append('image', formData.image);
            newdata.append('firstname', formData.firstName);
            newdata.append('lastname', formData.lastName);
            newdata.append('email', formData.email);
            newdata.append('address1', formData.address1);
            newdata.append('address2', formData.address2);
            newdata.append('country', formData.country);
            newdata.append('state', formData.state);
            newdata.append('city', formData.city);
            newdata.append('department', selectedDept?.value);
            newdata.append('salary', formData.salary);
            if (Id) {
                newdata.append('id', Id);
            }
            let res;
            if (Id) {
                res = await updateEmp(newdata)
            }
            else {
                res = await createEmp(newdata);
            }
            if (res?.data) {
                alert(res?.data?.message);
                push('/employee');
            } else {
                alert(res.error.data.message);
            }
        } catch (error) {
            console.error('error', error);
        }
    };


    return (
        <div className="p-3">
            <div className="flex flex-col md:flex-row items-center justify-between p-2">
                <div className="font-bold text-2xl">{Id ? 'Edit ' : 'Add '}Employee </div>
            </div>
            <div className="p-1">
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            onChange={handleChange}
                            value={formData.firstName}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            onChange={handleChange}
                            value={formData.lastName}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
                            Email
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="email"
                            type="text"
                            placeholder="Email Id"
                            onChange={handleChange}
                            value={formData.email}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="image"
                            type="file"
                            onChange={(e) => handleChangeImage(e)}
                        />

                        {viewImg ?
                            <img src={viewImg} className='h-20 w-20' /> :
                            formData.image ?
                                <img src={formData.image} className='h-20 w-20' /> :
                                ''}

                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address1">
                            Address 1
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="address1"
                            type="text"
                            placeholder="Address 1"
                            onChange={handleChange}
                            value={formData.address1}
                        />
                        {errors.address1 && <p className="text-red-500 text-sm">{errors.address1}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address2">
                            Address 2
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="address2"
                            type="text"
                            placeholder="Address 2"
                            onChange={handleChange}
                            value={formData.address2}

                        />

                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                            Country
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="country"
                            type="text"
                            placeholder="Country"
                            onChange={handleChange}
                            value={formData.country}
                        />
                        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                            State
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="state"
                            type="text"
                            placeholder="State"
                            onChange={handleChange}
                            value={formData.state}
                        />
                        {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                            City
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="city"
                            type="text"
                            placeholder="City"
                            onChange={handleChange}
                            value={formData.city}
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>
                    <div className='mt-4'>
                        {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                            Department
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="department"
                            type="text"
                            placeholder="Department"
                            onChange={handleChange}
                            value={formData.department}
                        /> */}

                        <Autocomplete
                            disablePortal
                            id="department"
                            renderInput={(params) => <TextField name='department' {...params} label="Department" />}
                            className="h-[48px]"
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option?.id}>
                                        {option.label}
                                    </li>
                                );
                            }}
                            getOptionLabel={(option) => option.value != undefined ? option?.value : ""}
                            onChange={(val, para) => (setSelectedDept(para))}
                            options={deptList ? deptList : []}
                            value={selectedDept == null ? [] : selectedDept}

                        />


                        {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
                            Salary
                        </label>
                        <input
                            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight "
                            name="salary"
                            type="number"
                            placeholder="Salary"
                            onChange={handleChange}
                            value={formData.salary}
                        />
                        {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
                    </div>
                </div>
            </div>
            <div className='text-center my-2'>
                <button type='button' onClick={handleSubmit} className=" cursor-pointer bg-pink-700 text-center hover:bg-pink-400  text-white py-2 px-4 rounded ">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default withAuth(AddEditEMP);
