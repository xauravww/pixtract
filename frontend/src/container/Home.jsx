import React, { useState, useRef, useEffect } from "react"
import { HiMenu } from "react-icons/hi"
import { AiFillCloseCircle } from "react-icons/hi"
import { Link, route, Routes } from "react-router-dom"

import { Sidebar, UserProfile } from "../components/index.js"
// import Sidebar from "../components/Sidebar"
import Pins from "./Pins"
import { userQuery } from "../utils/data.js"
import { client } from "../client"
import logo from "../assets/logopix.png"

import jwt_decode from "jwt-decode"
const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)

  // const userInfo =
  //   localStorage.getItem("user") !== "undefined"
  //     ? JSON.parse(localStorage.getItem("user"))
  //     : localStorage.clear()

  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? localStorage.getItem("user")
      : localStorage.clear()

  var decodedHeader = jwt_decode(userInfo)

  const { sub } = decodedHeader

  useEffect(() => {
    // const query = userQuery(userInfo?.googleId)
    const query = userQuery(sub)
    console.log(query)
    client.fetch(query).then((data) => {
      setUser(data[0]) // again a state
    })
  }, [])

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
        <Link to="/">
          <img src={logo} alt="logo" className="w-28" />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          {/* <img src={user?.image} alt="logo" className="w-28" /> */}
          <img
            src={user?.image}
            alt="user-pic"
            className="w-9 h-9 rounded-full"
          />
        </Link>
      </div>
    </div>
  )
}

export default Home
