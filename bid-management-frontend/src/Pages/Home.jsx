import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home h-screen flex flex-col">
        <nav className=" flex justify-between py-4 px-3 align-middle sticky top-0 bg-white shadow-md">
          <span className="font-extrabold text-xl">Bidding<span className="text-blue-900">Management</span></span>
          <div className=" font-bold">
            <Link to={'/login'} className="bg-black text-neutral-100 me-2 px-2 py-1 rounded-md text-">Login</Link>
            <Link to={'/signup'} className="bg-black text-neutral-100 me-2 px-2 py-1 rounded-md text-">SignUp</Link>
          </div>
        </nav>
        <div className="flex justify-center flex-col items-center grow space-y-2 py-6 bg-sky-100/50">
          <span className=" rounded-3xl font-bold text-amber-700 py-4 px-2 bg-orange-200/50">🥇 No.1 Bidding Website</span>
          <span className="text-3xl font-bold">Bid, Win, and Sell Today!</span>
          <span className="bg-gradient-to-r from-green-400 to-blue-500 px-2 py-2 rounded-md font-bold text-lg text-neutral-100">Bid Fast & easy</span>
          <span className=" max-w-[350px] text-center text-gray-400">Welcome to Bidding Management, the premier online auction platform. Buy, sell, and bid on a wide range of items. Join now and start winning big</span>
        </div>
        <footer className="text-center space-x-3 py-4 bg-sky-100/50 border-t">
          <button>Privacy Policy</button>
          <button>Terms of service</button>
        </footer>
      </div>
  )
}

export default Home