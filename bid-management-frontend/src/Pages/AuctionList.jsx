import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiServices from "../apis/apiServices";
import { toast } from "react-toastify";
import moment from 'moment';

const AuctionList = () => {
  const [auctionData, setAuctionData] = useState([]);
  const [timefilter, setTimefilter] = useState("all");

  const handelTimeFilter = (e) => {
    console.log(e.target.value);
    setTimefilter(e.target.value);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      sessionStorage.clear();
      console.log("no userid in session storage");
      toast.error("Please login again to continue");
      nav("/login");
    }
    const data = {
      usingId: sessionStorage.getItem("userId"),
      status: true,
    };
    apiServices
      .getAuction(data)
      .then((res) => {
        console.log("auctionlist", res.data);
        toast.success("Auction list fetched successfully");
        setAuctionData(res.data.data);
      })
      .catch((err) => {
        console.log("auctionlist error", err);
        toast.error(err.response.data.message)
      });
  }, []);

  return (
    <div className="container min-h-[calc(100vh-75px)] bg-sky-50 pt-4">
      <div className="title text-4xl text-center font-semibold text-gray-600 underline">
        Auctions
      </div>
      <div className="filter mt-5">
        <form class="max-w-sm mx-auto">
          <select
            id="timefilter"
            onChange={handelTimeFilter}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value={"all"} selected>
              All
            </option>
            <option value="Upcomming">Upcomming</option>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
          </select>
        </form>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-5 gap-y-3 py-10">
        {auctionData?.map((elem, id) => {
          if (timefilter === "all") {
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
          } else if (
            timefilter === "Upcomming" &&
            new Date(elem.startTime) > new Date()
          ) {
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
          } else if (
            timefilter === "ongoing" &&
            new Date(elem.startTime) < new Date() &&
            new Date(elem.endTime) > new Date()
          ) {
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
          } else if (
            timefilter === "ended" &&
            new Date(elem.endTime) < new Date()
          ) {
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
          // return(
          //   <AuctionItems key={id} id={elem._id} title={elem.title} name={elem.name} description={elem.description} startingPrice={elem.startingPrice} startTime={elem.startTime} endTime={elem.endTime}     />
          // )
        })}
      </div>
    </div>
  );
};

const AuctionItems = ({
  keyy,
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
      key={keyy}
      className="flex  lg:w-full  rounded-2xl p-3 flex-col h-[235px] bg-gray-300/30"
    >
      <div className="title flex truncate justify-center items-center gap-x-1 text-2xl font-semibold text-center">
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
      <div className="name text-lg">{name}</div>
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

export default AuctionList;
