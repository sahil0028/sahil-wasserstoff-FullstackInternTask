import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const DashNav = () => {
  const css = `w-fit items-center px-3  hover:text-blue-600 text-center cursor-pointer`
  // const css = ``
  return (
    <div className='container flex gap-x-4 justify-center py-2 overflow-scroll no-scrollbar bg-sky-50'>
      <NavLink to={`/dashboard/part`} className={({ isActive }) =>
        isActive ? ` text-blue-600 underline underline-offset-4 font-semibold  md:px-0 ${css}` : `text-gray-700 md:px-0 ${css}`}>Participated Auctions</NavLink>
      <NavLink to={`/dashboard/hosted`} className={({ isActive }) =>
        isActive ? ` text-blue-600 underline underline-offset-4 font-semibold  md:px-0  ${css}` : `text-gray-700 md:px-0 ${css}`}>Hosted Auctions</NavLink>
      <NavLink to={`/dashboard/addAuction`} className={({ isActive }) =>
        isActive ? ` text-blue-600 underline underline-offset-4 font-semibold  md:px-0  ${css}` : `text-gray-700 md:px-0 ${css}`}>Add Auctions</NavLink>
      {/* <Link to={``}>Settings</Link> */}
    </div>
  )
}

export default DashNav