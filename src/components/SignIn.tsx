import Toast from "./Toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 
import { useAuth } from "./AuthContext";

type FormErrors = {
  email?: string;
  password?: string;
};

interface FormValues {
  email: string;
  password: string;
}
function SignIn() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        setErrors({ email: "", password: "" });
        setValues({ email: "", password: "" });
        login();
        setToast({ message: "Successfully Login!", type: "success" });
        setTimeout(() => {
          navigate("/"); 
        }, 2000); 
      } catch (error: any) {
        if (error.code === "auth/user-not-found") {
          setToast({
            message: "No user found with this email.",
            type: "error",
          });
        } else if (error.code === "auth/wrong-password") {
          setToast({ message: "Incorrect password.", type: "error" });
        } else {
          setToast({
            message: "Failed to sign in. Please try again.",
            type: "error",
          });
        }
        console.error("Error signing in:", error.message);
      }
    }
  };

  const validateForm = (values: FormValues): { [key: string]: string } => {
    let errors: { [key: string]: string } = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is not valid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const closeToast = () => {
    console.log("Closing toast");
    setToast({ message: "", type: "" });
  };

  return (
    <div className="bg-white h-screen w-full">
      {" "}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="flex items-center w-full justify-center gap-2 pb-5">
            <img src="./H3.png" alt="" className="w-8" />

            <span className="text-3xl tracking-[.25em] font-light">HIWMA</span>
          </h1>
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in
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
            className="space-y-6"
            noValidate
            onSubmit={handleSubmit}
          >
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <label className="block text-sm/6 font-medium text-red-500">
                  {errors.email && <p>{errors.email}</p>}
                </label>
              </div>

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={handleChange}
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
                  {errors.password && <p>{errors.password}</p>}
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={values.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="flex w-full justify-center">
              <button
                type="submit"
                className="bg-blue-500 cursor-pointer text-white px-8 py-2 mt-5 rounded-md shadow-md hover:bg-blue-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
