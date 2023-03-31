import React, { useState, useEffect } from "react"
import Masonry from "react-masonry-css"
import Pin from "./Pin.jsx"

import Spinner from "./Spinner.jsx"
const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1
}

const MasonryLayout = ({ pins }) => {
  const [loaded, setLoaded] = useState(0)
  const [total, setTotal] = useState(pins.length)

  useEffect(() => {
    if (loaded === total) {
      // All images have loaded, do something here
      console.log("All images have loaded!")
    }
  }, [loaded, total])

  const handleImageLoad = () => {
    setLoaded((prevState) => prevState + 1)
  }

  return (
    <>
      {/* {total === 0 && <Spinner message="No pin found..." />} */}
      {total > 0 && (
        <>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex animate-slide-fwd"
            columnClassName="my-masonry-grid_column"
          >
            {pins.map((pin, index) => (
              <Pin key={index} pin={pin} onLoad={handleImageLoad} />
            ))}
          </Masonry>
          {/* {loaded < total && <div>Loading more pins...</div>} */}
        </>
      )}
    </>
  )
}

export default MasonryLayout
