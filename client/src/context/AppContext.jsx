import React, { createContext, use, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {useUser,useAuth} from "@clerk/clerk-react";
import { useState } from 'react';
import {toast} from 'react-hot-toast';
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;


const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const  currncy = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isOwner,setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCity, setSearchedCity] = useState([]);

const fetchUser=async()=>{
    try {
        const data = await axios.get('/api/user',{headers:{Authorization:`Bearer ${await getToken()}`}});
        if(data.success){
            setIsOwner(data.role === 'hotelowner');
            setSearchedCity(data.recentSearchedCities)
        }
        else{
            //retry after 5 second
            setTimeout(fetchUser,5000);
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
        searchedCity,
        setSearchedCity
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