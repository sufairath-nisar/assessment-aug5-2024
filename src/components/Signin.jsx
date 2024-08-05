import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup
      .string()
      .min(7, 'Password must be at least 7 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9].*[0-9]/, 'Password must contain at least two numbers')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
  })
  .required();

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      // setApiError(""); 
      // const response = await fetch("/api/sign-in", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email: data.email }),
      // });

      setApiError(""); 
      const response = await axios.post(
        "/api/v1/clients/signin",
        { username: data.username, password: data.password },
        { withCredentials: true }
      );
  

      const result = await response.json();

      if (result.exists) {
        setApiError("This name is used.Please use another name");
      } else {
        console.log(data); 
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setApiError("An error occurred. Please try again.");
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="flex flex-col place-content-center items-center h-screen relative overflow-hidden section-main">
      <div className="absolute lg:-top-32 lg:-right-10 lg:w-4/12 w-1/2 -top-16 -right-5 md:-top-32 md:-right-10">
        <img
          src="/images/top_background_corner.png"
          alt="Top Background Corner"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute lg:-bottom-24 lg:-left-10 -bottom-10 -left-2 lg:w-2/6 w-1/2 lg:h-96 md:-bottom-16 md:-left-5">
        <img
          src="/images/bottom-background-corner.png"
          alt="Bottom Background Corner"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="mb-4">
        <img src="/images/smn_logo.png" alt="logo" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 rounded-md p-6 md:w-1/4">
        <p className="text-sm font-extrabold text-slate-900 text-center mb-3">Sign in</p>
        <input
          {...register("username")}
           placeholder="User name or Phone number"
          className="block w-full mb-1 border rounded-md border-gray-300 px-2 py-1.5 text-sm  focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
        />
       {errors.username && (<p className="text-red-600 text-sm"> {capitalizeFirstLetter(errors.username.message)}</p>)}

        {apiError && <p className="text-red-600 text-sm">{apiError}</p>}
        <div className="relative w-full">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
          />
           <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            {...register("keepMeSignedIn")}
            id="keepMeSignedIn"
            className="hidden peer"
          />
          <label
            htmlFor="keepMeSignedIn"
            className="flex items-center cursor-pointer relative w-3 h-3 bg-white border border-gray-600 rounded-full peer-checked:bg-gray-700 peer-checked:border-gray-700 peer-checked:ring-2 peer-checked:ring-gray-700 peer-checked:ring-offset-2"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="block h-2 w-2 bg-gray-600 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></span>
            </span>
          </label>
          <span className="font-medium ml-2 block text-sm text-slate-900">Keep me signed in</span>
        </div>
        <Button type="submit" text="Sign in" className="w-full py-2 mt-4 font-semibold" />
        <p className="text-center mt-5">
          <Link to="/forgot-password" className="font-medium text-slate-900 text-sm">
            I forgot my password
          </Link>
        </p>
      </form>
    </div>
  );
}
