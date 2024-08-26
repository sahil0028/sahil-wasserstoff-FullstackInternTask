import React, { useState } from "react";
import { useForm } from 'react-hook-form';
// import apiServices from "../apis/apiServices";
import { Link, useNavigate } from "react-router-dom";
import apiServices from "../apis/apiServices";
import { toast } from "react-toastify";
// import apiServices from "../apis/apiServices";

const Signup = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const nav =useNavigate()
    const [loading,setLoading] = useState(false)

    const handleLogin=(data)=>{
        setLoading(true)
        console.log(data)
        apiServices.register(data).then((res)=>{
            // console.log('signup sucess',res.data.data)
            toast.success('Signup sucessful')
            nav('/login')
        })
        .catch((err)=>{
          console.log('signup err-',err.response.data.message)
          toast.error(err.response.data.message)
          console.log(err)
        }).finally(()=>{
            setLoading(false)
        })
    }

  return (
    <section className=" bg-sky-100/50 h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center px-6 shadow-xl  py-8 mx-auto lg:py-0 w-1/2 md:w-full">
        
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Create a new account
            </h1>
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 md:space-y-6">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 "
                  htmlFor="name"
                >
                  Your Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  id="name"
                  name="name"
                  placeholder="Xyz"
                  type="text"
                  {...register('name', { required: true })}
                />
                {errors.name && <p className=" text-red-600">Name is required.</p>}
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 "
                  htmlFor="email"
                >
                  Your email
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  type="email"
                  {...register('email', { required: true })}
                />
                {errors.email && <p className=" text-red-600">Email is required.</p>}
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 "
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  {...register('password', { required: true })}
                />{errors.password && <p className=" text-red-600">Password is required.</p>}
              </div>
              <div className="flex items-center justify-between">
              </div>
              <button
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="submit"
                disabled={loading}
              >
                {
                    loading? <div className=" h-5 w-full">
                    <svg version="1.1" className="h-full mx-auto scale-[2]" id="L5" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                      viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
                      <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
                        <animateTransform 
                           attributeName="transform" 
                           dur="1s" 
                           type="translate" 
                           values="0 15 ; 0 -15; 0 15" 
                           repeatCount="indefinite" 
                           begin="0.1"/>
                      </circle>
                      <circle fill="#fff" stroke="none" cx="30" cy="50" r="6">
                        <animateTransform 
                           attributeName="transform" 
                           dur="1s" 
                           type="translate" 
                           values="0 10 ; 0 -10; 0 10" 
                           repeatCount="indefinite" 
                           begin="0.2"/>
                      </circle>
                      <circle fill="#fff" stroke="none" cx="54" cy="50" r="6">
                        <animateTransform 
                           attributeName="transform" 
                           dur="1s" 
                           type="translate" 
                           values="0 5 ; 0 -5; 0 5" 
                           repeatCount="indefinite" 
                           begin="0.3"/>
                      </circle>
                    </svg></div>: <div>Sign Up</div>
                }
                {/* Sign in */}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to={'/login'} className="font-medium text-blue-500 hover:underline dark:text-primary-500">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup