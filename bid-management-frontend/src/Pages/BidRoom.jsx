import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import apiServices, {  Base_url } from '../apis/apiServices'
import io from 'socket.io-client'
import { set } from 'react-hook-form'
import { toast } from 'react-toastify'

const Endpoint =Base_url
var socket,selectedChatCompare;

const BidRoom = () => {
  const [bids,setBids] = useState([])
  const [highestBid,setHighestBid] = useState({bidAmount:0,name:''})
  const [endedAuction,setEndedAuction] = useState(false)
  const [aucData,setAucData] = useState({})
  const [userbid,setUserBid] = useState(0)
  const [participate,setpartitcipate] = useState(false)
  const [socketConnected,setSocketConnected] = useState(false)

  const param = useParams()

  // basic data fetching and check if session storage has require ids
  useEffect(()=>{

    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      console.log('no userid in session storage');
      nav('/login')
    }
    const data = {
      usingId: sessionStorage.getItem('userId'),
      _id: param.id
    }
    apiServices.bidGetAuction(data).then((res) => {
      // console.log('basic data',res.data.data[0])
      setAucData(res.data.data[0])
      setBids(res.data.data[0].logs)
      // setEndedAuction(res.data.data[0].end)
      console.log('endedAuction',Date.now()> new Date(res.data.data[0].endTime))
      setEndedAuction(Date.now()> new Date(res.data.data[0].endTime))
      selectedChatCompare = param.id
      socket.emit('join chat',param.id)
    }).catch((err) => {
      console.log('bid room error-',err)
    });
  },[])

  const UserData = {
    _id:sessionStorage.getItem('userId')||'',
    name:sessionStorage.getItem('name')||'',
    email:sessionStorage.getItem('email')||'',
  }

  useEffect(()=>{
    socket = io(Endpoint)
    socket.emit('setup',UserData);
    socket.on('connected',()=>{
      setSocketConnected(true)
    })
  },[])

  useEffect(()=>{
    
    socket.on('message received',(newMesReceived)=>{
      console.log('new message',newMesReceived)
      if(!selectedChatCompare || selectedChatCompare!==newMesReceived.aucData._id){
        return;
      }
      if(newMesReceived.userData._id!==UserData._id){
        console.log('else newMesReceived-',newMesReceived)
        console.log('else bids-',bids)
        console.log('else updatedbid-',[...bids,newMesReceived.bid])
        setBids([...bids,newMesReceived.bid])
      }
      // else{
      //   if(newMesReceived.userData._id===UserData._id){
          
      //   }else{
      //     console.log('else newMesReceived-',newMesReceived)
      //     console.log('else bids-',bids)
      //     console.log('else updatedbid-',[...bids,newMesReceived.bid])
      //     setBids([...bids,newMesReceived.bid])
      //   }
      //   setEndedAuction(Date.now()> new Date(res.data.data[0].endTime))
      //   // setBids([...bids,newMesReceived.bid])
      // }
    })
  })

  

  const handleBid=()=>{
    if (userbid<aucData.startingPrice || userbid<=highestBid.bidAmount){
      toast.info('bid amount is less than starting price or highest bid');
      return
    }
    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      console.log('no userid in session storage');
      nav('/login')
    }
    const data = {
      usingId: sessionStorage.getItem('userId'),
      auctionId: param.id,
      userId: UserData._id,
      bidAmount: userbid
    }
    apiServices.addBid(data).then((res) => {
      console.log('bid',res.data.data);
      // for new partitipant which join after us and data safe
      // apiServices.getAuction({
      //   usingId: sessionStorage.getItem('userId'),
      //   _id: param.id
      // }).then((res) => {
        
      // }).catch((err) => {
        
      // });
      setBids([...bids,res.data.data])
      socket.emit('new message',{
        aucData,
        participants:aucData.participants,
        userData:UserData,
        bid:res.data.data
      })
      // setUserBid(0)
    }).catch((err) => {
      console.log('bid error',err);
    });

  }

  const handleParticipation = ()=>{
    if(!sessionStorage.getItem('userId')){
      sessionStorage.clear()
      console.log('no userid in session storage');
      nav('/login')
    }
    const data = {
      usingId: sessionStorage.getItem('userId'),
      userId:UserData._id,
      auctionId:param.id
    }
    apiServices.participateAuction(data).then((res)=>{
      console.log(res.data)
      if(res.data.success){
        setpartitcipate(true)
      }
    }).catch((err)=>{
      console.log(err)
    })
    setpartitcipate(true)
    
  }

  

  // scroll to bottom
  const dummy = useRef(null);
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [bids]);

  return (
    <div>
      <div className="title text-center text-4xl pt-5 font-bold underline">{aucData?.name}</div>
      <div className="HostedBy text-gray-600 text-center pb-5 font-bold capitalize">Hosted By-{aucData?.userId?.name}</div>
      <div className="grid grid-cols-[80%,20%] md:grid-cols-1">
        <div className="chat h-[calc(85vh-75px)] bg-gray-300/25 ms-4 md:ms-0 rounded-lg">
          <div className="messages no-scrollbar h-[86%] m-2 overflow-auto w-[95%] rounded-lg px-2">
            {
              bids?.map((bid,index)=>{
                // console.log('bid',bid)
                // console.log('1st-',highestBid)
                // console.log('mes-',bid.bidAmount,highestBid.bidAmount)
                if(bid?.bidAmount>highestBid.bidAmount){
                  let temp = {
                    bidAmount:bid?.bidAmount,
                    name:bid?.userId?.name
                  }
                  setHighestBid(temp)
                }
                if(bid?.userId?._id==UserData?._id){
                  return(
                    <div key={index} className="message capitalize rounded-xl bg-red-400 w-fit px-5 py-2 flex ms-auto items-center gap-x-4 my-2">
                      <div className="user">{bid?.userId?.name} bids-&gt;</div>
                      <div className="bid ps-2 font-semibold">${bid?.bidAmount}</div>
                    </div>
                  )
                }
                else{
                  return(
                    <div key={index} className="message capitalize rounded-xl bg-green-400 w-fit px-5 py-2 flex items-center gap-x-4 my-2">
                      <div className="user">{bid?.userId?.name} bids-&gt;</div>
                      <div className="bid ps-2 font-semibold">${bid?.bidAmount}</div>
                    </div>
                )}
                })
            }
            <div ref={dummy} />
          </div>
          <div className="input my-auto grid gap-x-4 md:gap-x-0 grid-cols-[85%,10%]">
            {
              UserData.email==='admin@gmail.com'?<div className='w-full py-3 mx-4 md:mx-0 col-span-2 rounded-lg bg-red-500 text-neutral-100 text-center'>Admin Cannot bid</div>:
              endedAuction?<div className='w-full py-3 mx-4 md:mx-0 col-span-2 rounded-lg bg-red-500 text-neutral-100 text-center'>Auction Ended</div>:
              UserData._id==aucData?.userId?._id?<div className='w-full py-3 mx-4 col-span-2 md:mx-0 rounded-lg bg-red-500 text-neutral-100 text-center'>You cannot bid on your own auction</div>:
              !participate?<div onClick={handleParticipation} className='w-full md:w-[90%] py-3 mx-4 md:mx-auto  col-span-2 cursor-pointer rounded-lg bg-red-500 text-neutral-100 text-center'>Wanna Participate</div>
              :<><input value={userbid} onChange={(e)=>setUserBid(e.target.value)} type="number" className=' py-2 px-4 rounded-lg ms-4' min={highestBid} />
              <div onClick={handleBid} className='flex justify-center text-neutral-100 hover:cursor-pointer hover:bg-sky-600 items-center font-bold bg-sky-500 rounded-md text-center'>Bid</div></>
            }
          </div>
        </div>
        <div className="details my-auto">
          <div className="details min-h-[50px] align-middle  text-2xl border-2 m-2 flex justify-center items-center bg-sky-400 rounded-lg text-neutral-100">
            <Link to={`/auctions/${aucData._id}`} className="">Auction Details</Link>
          </div>
          <div className="startingPrice min-h-[50px] flex justify-center items-center text-xl m-2 border-2 bg-amber-600 p-1 rounded-lg text-neutral-100 font-semibold  "><span>Starting Price:</span> <span>${aucData.startingPrice}</span></div>
          <div className="highestBid min-h-[50px]flex flex-row justify-center items-center startingPrice text-xl m-2 border-2 bg-green-600 p-1 rounded-lg text-neutral-100 font-semibold  "> <div className="text-center"> <span>Highest Bid:</span><span>${highestBid.bidAmount>=aucData.startingPrice?highestBid.bidAmount:'0'} </span></div>{highestBid.bidAmount>=aucData.startingPrice &&<div className='text-center'><span>By-</span><span>{highestBid.name}</span></div>}</div>
        </div>
      </div>
    </div>
  )
}

export default BidRoom