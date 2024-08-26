import React, { useEffect } from 'react'
import { PiCoinsBold } from 'react-icons/pi'
import { NavLink } from 'react-router-dom'

const AutoComplete = ({content}) => {
  return (
    <div className='flex flex-col w-full z-50'>
        {
            content.notes.length>=1 &&
            <h3 className='text-lg font-bold'>Notes</h3> 
        }
        {
            content.notes.map((elem,id)=>{
                return(
                    <>
                        <NavLink to={`/${elem._id}`} className=' px-4 py-2 text-left' key={id}>{elem.title}</NavLink>
                        <hr />
                    </>
                )
            })
        }
        
        {content.plist.length>=1 && (
            <>
            <h3 className='text-lg font-bold my-1'>Playlist</h3>
            <hr />
            </>
        )}
        {
            content.plist.map((elem,id)=>{
                return(
                    <>
                        <NavLink to={`/allPlists/${elem._id}`} key={id} className=' px-4 py-2 text-left' >{elem.name}</NavLink>
                        <hr />
                    </>
                )
            })
        }
    </div>
  )
}

export default AutoComplete