import React, { useState } from "react";
import apiServices from "../apis/apiServices";

const ModalOverlay = ({changeModal,data,Modelbody,title}) => {
    // const [plistname,setPlistName] = useState('')
    // const createPlist=()=>{
    //     const data={
    //         name:plistname,
    //         userId:sessionStorage.getItem('_id')
    //     }
    //     apiServices.createPlists(data).then((res) => {
    //         if(res.data.sucess){
    //             console.log('plist created-',res.data.data)
    //         }else{
    //             console.log(res.data.message)
    //         }

    //     }).catch((err) => {
    //         console.log('model create error',err)
    //     });

    //     changeModal(false)
    // }
  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed  inset-0 z-50 outline-none focus:outline-none">
        <div className="overlay fixed inset-0 bg-neutral-950/30" onClick={()=>changeModal(false)}></div>
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full  bg-sky-100 text-neutral-100 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl text-gray-700 font-semibold">{title}</h3>
            </div>
            {Modelbody(changeModal,data)}
            {/* <div className="relative p-6 flex-auto text-left">
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                {ModelFooter(changeModal)}
            </div> */}
          </div>
        </div>
      </div>
      {/* <div className="opacity-25 fixed inset-0 z-10 bg-black" onClick={()=>changeModal(false)}></div> */}
    </div>
  );
};

export default ModalOverlay;
