import React, { useState, useEffect, useRef } from "react"
import { Routes, Route } from "react-router-dom"

import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components"
const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("") // we wil share it with other one componnets , so we use it here
  const [searchHistory, setsearchHistory] = useState(false)
  const inputRef = useRef(null)

  const [inputValue, setInputValue] = useState("")
  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
          searchHistory={searchHistory}
          setsearchHistory={setsearchHistory}
          setInputValue={setInputValue}
        />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetail user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={
              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchHistory={searchHistory}
                setsearchHistory={setsearchHistory}
                inputValue={inputValue}
              />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default Pins
