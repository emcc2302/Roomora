import axios from 'axios'
import React, { createContext, use, useEffect } from 'react'

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {useUser,useAuth} from "@clerk/clerk-react";
import { useState } from 'react';
import {toast} from 'react-hot-toast';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const  currncy = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isOwner,setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
          const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setRooms(data.rooms);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message );
        }
        };

const fetchUser=async()=>{
    try {
        const {data} = await axios.get('/api/user',{headers:{Authorization:`Bearer ${await getToken()}`}});
        
        if(data.success){
            setIsOwner(data.role === 'hotelOwner');
            setSearchedCities(data.recentSearchedCities)
        }
        else{
            //retry after 5 second
            // setTimeout(fetchUser,5000);
            setTimeout(()=>{
                fetchUser();
            },5000)

            }
        
    } catch (error) {
        toast.error(error.message || 'Failed to fetch user data. Retrying...');
      
    }
}
 

    useEffect(()=>{
        if(user){
            fetchUser();
        }
    },[user])

    useEffect(()=>{
        fetchRooms();
    },[])

    const value={
        currency : currncy,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        showHotelReg,
        setShowHotelReg,
        axios,
        searchedCities,
        setSearchedCities,
        rooms,
        setRooms
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
   return useContext(AppContext);
}