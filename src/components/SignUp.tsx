import React, { useState } from "react";
interface FormValues {
  fname: string;
  lname: string;
  email: string;
  confirmPass: string;
  password: string;
}

type FormErrors = {
  fname?: string;
  lname?: string;
  email?: string;
  password?: string;
  confirmPass?: string;
};
function SignUp() {
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    confirmPass: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = (values: FormValues): { [key: string]: string } => {
    let errors: { [key: string]: string } = {};

    // Required field check
    if (!values.fname) {
      errors.fname = "First Name is required";
    }

    if (!values.lname) {
      errors.lname = "Last Name is required";
    }

    // Email validation
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is not valid";
    }
    
    if (!values.confirmPass) {
      errors.confirmPass = "Confirm Password is required";
    } else if (values.confirmPass !== values.password) {
      errors.confirmPass = "Passwords do not match";
    }

    // Password validation
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

   

    return errors;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // console.log("Form submitted successfully!", values);
      alert("Sign Up successfully!");

    }
  };
  return (
    <div className=" bg-white h-screen w-full">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="flex items-center w-full justify-center gap-2 pb-5">
                <img src="./H3.png" alt="" className="w-8" />

                <span className="text-3xl tracking-[.25em] font-light">
                  HIWMA
                </span>
              </h1>
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="/"
            method="POST"
            className="space-y-3"
            noValidate
            onSubmit={handleSubmit}
          >
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fname"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  First Name
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {errors.fname}
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="fname"
                  name="fname"
                  type="text"
                  required
                  onChange={handleChange}
                  value={values.fname}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="lname"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Last Name
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {errors.lname}
                </label>
              </div>

              <div className="mt-1">
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  onChange={handleChange}
                  required
                  value={values.lname}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {errors.email}
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {" "}
                  {errors.password && <p>{errors.password}</p>}
                </label>
              </div>

              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  value={values.password}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPass"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {" "}
                  {errors.confirmPass && <p>{errors.confirmPass}</p>}
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="confirmPass"
                  name="confirmPass"
                  type="password"
                  onChange={handleChange}
                  value={values.confirmPass}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="mt-1.5 flex justify-center w-full">
              <button
                type="submit"
                className="bg-blue-500 cursor-pointer text-white px-8 py-2 mt-5 rounded-md shadow-md hover:bg-blue-600"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
