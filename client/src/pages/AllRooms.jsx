import React, { useMemo, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();

  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRanges: [],
  });

  const [selectedSort, setSelectedSort] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family"];
  const priceRanges = ["$0-$100", "$100-$200", "$200-$300", "$300+"];
  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Rating: High to Low",
    "Rating: Low to High",
    "Newest Listings",
  ];

  
  const handleFilterChange = (checked, type, value) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };

      if (checked) {
        updated[type] = [...updated[type], value];
      } else {
        updated[type] = updated[type].filter((item) => item !== value);
      }

      return updated;
    });
  };

  const handleSortChange = (option) => {
    setSelectedSort(option);
  };

  const matchesRoomType = (room) => {
    return (
      selectedFilters.roomTypes.length === 0 ||
      selectedFilters.roomTypes.includes(room.type)
    );
  };

  
  const matchesPriceRange = (room) => {
    if (selectedFilters.priceRanges.length === 0) return true;

    return selectedFilters.priceRanges.some((range) => {
      if (range === "$300+") return room.pricePerNight >= 300;

      const [min, max] = range.replace("$", "").split("-").map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  };

  const sortRooms = (roomsList) => {
    if (selectedSort === "Price: Low to High") {
      return [...roomsList].sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (selectedSort === "Price: High to Low") {
      return [...roomsList].sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (selectedSort === "Rating: High to Low") {
      return [...roomsList].sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "Rating: Low to High") {
      return [...roomsList].sort((a, b) => a.rating - b.rating);
    } else if (selectedSort === "Newest Listings") {
      return [...roomsList].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return roomsList;
  };

  const filterDestination = (room) => {
    const destination = searchParam.get("destination");
    if (!destination) return true;

    return room?.hotel?.city
      ?.toLowerCase()
      ?.includes(destination.toLowerCase());
  };

  
  const filteredRooms = useMemo(() => {
    const filtered = rooms.filter(
      (room) =>
        matchesRoomType(room) &&
        matchesPriceRange(room) &&
        filterDestination(room)
    );

    return sortRooms(filtered);
  }, [rooms, selectedFilters, selectedSort, searchParam]);

  const clearFilters = () => {
    setSelectedFilters({ roomTypes: [], priceRanges: [] });
    setSelectedSort("");
    setSearchParam({});
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories
          </p>
        </div>

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex gap-6 flex-col md:flex-row items-start py-10 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              className="max-h-full md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />

            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>

              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>

              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>

              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
              </div>

              <div className="flex items-center gap-4 mt-3 mb-6 flex-wrap">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5f5]/70"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-xl font-medium text-gray-700">
                ${room.pricePerNight} /night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER PANEL (layout unchanged) */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg :mt-16">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-300">
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span onClick={() => setOpenFilter(!openFilter)} className="lg:hidden">
              {openFilter ? "HIDE" : "SHOW"}
            </span>
            <span onClick={clearFilters} className="hidden lg:block">
              CLEAR
            </span>
          </div>
        </div>

        <div className={`${openFilter ? "max-md:h-auto" : "max-md:h-0"} overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {roomTypes.map((room) => (
              <CheckBox
                key={room}
                label={room}
                selected={selectedFilters.roomTypes.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, "roomTypes", room)
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range) => (
              <CheckBox
                key={range}
                label={`${range}`}
                selected={selectedFilters.priceRanges.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, "priceRanges", range)
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={selectedSort === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;