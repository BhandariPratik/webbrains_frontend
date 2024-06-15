"use client";
import { useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import Joi from "joi";
import { getAuth } from "@/redux/api/auth";

function Login() {
  const { push } = useNextRouter();
  const [loginUser] = getAuth();

  const [login, setLogin] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleOnChange = (event) => {
    setLogin({ ...login, [event.target.name]: event.target.value });
  };

  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    })
  });


  const validate = () => {
    const { error } = schema.validate(login, { abortEarly: false });
    if (!error) return null;
    const newErrors = {};
    error.details.forEach(item => {
      newErrors[item.path[0]] = item.message;
    });
    return newErrors;
  };

  const handleOnClick = async () => {
    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      let reqData = {
        'email': login.email,
        'password': login.password
      }

      let res = await loginUser(reqData);
      if (res?.data) {
        localStorage.setItem("token", res?.data?.token);
        push("/dashboard");
        alert(res?.data?.message)
      }
      else {
        alert(res?.error?.data?.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-gray-300  flex flex-col h-screen items-center justify-center">
        <p className="items-center  text-4xl text-pink-700 font-extrabold pb-10">Employee Management System</p>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <form className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleOnChange}
                value={login.email}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleOnChange}
                value={login.password}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="text-center">
              <button
                className=" bg-pink-700 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded "
                type="button"
                onClick={handleOnClick}
              >
                Login
              </button>

            </div>
          </form>
        </div>

      </div>

    </>
  );
}

export default Login;
