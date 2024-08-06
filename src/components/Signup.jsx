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
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, 'Phone number must be a number')
      .required('Phone number is required'),
    kitchenName: yup.string().required('Kitchen name is required'),
    password: yup
      .string()
      .min(7, 'Password must be at least 7 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9].*[0-9]/, 'Password must contain at least two numbers')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    acceptOurTerms: yup.boolean().oneOf([true], 'Please accept our terms')
  })
  .required();

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const [apiError, setApiError] = useState("");
  const [isEmailVisible, setIsEmailVisible] = useState(true);

  const emailValue = watch("email", "");

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const checkNameResponse = await axios.get(`/api/v1/clients/details/${data.firstName}`);

      if (checkNameResponse.data.exists) {
        setApiError("This username is used, please use another name.");
      } else {
        const response = await axios.post("/api/v1/clients/signup", data, { withCredentials: true });
        const result = response.data;
        if (result.exists) {
          setApiError("This username is already used. Please choose another.");
        } else {
          console.log(data);
        }
      }
    } 
    catch (error) {
      console.error("Error during signup:", error);
      setApiError("An error occurred. Please try again.");
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleEmailVisibility = () => {
    setIsEmailVisible(!isEmailVisible);
  };

  return (
    <div className="flex flex-col place-content-center items-center h-screen  relative overflow-hidden section-main">
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 rounded-md p-6 w-11/12 md:w-2/3 lg:w-1/2 place-items-center">
        <p className="text-sm font-extrabold text-slate-900 text-center mb-3">Sign up</p>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4 w-full">
          <div className="flex flex-col">
            <input
              {...register("firstName")}
              placeholder="First Name"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            {errors.firstName && <p className="text-red-600 text-sm">{capitalizeFirstLetter(errors.firstName.message)}</p>}
            {apiError && <p className="text-red-600 text-sm mb-4">{apiError}</p>}
          </div>

          <div className="flex flex-col">
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            {errors.lastName && <p className="text-red-600 text-sm">{capitalizeFirstLetter(errors.lastName.message)}</p>}
          </div>

          <div className="relative flex flex-col">
            <input
              {...register("email")}
              type={isEmailVisible ? "email" : "text"}
              value={isEmailVisible ? emailValue.replace(/./g, "*") : emailValue}
              onChange={(e) => register("email").onChange(e)}
              placeholder="Email"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            <button
              type="button"
              onClick={toggleEmailVisibility}
              className="absolute pt-2 right-0 flex items-center pr-3 text-gray-500"
            >
              <FontAwesomeIcon icon={isEmailVisible ? faEye : faEyeSlash} />
            </button>
            {errors.email && <p className="text-red-600 text-sm">{capitalizeFirstLetter(errors.email.message)}</p>}
          </div>

          <div className="flex flex-col">
            <input
              {...register("phoneNumber")}
              placeholder="Phone Number"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            {errors.phoneNumber && <p className="text-red-600 text-sm">{capitalizeFirstLetter(errors.phoneNumber.message)}</p>}
          </div>

          <div className="flex flex-col">
            <input
              {...register("kitchenName")}
              placeholder="Your Kitchen Name"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            {errors.kitchenName && <p className="text-red-600 text-sm">{capitalizeFirstLetter(errors.kitchenName.message)}</p>}
          </div>

          <div className="flex flex-col">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="block w-full border rounded-md border-gray-300 px-2 py-1.5 text-sm focus:ring-gray-600 focus:border-gray-600 focus:outline-none focus:ring-1 bg-white"
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex flex-col items-start mt-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("acceptOurTerms")}
                id="acceptOurTerms"
                className="hidden peer"
              />
              <label
                htmlFor="acceptOurTerms"
                className="flex items-center cursor-pointer relative w-3 h-3 bg-white border border-gray-600 rounded-full peer-checked:bg-gray-700 peer-checked:border-gray-700 peer-checked:ring-2 peer-checked:ring-gray-700 peer-checked:ring-offset-2"
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="block h-2 w-2 bg-gray-600 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></span>
                </span>
              </label>
              <span className="font-medium ml-2 block text-sm text-slate-900">Accept our terms</span>
            </div>
            {errors.acceptOurTerms && (
              <p className="text-red-600 text-sm mt-1">{errors.acceptOurTerms.message}</p>
            )}
          </div>

        </div>
       
        <Button type="submit" text="Sign up" className="md:w-2/5 w-2/3 py-2 mt-4 font-semibold" />
      </form>
    </div>
  );
}
