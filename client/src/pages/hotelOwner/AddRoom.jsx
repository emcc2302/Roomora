import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Pool Access": false,
      "Mountain View": false,
    },
  });

  const [loading, setLoading] = useState(false);

  /* ---------------- CLOUDINARY UPLOAD FUNCTION ---------------- */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "roomora"); 
    formData.append("cloud_name", "dhlzu8xun"); 

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dhlzu8xun/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !Object.values(images).some((img) => img)
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      /* STEP 1 → upload images to cloudinary */
      const imageFiles = Object.values(images).filter((img) => img);

      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file))
      );

      /* STEP 2 → convert amenities */
      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );

      /* STEP 3 → send ONLY urls to backend */
      const { data } = await axios.post(
        "/api/rooms",
        {
          roomType: inputs.roomType,
          pricePerNight: inputs.pricePerNight,
          amenities,
          images: imageUrls,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success("Room added successfully");

        setInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free Wifi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Pool Access": false,
            "Mountain View": false,
          },
        });

        setImages({ 1: null, 2: null, 3: null, 4: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="p-8">
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Add a new room to your hotel and fill in the details carefully"
      />

      {/* Upload Images */}
      <p className="text-gray-800 mt-10">Images</p>

      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label
            htmlFor={`roomImage${key}`}
            key={key}
            className="w-24 h-24 border border-gray-300 rounded flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <img
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt="upload"
              className="w-full h-full object-cover"
            />

            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages((prev) => ({
                  ...prev,
                  [key]: e.target.files[0],
                }))
              }
            />
          </label>
        ))}
      </div>

      {/* Room Type + Price */}
      <div className="w-full flex max-sm:flex-col sm:gap-4 mt:4">
        <div className="flex flex-col w-full max-w-sm">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
            value={inputs.roomType}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, roomType: e.target.value }))
            }
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>

        <div>
          <p className="text-gray-800 mt-4">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                pricePerNight: e.target.value,
              }))
            }
            className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="w-full mt-4">
        <p className="text-gray-800">Amenities</p>

        <div className="flex flex-wrap gap-4 mt-2">
          {Object.keys(inputs.amenities).map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 border px-3 py-2 rounded"
            >
              <input
                type="checkbox"
                checked={inputs.amenities[amenity]}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    amenities: {
                      ...prev.amenities,
                      [amenity]: e.target.checked,
                    },
                  }))
                }
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded mt-6"
        disabled={loading}
      >
        {loading ? "Adding Room..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoom;