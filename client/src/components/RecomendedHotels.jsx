import React, { useEffect } from 'react'

import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext' 
import { useState } from 'react'


const RecommendedHotels = () => {
  const {rooms,searchedCities} = useAppContext();
  const [recommended, setRecommended] =useState([]);

 const filterHotels = () => {
  if (!searchedCities.length) {
    setRecommended([]);
    return;
  }

  const latestCity = searchedCities[searchedCities.length - 1];

  const filteredHotels = rooms.filter(
    (room) =>
      room.hotel.city.toLowerCase().trim() ===
      latestCity.toLowerCase().trim()
  );

  setRecommended(filteredHotels);
};
  useEffect(() => {
    filterHotels();
  }, [rooms,searchedCities]);

  return recommended.length>0 && (
    <div className='flex flex-col items-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

    <Title title='Recommended Hotels' subTitle= 'Discover our handpicked selection of luxury hotels around the world,offering exceptional experiences and unforgettable memories.' />

        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {recommended.slice(0, 4).map((room, index) => (
               <HotelCard key={room._id} room={room} index={index} />
            ))}       
        </div>
           

    </div>
  )
}

export default RecommendedHotels;
