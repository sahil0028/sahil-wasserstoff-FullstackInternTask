import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
// import { useDispatch, useSelector } from "react-redux";
// import { changeAuth } from "../Store/Slice/UserSlice";
// import { toast } from "react-toastify";
import AutoComplete from "./AutoComplete";

const Navbar = ({children}) => {
  const nav = useNavigate()
  const [expand,setExpand] = useState(false)
  const [autocom,setAutocom] = useState(false)
  // const isAuth = useSelector((state)=>state.auth)
  // const notes = useSelector((state)=>state.notes)
  // const plists = useSelector((state)=>state.plists)
  // const dispatch = useDispatch()
  const handleLogout=()=>{
    // dispatch(changeAuth(false))
    sessionStorage.clear()
    // toast.success('Logout sucessful')
    nav('/')
  }

  const [content,setContent] = useState({notes:[],plist:[]})
  const handleContent=(e)=>{
    // let updatedvalue = {notes:[],plist:[]}
    // updatedvalue.notes=notes.data.filter((elem)=>{
    //   return elem.title.includes(e.target.value)
    // })
    // updatedvalue.plist=plists.data.filter((elem)=>{
    //   return elem.name.includes(e.target.value)
    // })
    // console.log(updatedvalue.notes)
    // console.log(updatedvalue.plist)
    // setContent(updatedvalue)
  }

  // disable the scrolling when nav bar is open in md screen
  useEffect(()=>{
    if(expand){
      window.onscroll= function() {
        window.scrollTo(0, 0);
      };
    }else{
      window.onscroll=null
    }
  },[expand])
  return (
    <nav className="container pb-3 bg-sky-100 shadow-lg h-[70px] transition-all text-center md:top-0 flex gap-4 pt-5">
      <div className="heading text-3xl font-semibold text-gray-700 cursor-pointer" onClick={()=>nav('/')}>
        {" "}
        B<span className=" text-amber-600">M</span>
      </div>
      <div className={`hidden text-sky-400 p-3 hover:bg-sky-400/50 bg-sky-200 rounded-md  cursor-pointer absolute right-0 mr-5 md:block md:ml-auto md:z-50`} onClick={()=>{setExpand((prev)=>!prev)}}><FaBars /></div>
      <div className={`hidden z-30 ${ expand?'absolute bg-slate-950/30 inset-0  md:block':''}`} onClick={()=>{setExpand(false)}}></div>
      <div className={`others flex grow gap-2 md:flex-col md:transition-all md:items-end md:absolute md:h-screen md:right-0 md:bg-sky-100 md:top-0 md:px-4 md:z-40 ${expand?'md:-translate-x-0':' md:hidden md:translate-x-full'}`}>
        <div className="search flex relative  grow justify-center gap-4 md:flex-col-reverse md:justify-end md:mt-20 md:grow-0">
          <ul className="flex divide-x divide-slate-600 space-x-3 md:flex-col  md:divide-x-0 md:space-x-0 md:space-y-3 md:divide-y-2 md:mx-auto">{children}</ul>
          {/* <form className="flex items-center max-w-sm md:mx-auto">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-700 dark:text-gray-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                placeholder="Search Title name..."
                onFocus={()=>setAutocom(true)}
                onBlur={()=>{
                  setTimeout(()=>{
                    setAutocom(false)
                  },300)
                }}
                onChange={handleContent}
                required
              />
            </div>
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-gray-700 bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
            <div className={autocom?"absolute bg-white bottom-0 translate-y-full md:translate-y-36 max-h-[calc(100vh-100px)] overflow-auto no-scrollbar w-[210px] rounded-md z-50":' hidden'}><AutoComplete content={content}/></div>
          </form> */}
        </div>
        {/* <div className="login text-neutral-200"> Login</div> */}
        {
          // isAuth &&
          <div onClick={handleLogout} className="font-medium cursor-pointer  rounded-md px-2 py-1 login text-neutral-200 bg-blue-500 border-2 border-neutral-300 my-auto hover:bg-blue-600/80 md:w-3/4 md:mx-auto  md:mb-auto">Logout</div>
          // :<Link to={'/login'} className="font-medium  rounded-md px-2 py-1 login text-neutral-200 bg-blue-500 border-2 border-neutral-300 my-auto hover:bg-blue-500/80 md:w-3/4 md:mx-auto  md:mb-auto">Login</Link>  
        }
        {/* <Link to={'/login'}>Login</Link> */}
      </div>
    </nav>

  );
};

export function NavbarItems({icon,text,link}){
  const css = `flex items-center px-3  hover:text-blue-600 text-center cursor-pointer`
  return(
    <li className="my-auto md:py-3">
      <NavLink to={link} className={({ isActive }) =>
        isActive ? ` text-blue-600 underline underline-offset-4 font-semibold  md:px-0 md:mx-auto ${css}` : `text-gray-700 md:px-0 ${css}`} >
        {icon}
        <span className="text-sm  ml-3 lg:hidden md:block">{text}</span>
      </NavLink>
    </li>
  )
}

export default Navbar;
