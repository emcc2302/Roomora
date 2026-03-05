import React from 'react'
import FeatureDestination from '../components/FeatureDestination'
import Hero from '../components/Hero'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import RecommendedHotels from '../components/RecomendedHotels'

const Home = () => {
  return (
    <>
        <Hero/>
        <RecommendedHotels/>
        <FeatureDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <NewsLetter/>
       
    </>
  )
}

export default Home
