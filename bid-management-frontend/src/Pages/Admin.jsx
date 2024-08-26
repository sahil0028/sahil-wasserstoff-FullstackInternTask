import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiServices from "../apis/apiServices";
import moment from 'moment';

const Admin = () => {
  const userData = { email: sessionStorage.getItem("email")||'' };
  const nav = useNavigate()

  const handleLogout = ()=>{
    sessionStorage.clear()
    nav('/login')
  }

  const [auctionData, setAuctionData] = useState([]);
    const [timefilter, setTimefilter] = useState('all');

    const handelTimeFilter = (e) => {
        console.log(e.target.value)
        setTimefilter(e.target.value)
    }

  useEffect(() => {
    if (userData.email != "admin@gmail.com") {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    // setAuctionData([
    //   {
    //     _id: "fdsafsdffsa",
    //     title: "Vintage Car Auction",
    //     name: "1965 Ford Mustang",
    //     description:
    //       "A classic 1965 Ford Mustang in excellent condition with original parts.",
    //     startTime: "2024-08-22T10:00:00Z",
    //     endTime: "2024-08-22T16:00:00Z",
    //     startingPrice: 25000,
    //   },
    //   {
    //     _id: "fdsafsdffsa",
    //     title: "Antique Furniture Sale",
    //     name: "Victorian Oak Desk",
    //     description:
    //       "A beautifully crafted Victorian oak desk from the late 19th century.",
    //     startTime: "2024-08-23T14:00:00Z",
    //     endTime: "2024-08-23T20:00:00Z",
    //     startingPrice: 1200,
    //   },
    //   {
    //     _id: "fdsafsdffsa",
    //     title: "Fine Art Auction",
    //     name: "Monet's Water Lilies",
    //     description:
    //       "A rare original painting from Monet's Water Lilies series.",
    //     startTime: "2024-08-24T12:00:00Z",
    //     endTime: "2024-08-24T18:00:00Z",
    //     startingPrice: 500000,
    //   },
    //   {
    //     _id: "fdsafsdffsa",
    //     title: "Luxury Watch Auction",
    //     name: "Rolex Submariner",
    //     description:
    //       "A brand new Rolex Submariner with a black dial and stainless steel case.",
    //     startTime: "2024-08-25T09:00:00Z",
    //     endTime: "2024-08-25T15:00:00Z",
    //     startingPrice: 7500,
    //   },
    //   {
    //     _id: "fdsafsdffsa",
    //     title: "Rare Book Auction",
    //     name: "First Edition of 'Pride and Prejudice'",
    //     description:
    //       "A rare first edition of Jane Austen's 'Pride and Prejudice', published in 1813.",
    //     startTime: "2024-08-26T11:00:00Z",
    //     endTime: "2024-08-26T17:00:00Z",
    //     startingPrice: 15000,
    //   },
    // ]);

    const data={
      usingId: sessionStorage.getItem('userId'),
      status:true
    }
    apiServices.getAuction(data).then((res) => {
      console.log('admin-',res.data)
      setAuctionData(res.data.data)
    }).catch((err) => {
      console.log('admin auction err-',err)
      toast.error(err.response.data.message)
    });

  }, []);

  return (
    <div className="container min-h-screen bg-sky-50 pt-4">
      <div className="absolute top-2 right-2 px-4 py-2 rounded-lg font-semibold text-neutral-100 cursor-pointer bg-red-500" onClick={handleLogout}>Logout</div>
      <div className="title text-4xl text-center pt-5 font-semibold text-gray-600 underline">
        Admin Dashboard
      </div>
      <div className="title text-xl text-center font-semibold text-gray-500">
        Auctions-{auctionData.length}
      </div>
      <div className="filter">
        <form class="max-w-sm mx-auto">
          {/* <label
            for="countries"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select an option
          </label> */}
          <select
            id="timefilter"
            onChange={handelTimeFilter}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value={'all'} selected>All</option>
            <option value="Upcomming">Upcomming</option>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
          </select>
        </form>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-5 gap-y-3 py-10">
        {auctionData?.map((elem, id) => {
            if(timefilter === 'all'){
                return (
                    <AuctionItems
                      key={id}
                      id={elem._id}
                      title={elem.title}
                      name={elem.name}
                      description={elem.description}
                      startingPrice={elem.startingPrice}
                      startTime={elem.startTime}
                      endTime={elem.endTime}
                    />
                  );
            }
            else if(timefilter === 'Upcomming' && new Date(elem.startTime) > new Date()){
                return (
                    <AuctionItems
                      key={id}
                      id={elem._id}
                      title={elem.title}
                      name={elem.name}
                      description={elem.description}
                      startingPrice={elem.startingPrice}
                      startTime={elem.startTime}
                      endTime={elem.endTime}
                    />
                  );
            }
            else if(timefilter === 'ongoing' && new Date(elem.startTime) < new Date() && new Date(elem.endTime) > new Date()){
                return (
                        <AuctionItems
                          key={id}
                          id={elem._id}
                          title={elem.title}
                          name={elem.name}
                          description={elem.description}
                          startingPrice={elem.startingPrice}
                          startTime={elem.startTime}
                          endTime={elem.endTime}
                        />
                    )}
            else if(timefilter === 'ended' && new Date(elem.endTime) < new Date()){
        return (
                <AuctionItems
                  key={id}
                  id={elem._id}
                  title={elem.title}
                  name={elem.name}
                  description={elem.description}
                  startingPrice={elem.startingPrice}
                  startTime={elem.startTime}
                  endTime={elem.endTime}
                />
            )};
      //   return (
        //     <AuctionItems
        //       key={id}
        //       id={elem._id}
        //       title={elem.title}
        //       name={elem.name}
        //       description={elem.description}
        //       startingPrice={elem.startingPrice}
        //       startTime={elem.startTime}
        //       endTime={elem.endTime}
        //     />
        })}
      </div>
    </div>
  );
};

const AuctionItems = ({
  key,
  id,
  title,
  name,
  description,
  startTime,
  endTime,
  startingPrice,
}) => {

  const getDate=(date)=>{
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
  }

  return (
    <div
      key={key}
      className="flex  lg:w-full  rounded-2xl p-3 flex-col h-[235px] bg-gray-300/30"
    >
      
      <div className="title truncate flex justify-center items-center gap-x-1  text-2xl font-semibold text-center">
        {title}
        {Date.now() > new Date(endTime) ? (
          <div className="text-red-500 px-4 py-2 rounded-lg font-medium text-lg">
            Ended
          </div>
        ) : Date.now() < new Date(endTime) &&
          Date.now() > new Date(startTime) ? (
          <div className="text-green-500 px-4 py-2 rounded-lg font-medium text-lg">
            Ongoing
          </div>
        ) : (
          <div className="text-yellow-500 px-4 py-2 rounded-lg font-medium text-lg ">
            Upcomming
          </div>
        )}
      </div>
      <div className="name text-xl">{name}</div>
      <div className="price ps-2"> $ {startingPrice}</div>
      <div className="desc line-clamp-2 grow ps-2">
        {description}
      </div>
      <div className="timestamps pt-2 pb-1 px-2 flex justify-between flex-wrap">
        <div className="start truncate">{getDate(startTime)}</div>
        <div className="end truncate">{getDate(endTime)}</div>
      </div>
      <Link
        to={`/auctions/${id}`}
        className="info mx-auto bg-sky-400 rounded-md font-semibold text-neutral-100 py-1.5 px-3"
      >
        {" "}
        More Info{" "}
      </Link>
    </div>
  );
};

export default Admin;
