import FeedSection from '@/components/FeedSection'
import Navbar from '@/components/Navbar'
import UserProfile from '@/components/ProfileBar'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/utils/axiosConfig'
import React from 'react'


const Home = () => {

  return (
    <div>
        <Navbar/>
        <UserProfile/>
        <FeedSection/>
    </div>
  )
}

export default Home
