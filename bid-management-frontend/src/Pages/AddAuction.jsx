import React, { useState } from "react";
import DashNav from "../components/DashNav";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiServices from "../apis/apiServices";
import { toast } from "react-toastify";

const AddAuction = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [imgFile, setImgFile] = useState("");
  const handleImgFile = (e) => {
    console.log(e.target.files[0]);
    setImgFile(e.target.files[0])
  };

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddAuc = (data) => {
    setLoading(true);
    // console.log(data);
    if(new Date(data.startTime)>new Date(data.endTime)){
      toast.error('start time should be less than end time')
      setLoading(false)
      return
    }
    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      setLoading(false)
      console.log('no userid in session storage');
      toast.error('Please login again to continue')
      nav('/login')
    }
    // const apiData = {
    //   usingId: sessionStorage.getItem('userId')
    // }

    console.log(data);
    const formData = new FormData();
    formData.append('auc_img',imgFile)
    formData.append('userId',sessionStorage.getItem('userId'))
    formData.append('usingId',sessionStorage.getItem('userId'))
    formData.append('endTime',data.endTime)
    formData.append('name',data.name)
    formData.append('startTime',data.startTime)
    formData.append('startingPrice',data.startingPrice)
    formData.append('title',data.title)
    formData.append('description',data.description)

    // data['userId'] = sessionStorage.getItem('userId')
    // data['usingId'] = sessionStorage.getItem('userId')
    apiServices.createAuction(formData).then((res) => {
      console.log('add auc sucess-',res.data);
      toast.success('Auction created successfully')
      reset()
    }).catch((err) => {
      console.log('add auc err-',err);
      toast.error(err.response.data.message)
    }).finally(() => {
      setLoading(false);
      reset()
    });
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset); // Adjust for timezone offset
    return now.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"
  };

  return (
    <>
      <DashNav />
      <div className="container min-h-[calc(100vh-115px)] bg-sky-50 pt-4">
        <div className="flex flex-col items-center justify-center px-6 shadow-xl  py-8 mx-auto lg:py-0 w-1/2 md:w-full">
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:w-screen xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Create a new Auction
              </h1>
              <form
                onSubmit={handleSubmit(handleAddAuc)}
                className="space-y-4 md:space-y-6"
              >
                {/* titile */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="title"
                  >
                    Auction Title
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    id="title"
                    name="title"
                    placeholder="Xyz"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  {errors.title && (
                    <p className=" text-red-600">Title is required.</p>
                  )}
                </div>
                <div className="name&price grid grid-cols-2 md:grid-cols-1 gap-2">
                  {/* name */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 "
                      htmlFor="name"
                    >
                      Item Name
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      id="name"
                      name="name"
                      placeholder="Xyz"
                      type="text"
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <p className=" text-red-600">Name is required.</p>
                    )}
                  </div>
                  {/* price */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 "
                      htmlFor="startingPrice"
                    >
                      Item startingPrice
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      id="startingPrice"
                      name="startingPrice"
                      placeholder="Xyz"
                      type="number"
                      {...register("startingPrice", { required: true })}
                    />
                    {errors.startingPrice && (
                      <p className=" text-red-600">
                        startingPrice is required.
                      </p>
                    )}
                  </div>
                </div>
                {/* image */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="img"
                  >
                    Item Image
                  </label>
                  <input
                    className="bg-gray-50 file:bg-transparent file:border-0 file:border-r-2 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    id="img"
                    name="img"
                    placeholder="Xyz"
                    type="file"
                    onChange={handleImgFile}
                    required
                    //   {...register('name', { required: true })}
                  />
                  {/* {errors.name && <p className=" text-red-600">Name is required.</p>} */}
                </div>
                {/* description */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="desc"
                  >
                    Item Description
                  </label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    id="desc"
                    name="desc"
                    placeholder="Xyz"
                    {...register("description", { required: true })}
                  ></textarea>
                  {/* <input
                  
                  type="text"
                  /> */}
                  {errors.description && (
                    <p className=" text-red-600">description is required.</p>
                  )}
                </div>
                <div className="timestamps grid grid-cols-2 md:grid-cols-1 gap-2">
                  {/* start time */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 "
                      htmlFor="birthdaytime"
                    >
                      Start date and time
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      id="birthdaytime"
                      name="birthdaytime"
                      type="datetime-local"
                      min={getCurrentDateTime()}
                      {...register("startTime", { required: true })}
                    />

                    {errors.startTime && (
                      <p className=" text-red-600">startTime is required.</p>
                    )}
                  </div>
                  {/* End time */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 "
                      htmlFor="birthdaytime"
                    >
                      End date and time
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      id="birthdaytime"
                      name="birthdaytime"
                      type="datetime-local"
                      min={getCurrentDateTime()}
                      {...register("endTime", { required: true })}
                    />

                    {errors.startTime && (
                      <p className=" text-red-600">endTime is required.</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between"></div>
                <button
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className=" h-5 w-full">
                      <svg
                        version="1.1"
                        className="h-full mx-auto scale-[2]"
                        id="L5"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 100 100"
                        enableBackground="new 0 0 0 0"
                        xmlSpace="preserve"
                      >
                        <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
                          <animateTransform
                            attributeName="transform"
                            dur="1s"
                            type="translate"
                            values="0 15 ; 0 -15; 0 15"
                            repeatCount="indefinite"
                            begin="0.1"
                          />
                        </circle>
                        <circle fill="#fff" stroke="none" cx="30" cy="50" r="6">
                          <animateTransform
                            attributeName="transform"
                            dur="1s"
                            type="translate"
                            values="0 10 ; 0 -10; 0 10"
                            repeatCount="indefinite"
                            begin="0.2"
                          />
                        </circle>
                        <circle fill="#fff" stroke="none" cx="54" cy="50" r="6">
                          <animateTransform
                            attributeName="transform"
                            dur="1s"
                            type="translate"
                            values="0 5 ; 0 -5; 0 5"
                            repeatCount="indefinite"
                            begin="0.3"
                          />
                        </circle>
                      </svg>
                    </div>
                  ) : (
                    <div>Add Auction</div>
                  )}
                  {/* Sign in */}
                </button>
                {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to={'/login'} className="font-medium text-blue-500 hover:underline dark:text-primary-500">Sign in</Link>
              </p> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAuction;
