import React from 'react'
import Hero from './components/sections/Hero'
import Categories from './components/sections/Categories'
import FeaturedProducts from './components/sections/FeaturedProducts'
import Events from './components/sections/Events'
import Partners from './components/sections/Partners'
import Trust from './components/sections/Trust'
import HowItWorks from './components/sections/HowItWorks'
import Reviews from './components/sections/Reviews'
import LastCTA from './components/sections/LastCTA'
import ScrollToTop from './components/ScrollToTop'

export default function Main() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <Categories />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Events Section */}
      <Events />

      {/* Partner Section */}
      <Partners />

      {/* Trust Section */}
      <Trust />

      {/* How it work section */}
      <HowItWorks />

      {/* Review section */}
      <Reviews />

      {/* Final Call to Action Section (Last Section before Footer) */}
      <LastCTA />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}
