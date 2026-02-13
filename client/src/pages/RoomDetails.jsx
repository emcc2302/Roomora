import React from 'react'
import { useParams } from 'react-router-dom';
import {useEffect, useState } from 'react'; 
import { roomsDummyData } from '../assets/assets';
const RoomDetails = () => {
    const {id}=useParams();
    const [room,setRoom]=useState(null);
    const [mainImage,setMainImage]=useState(null);

    useEffect(()=>{
        // Fetch room details using the id and set it to state
        const room=roomsDummyData.find((room)=>room._id===id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    },[]);

  return room && (
   <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
  {/* Room Details */}
  <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
    <h1 className='text-3xl md:text-4xl font-playfair'>
      {room.hotel.name}
      <span className='font-inter text-sm'>({room.roomType})</span>
    </h1>
    <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>
      20% OFF
    </p>
  </div>
</div>

  )
}

export default RoomDetails
