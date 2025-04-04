import Toast from "./Toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import { useAuth } from "./AuthContext";

interface FormValues {
  username: string;
  email: string;
  confirmPassword: string;
  password: string;
}

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function SignUp() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = (values: FormValues): { [key: string]: string } => {
    let errors: { [key: string]: string } = {};

    if (!values.username) {
      errors.username = "Username is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is not valid";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = values;
  
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Update Firebase user profile with username
        await updateProfile(user, { displayName: username });
  
        console.log("Signup successful:", values);
  
        setErrors({
          username: "",
          email: "",
          confirmPassword: "",
          password: "",
        });
        setValues({
          username: "",
          email: "",
          confirmPassword: "",
          password: "",
        });
  
        setToast({ message: "User created successfully!", type: "success" });
  
        setTimeout(() => {
          navigate("/signin"); // Navigate to Sign In page
        }, 2000);
      } catch (error: any) {
        setToast({ message: error.message, type: "error" });
      }
    }
  };

  const closeToast = () => {
    console.log("Closing toast");
    setToast({ message: "", type: "" });
  };
  return (
    <div className=" bg-white h-screen w-full">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="flex items-center w-full justify-center gap-2 pb-5">
            <img src="./H3.png" alt="" className="w-8" />
            <span className="text-3xl tracking-[.25em] font-light">HIWMA</span>
          </h1>
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>
        {toast.message || toast.type ? (
          <Toast
            message={toast.message || ""}
            type={toast.type || ""}
            onClose={closeToast}
            timeout={3000}
          />
        ) : null}
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
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Username
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {errors.username}
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  onChange={handleChange}
                  value={values.username}
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
                  htmlFor="confirmPassword"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {" "}
                  {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                </label>
              </div>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  value={values.confirmPassword}
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
