import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiServices, { Base_url } from "../apis/apiServices";
import ModalOverlay from "../components/ModalOverlay";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import moment from 'moment';

const AuctionDetails = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDel, setDel] = useState(false);
  const [details, setDetails] = useState({});
  const param = useParams();
  const nav = useNavigate();
  const userData = {
    _id: sessionStorage.getItem("userId") || "",
    email: sessionStorage.getItem("email") || "",
    name: sessionStorage.getItem("name") || "",
  };

  const changeUpdateModel = (val) => {
    setShowUpdate(val);
  };
  const changeDelModel = (val) => {
    setDel(val);
  };

  const handleAdminHide = () => {
    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      console.log('no userid in session storage');
      toast.error("Please login again to continue");
      nav('/login')
    }
    const data = {
      usingId: sessionStorage.getItem('userId'),
      auctionId:param.id
    }
    apiServices.adminDelAuction(data).then((res) => {
      console.log('admin del auc',res.data);
      toast.success('Auction deleted successfully')
      nav('/admin')
    }).catch((err) => {
      toast.error(err.response.data.message)
      console.log('admin del auc err-',err);
    });
  };

  const getDate=(date)=>{
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
  }

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      sessionStorage.clear();
      console.log("no userid in session storage");
      toast.error("Please login again to continue");
      nav("/login");
    }
    const data = {
      usingId: sessionStorage.getItem("userId"),
      _id: param.id,
    };
    apiServices
      .getAuction(data)
      .then((res) => {
        console.log("auction detail-", res.data.data[0]);
        toast.success('Auction details fetched successfully')
        setDetails(res.data.data[0]);
        // setDetails(res.data.data)
      })
      .catch((err) => {
        toast.error(err.response.data.message)
        console.log("auction detail error", err);
      });
  }, [param.id]);
  return (
    <div className="container min-h-[calc(100vh-75px)] bg-sky-50 pt-4">
      <div className="title text-center text-4xl underline font-semibold">
        {details?.title}
      </div>
      <div className="hostedBy text-center text-lg text-gray-600 my-2">
        Hosted by-{details?.userId?.name}
      </div>
      
      <div
        className={`grid gap-3 ${
          details?.image ? "grid-cols-2" : "grid-cols-1"
        } lg:grid-cols-1  lg:divide-x-0`}
      >
        {details?.image && (
          <div className="img border-r-2 py-2">
            {" "}
            <img
              loading="lazy"
              className="mx-auto my-auto h-[50vh] w-auto"
              src={Base_url+details?.image}
              alt=""
            />{" "}
          </div>
        )}
        <div className="details my-auto ps-4 space-y-5">
          <div className="name text-center text-2xl">{details?.name}</div>
          <div className="desc text-justify">
            {details?.description}
          </div>
          <div className="timestamps flex justify-between">
            <div className="start">{getDate(details?.startTime)}</div>
            <div className="end">{getDate(details?.endTime)}</div>
          </div>
        </div>
      </div>
      <div className="options  flex justify-center align-middle gap-4 my-5">
        {Date.now() > new Date(details?.endTime) ? (
          <div className="bg-red-500 px-4 py-2 rounded-lg font-medium text-lg text-neutral-100">
            Auction Ended
          </div>
        ) : Date.now() < new Date(details?.endTime) &&
          Date.now() > new Date(details?.startTime) ? (
          <Link
            to={`/auctions/bid/${details._id}`}
            className="bg-green-500 px-4 py-2 rounded-lg font-medium text-lg text-neutral-100"
          >
            Watch
          </Link>
        ) : (
          <div className="bg-green-500 px-4 py-2 rounded-lg font-medium text-lg text-neutral-100">
            Wait till start time
          </div>
        )}
        {userData?.email === "admin@gmail.com" &&
          Date.now() < new Date(details?.endTime) && (
            <div
              onClick={handleAdminHide}
              className="bg-red-500 px-4 py-2 rounded-lg font-medium cursor-pointer text-lg text-neutral-100"
            >
              Hide Auction
            </div>
          )}
        {Date.now() < new Date(details?.startTime) &&
          details?.userId?.email == userData?.email && (
            <>
              {" "}
              <div
                onClick={() => setShowUpdate(true)}
                className="bg-green-500 cursor-pointer px-4 py-2 rounded-lg font-medium text-lg text-neutral-100"
              >
                Update Auction
              </div>
              {/* <div
                onClick={() => setDel(true)}
                className="bg-red-500 cursor-pointer px-4 py-2 rounded-lg font-medium text-lg text-neutral-100"
              >
                Delete Auction
              </div> */}
            </>
          )}
        { details?.userId?.email == userData?.email && (
            <>
              <div
                onClick={() => setDel(true)}
                className="bg-red-500 cursor-pointer px-4 py-2 rounded-lg font-medium text-lg text-neutral-100"
              >
                Delete Auction
              </div>
            </>
          )}
        {showUpdate && (
          <ModalOverlay
            Modelbody={UpdateAuc}
            data={details}
            changeModal={changeUpdateModel}
            title={"Update Auction"}
          />
        )}
        {showDel && (
          <ModalOverlay
            Modelbody={DelAuc}
            data={details}
            changeModal={changeDelModel}
            title={"Delete Auction"}
          />
        )}
      </div>
    </div>
  );
};

const UpdateAuc = (changeModal, data) => {
  // console.log("update auc", data);

  const [imgFile, setImgFile] = useState("");
  const handleImgFile = (e) => {
    console.log(e.target.files[0]);
    setImgFile(e.target.files[0])
  };

  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdate=(updata)=>{
    // console.log('update btn auc',updata)
    setLoading(true)
    if(new Date(updata.startTime)>new Date(updata.endTime)){
      toast.error('start time should be less than end time')
      setLoading(false)
      return
    }
    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      console.log('no userid in session storage');
      toast.error('Please Login First')
      setLoading(false)
      nav('/login')
    }
    const formData = new FormData();
    // console.log('aucid',data._id)
    formData.append('auc_img',imgFile)
    formData.append('userId',sessionStorage.getItem('userId'))
    formData.append('auctionId',data._id)
    formData.append('endTime',data.endTime)
    formData.append('name',data.name)
    formData.append('startTime',data.startTime)
    formData.append('startingPrice',data.startingPrice)
    formData.append('title',data.title)
    formData.append('description',data.description)

    apiServices.updateAuctions(formData).then((res) => {
      console.log('update auc sucess-',res.data);
      toast.success('Auction Updated Successfully')
      window.location.reload()
      reset()
    }).catch((err)=>{
      toast.error('Something went wrong')
      toast.error(err.response.data.message)
      console.log('update auc err-',err);
    }).finally(()=>{
      setLoading(false)
      changeModal(false)
    })

  }

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset); // Adjust for timezone offset
    return now.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"
  };
  const getCutDT = (dt) => {
    const now = new Date(dt);
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset); // Adjust for timezone offset
    return now.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"
  };

  return (
    <>
      {/* body */}
      <div className="relative p-6 flex-auto max-h-[80vh] overflow-auto my-auto text-left">
        <div className="flex flex-col items-center justify-center px-6 shadow-xl  py-8 mx-auto lg:py-0 w-full">
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:w-[80vw] xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form
                onSubmit={handleSubmit(handleUpdate)}
                className="space-y-4 md:space-y-6"
              >
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
                    defaultValue={data?.title}
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
                      defaultValue={data?.name}
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
                      defaultValue={data?.startingPrice}
                    >
                      Item startingPrice
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      id="startingPrice"
                      name="startingPrice"
                      placeholder="Xyz"
                      defaultValue={data?.startingPrice}
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
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="img"
                  >
                    Item Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImgFile}
                    // required
                    className="bg-gray-50 file:bg-transparent file:border-0 file:border-r-2 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    id="img"
                    name="img"
                    placeholder="Xyz"
                    // defaultValue={data?.image}
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
                    defaultValue={data?.description}
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
                <div className="grid grid-cols-2 gap-x-2">

                
                <button
                  className=" me-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  type="submit"
                  onClick={() => changeModal(false)}
                >
                  Close
                </button>
                <button
                  className=" text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                    <div>Update Auction</div>
                  )}
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*footer*/}
      {/* <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
        <button
          className="text-red-500 hover:bg-red-500 hover:text-neutral-300 background-transparent font-bold uppercase px-6 py-3 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => changeModal(false)}
        >
          Close
        </button>
        <button
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          // onClick={addTolist}
          // disabled={!addPlist ? true : false}
        >
          Update Auction
        </button>
      </div> */}
    </>
  );
};
const DelAuc = (changeModal, data) => {

  const nav =useNavigate()
  const handleDelAuc =()=>{
    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      console.log('no userid in session storage');
      toast.error('Please login first')
      nav('/login')
    }
    const axiosData = {
      usingId: sessionStorage.getItem('userId'),
      userId: sessionStorage.getItem('userId'),
      auctionId: data._id
    }
    apiServices.deleteAuction(axiosData).then((res) => {
      console.log('del auc sucess-',res.data);
      toast.success('Auction deleted successfully')
      nav('/dashboard/hosted')
      // reset()
    }).catch((err)=>{
      console.log('del auc err-',err);
      toast.error(err.response.data.message)
    }).finally(()=>{
      changeModal(false)
    })
  }

  return (
    <>
      {/* body */}
      <div className="relative p-6 text-gray-900 text-xl flex-auto max-h-[60vh] overflow-auto my-auto text-left">
        Are you 100% sure you want to delete this auction?
      </div>
      {/*footer*/}
      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
        <button
          className="text-red-500 hover:bg-red-500 hover:text-neutral-300 background-transparent font-bold uppercase px-6 py-3 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => changeModal(false)}
        >
          Close
        </button>
        <button
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleDelAuc}
          // disabled={!addPlist ? true : false}
        >
          Delete Auction
        </button>
      </div>
    </>
  );
};

export default AuctionDetails;
