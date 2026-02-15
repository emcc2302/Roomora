import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

const AddRoom = () => {

    const [images, setImages] = React.useState({
        1: null,
        2 : null,
        3: null,
        4 : null
    })

    const [inputs, setInputs] = useState({
        roomType : '',
        price : 0,
        description : '',
        amenities : {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Pool Access': false,
            'Mountain View': false
        },
       
    })

  return (
    <form >
        <Title align='left' font='outfit' title='Add Room' subTitle='Add a new room to your hotel and fill in the details carefully'/>

        {/* Upload Images */}
        <p className='text-gray-800 mt-10'>Images</p>
        <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
            {Object.keys(images).map((key) => (
                <label htmlFor={`roomImage${key}`} key={key} className='w-24 h-24 border border-gray-300 rounded flex items-center justify-center cursor-pointer overflow-hidden'>
                    <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt={`Room Image ${key}`} className='w-full h-full object-cover'/>
                    <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={(e) => {
                        setImages(prev => ({
                            ...prev,
                            [key]: e.target.files[0]
                        }))
                    }}/>
                    </label>
            ))} 
        </div>

        <div className='w-full flex max-sm:flex-col sm:gap-4 mt:4'>
            <div className='flex flex-col w-full max-w-sm'>
                <p className='text-gray-800 mt-4'>Room Type</p>
               <select className='border border-gray-300 rounded w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500' value={inputs.roomType} onChange={(e) => setInputs(prev => ({...prev, roomType: e.target.value}))}>
                    <option value="">Select Room Type</option>
                    <option value="Single Bed">Single Bed</option>
                    <option value="Double Bed">Double Bed</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                </select>
            </div>
            <div>
                <p className='text-gray-800 mt-4'>Price <span className='text-xs'>/night</span></p>
                <input type="number" value={inputs.price} onChange={(e) => setInputs(prev => ({...prev, price: e.target.value}))} className='border border-gray-300 rounded w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
             </div>
        </div>
        <div className='w-full mt-4'>
            <p className='text-gray-800'>Description</p>
            <textarea value={inputs.description} onChange={(e) => setInputs(prev => ({...prev, description: e.target.value}))} className='border border-gray-300 rounded w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
         </div>
        <div className='w-full mt-4'>
            <p className='text-gray-800'>Amenities</p>
            <div className='flex flex-wrap gap-4 mt-2'>
                {Object.keys(inputs.amenities).map((amenity) => (
                    <label key={amenity} className='flex items-center gap-2 border border-gray-300 rounded px-3 py-2 cursor-pointer'>
                        <input type="checkbox" checked={inputs.amenities[amenity]} onChange={(e) => setInputs(prev => ({    ...prev, amenities: {...prev.amenities, [amenity]: e.target.checked}}))}/>
                        <span className='text-gray-700'>{amenity}</span>
                    </label>
                ))}
            </div>

        </div>
            <button type='submit' className='bg-blue-500 text-white px-6 py-2 rounded mt-6 hover:bg-blue-600 transition-colors cursor-pointer'>
            Add Room</button>
    </form>
  )
}

export default AddRoom
