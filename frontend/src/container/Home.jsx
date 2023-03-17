import React, { useState, useRef, useEffect } from "react"
import { HiMenu } from "react-icons/hi"
import { AiFillCloseCircle } from "react-icons/hi"
import { Link, route, Routes } from "react-router-dom"

// import { Sidebar, UserProfile } from "../components/index.js"
import Sidebar from "../components/Sidebar"
import Pins from "./Pins"
import { client } from "../client"
import logo from "../assets/logopix.png"
const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out ">
      <div className="hidden md:flex h-screen flex-initial ">
        <Sidebar />
      </div>
      <div className="flex md:hidden flex-row">
        <HiMenu
          fontSize={40}
          className="cursor-pointer"
          onClick={() => setToggleSidebar(false)}
        />
      </div>
    </div>
  )
}

export default Home
