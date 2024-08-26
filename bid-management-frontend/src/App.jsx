import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Masterpage from "./components/Masterpage";
import AuctionList from "./Pages/AuctionList";
import AuctionDetails from "./Pages/AuctionDetails";
import BidRoom from "./Pages/BidRoom";
import DashboardAuction from "./Pages/DashboardAuction";
import AddAuction from "./Pages/AddAuction";
import Admin from "./Pages/Admin";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Home from "./Pages/Home";

function App() {

  // vedio git repo and etc

  // save highest bid and bidder in auc model
  // check responsiveness
  // deploy
  // if loading true show loader
  // auction list handle admin hide
  
  // -->  complete
  // participated Auctions test and api.
  // update auction
  // delete auction
  // if date.now>endtime stop bidding
  // image add funtionality.
  // toast
  // add react moment
  // logout btn in admin panel 
  // home page

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="dark"
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auctions" element={<Masterpage />} >
          <Route path="" element={<AuctionList />} />
          <Route path=":id" element={<AuctionDetails />} />
          <Route path="bid/:id" element={<BidRoom />} />
        </Route>
        <Route path="/dashboard" element={<Masterpage />}>
          <Route path="part" element={<DashboardAuction />} />
          <Route path="hosted" element={<DashboardAuction />} />
          <Route path="addAuction" element={<AddAuction />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
