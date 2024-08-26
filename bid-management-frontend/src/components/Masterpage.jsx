import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar,{NavbarItems} from './Navbar'
import { FaHome } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";

const Masterpage = () => {
  const nav = useNavigate()
  useEffect(()=>{
    if(window.location.href.includes('dashboard') && sessionStorage.getItem('email')=='admin@gmail.com'){
      nav('/admin')
    }
    if(window.location.href=='http://localhost:5173/dashboard/'){
      nav('/dashboard/part')
    }
  },[window.location.href])
  return (
    <div className=''>
        <Navbar >
          <NavbarItems icon={<FaHome size={20} />} link={'/auctions'}  text={'Auctions'} />
          <NavbarItems icon={<FaNoteSticky size={20}  />} link={'/dashboard/'} text={'Dashboard'}  />
          {/* <NavbarItems icon={<MdOutlinePlaylistAddCheck size={20}/>} link={'allplists'} text={'Playlist'} /> */}
        </Navbar>
        <Outlet />
    </div>
  )
}

export default Masterpage