import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashNav from '../components/DashNav'
import apiServices from '../apis/apiServices'
import { toast } from 'react-toastify'
import moment from 'moment';

const DashboardAuction = () => {
    const [auctionData,setAuctionData] = useState([])
    const [timefilter, setTimefilter] = useState("all");

  const handelTimeFilter = (e) => {
    console.log(e.target.value);
    setTimefilter(e.target.value);
  };
    useEffect(()=>{
      if(!sessionStorage.getItem('userId')){
        sessionStorage.clear()
        console.log('no userid in session storage');
        toast.error('Please login again to continue')
        nav('/login')
      }
      let data = {
        usingId: sessionStorage.getItem('userId')
      }
      if((window.location.href).includes('hosted')){
        data['userId']=sessionStorage.getItem('userId')
        data['status'] = true
        apiServices.getAuction(data).then((res) => {
          console.log('dashboard hosted-',res.data);
          setAuctionData(res.data.data)
        }).catch((err) => {
          console.log('dashboard hosted error',err);
          toast.error(err.response.data.message)
        });

        // setAuctionData([
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Vintage Car Auction",
        //       "name": "1965 Ford Mustang",
        //       "description": "A classic 1965 Ford Mustang in excellent condition with original parts.",
        //       "startTime": "2024-08-22T10:00:00Z",
        //       "endTime": "2024-08-22T16:00:00Z",
        //       "startingPrice": 25000
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Antique Furniture Sale",
        //       "name": "Victorian Oak Desk",
        //       "description": "A beautifully crafted Victorian oak desk from the late 19th century.",
        //       "startTime": "2024-08-23T14:00:00Z",
        //       "endTime": "2024-08-23T20:00:00Z",
        //       "startingPrice": 1200
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Fine Art Auction",
        //       "name": "Monet's Water Lilies",
        //       "description": "A rare original painting from Monet's Water Lilies series.",
        //       "startTime": "2024-08-24T12:00:00Z",
        //       "endTime": "2024-08-24T18:00:00Z",
        //       "startingPrice": 500000
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Luxury Watch Auction",
        //       "name": "Rolex Submariner",
        //       "description": "A brand new Rolex Submariner with a black dial and stainless steel case.",
        //       "startTime": "2024-08-25T09:00:00Z",
        //       "endTime": "2024-08-25T15:00:00Z",
        //       "startingPrice": 7500
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Rare Book Auction",
        //       "name": "First Edition of 'Pride and Prejudice'",
        //       "description": "A rare first edition of Jane Austen's 'Pride and Prejudice', published in 1813.",
        //       "startTime": "2024-08-26T11:00:00Z",
        //       "endTime": "2024-08-26T17:00:00Z",
        //       "startingPrice": 15000
        //   }
        //   ]
        // )
      }else{

        data[`userId`]=sessionStorage.getItem('userId')||''
        data['status'] = true
        apiServices.getPartAuction(data).then((res) => {
          console.log('dashboard part-',res.data);
          setAuctionData(res.data.data)
        }).catch((err) => {
          console.log('dashboard part error',err)
          toast.error(err.response.data.message)
        })


        // setAuctionData([
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Vintage Car Auction",
        //       "name": "1965 Ford Mustang",
        //       "description": "A classic 1965 Ford Mustang in excellent condition with original parts.",
        //       "startTime": "2024-08-22T10:00:00Z",
        //       "endTime": "2024-08-22T16:00:00Z",
        //       "startingPrice": 25000
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Antique Furniture Sale",
        //       "name": "Victorian Oak Desk",
        //       "description": "A beautifully crafted Victorian oak desk from the late 19th century.",
        //       "startTime": "2024-08-23T14:00:00Z",
        //       "endTime": "2024-08-23T20:00:00Z",
        //       "startingPrice": 1200
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Fine Art Auction",
        //       "name": "Monet's Water Lilies",
        //       "description": "A rare original painting from Monet's Water Lilies series.",
        //       "startTime": "2024-08-24T12:00:00Z",
        //       "endTime": "2024-08-24T18:00:00Z",
        //       "startingPrice": 500000
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Luxury Watch Auction",
        //       "name": "Rolex Submariner",
        //       "description": "A brand new Rolex Submariner with a black dial and stainless steel case.",
        //       "startTime": "2024-08-25T09:00:00Z",
        //       "endTime": "2024-08-25T15:00:00Z",
        //       "startingPrice": 7500
        //   },
        //   {
        //       '_id':"fdsafsdffsa",
        //       "title": "Rare Book Auction",
        //       "name": "First Edition of 'Pride and Prejudice'",
        //       "description": "A rare first edition of Jane Austen's 'Pride and Prejudice', published in 1813.",
        //       "startTime": "2024-08-26T11:00:00Z",
        //       "endTime": "2024-08-26T17:00:00Z",
        //       "startingPrice": 15000
        //   }
        //   ]
        //   )
      }

    },[window.location.href])

  return (
    <>
    <DashNav />
    <div className='container min-h-[calc(100vh-110px)] bg-sky-50 pt-4'>
      <div className="title text-4xl text-center font-semibold text-gray-600 underline">{(window.location.href).includes('hosted')?'Hosted':'Participated'} Auctions</div>
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
        {
          auctionData?.map((elem,id)=>{
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
            //   <AuctionItems keyy={id} id={elem._id} title={elem.title} name={elem.name} description={elem.description} startingPrice={elem.startingPrice} startTime={elem.startTime} endTime={elem.endTime}     />
            // )
          })
        }
      </div>
    </div>
    </>
  )
}

const AuctionItems = ({keyy,id,title,name,description,startTime,endTime,startingPrice})=>{

  const getDate=(date)=>{
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
  }
    return(
      <div key={keyy} className="flex  lg:w-full  rounded-2xl p-3 flex-col h-[235px] bg-gray-300/30">
        <div className="title truncate flex justify-center items-center gap-x-1 text-2xl font-semibold text-center">{title}
        {
          Date.now() > new Date(endTime) ? <div className='text-red-500 px-4 py-2 rounded-lg font-medium text-lg'>Ended</div>:Date.now() < new Date(endTime) &&Date.now() > new Date(startTime)?<div className='text-green-500 px-4 py-2 rounded-lg font-medium text-lg'>Ongoing</div> : <div className='text-yellow-500 px-4 py-2 rounded-lg font-medium text-lg '>Upcomming</div>
        }
        </div>
        <div className="name text-lg">{name}</div>
        <div className="price ps-2"> $ {startingPrice}</div>
        <div className="desc line-clamp-2 grow ps-2">{description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit quia nihil voluptate facere necessitatibus inventore eaque laboriosam eos aut fugit incidunt deserunt explicabo, vero a nostrum saepe optio, ratione corrupti debitis autem odio. Laboriosam, excepturi eos! Corrupti tempore eaque neque modi laboriosam dignissimos. Ipsam, mollitia numquam! Sapiente autem quod error.</div>
        <div className="timestamps pt-2 pb-1 px-2 flex justify-between flex-wrap">
          <div className="start truncate">{getDate(startTime)}</div>
          <div className="end truncate">{getDate(endTime)}</div>
        </div>
        <Link to={`/auctions/${id}`} className="info mx-auto bg-sky-400 rounded-md font-semibold text-neutral-100 py-1.5 px-3"> More Info </Link>
      </div>
    )
}

export default DashboardAuction