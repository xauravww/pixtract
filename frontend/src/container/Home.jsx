import React, { useState, useRef, useEffect } from "react"
import { HiMenu } from "react-icons/hi"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { Link, Route, Routes } from "react-router-dom"

import { Sidebar, UserProfile } from "../components/index.js"
// import Sidebar from "../components/Sidebar"
import Pins from "./Pins"
import { userQuery } from "../utils/data.js"
import { client } from "../client"
import logo from "../assets/logopix.png"

import jwt_decode from "jwt-decode"
import { fetchUser } from "../utils/fetchUser.js"
const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null)

  // const userInfo =
  //   localStorage.getItem("user") !== "undefined"
  //     ? JSON.parse(localStorage.getItem("user"))
  //     : localStorage.clear()

  const userInfo = fetchUser()

  var decodedHeader = jwt_decode(userInfo)

  const { sub } = decodedHeader

  useEffect(() => {
    // const query = userQuery(userInfo?.googleId)
    const query = userQuery(sub)
    console.log(query)
    client.fetch(query).then((data) => {
      setUser(data[0]) // again a state
      // console.log(user)
    })
  }, [])

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out ">
      <div className="hidden md:flex h-screen flex-initial ">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="px-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28 h-13" />
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
        {/* adding toggle condition*/}
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiOutlineCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            {/* if user exists */}
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll " ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:sub" element={<UserProfile />}></Route>
          {/* making our above code dynamic using :sub  and we have to use sub in case of useParams there*/}
          <Route path="/*" element={<Pins user={user && user} />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default Home
