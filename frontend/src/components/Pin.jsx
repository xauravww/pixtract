import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { client, urlFor } from "../client"
import { fetchUser } from "../utils/fetchUser"
import jwt_decode from "jwt-decode"
const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [PostHovered, setPostHovered] = useState(false)

  const user = fetchUser()
  var decodedHeader = jwt_decode(user)

  const { sub } = decodedHeader
  const alreadySaved = save?.filter(
    (item) => item?.postedBy?._id === sub
  )?.length

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: sub,
            postedBy: {
              _type: "postedBy",
              _ref: sub
            }
          }
        ])
        .commit()
        .then(() => {
          window.location.reload()
        })
    }
  }
  const deletePin = (id) => {
    client.delete(id).window.location.reload()
  }
  const navigate = useNavigate()

  const handlePinClick = (e) => {
    if (e.target.href === destination) {
      e.preventDefault()
    } else {
      navigate(`/pin-detail/${_id}`)
    }
  }

  return (
    <a href="#" onClick={handlePinClick}>
      <div className="m-2">
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
          {/* urlfor is given by sanity client to fetch images in optimized manner */}
          <img
            className="rounded-lg w-full"
            alt="user-post"
            src={urlFor(image).width(250).url()}
          />
          {PostHovered && (
            <div
              className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50 "
              style={{ height: "100%" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <a
                    href={`${image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <MdDownloadForOffline />
                  </a>
                </div>
                {alreadySaved ? (
                  <button
                    type="button"
                    className="bg-red-500 opacity-70 hover:opacity:100 text-white font-bold  px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none "
                  >
                    {save?.length} Saved
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      savePin(_id)
                    }}
                    type="button"
                    className="bg-red-500 opacity-70 hover:opacity:100 text-white font-bold  px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none "
                  >
                    Save
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center gap-2 w-full">
                {destination && (
                  <a
                    href={destination}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      console.log("clicked link")
                      e.stopPropagation()
                    }}
                    className="bg-white  flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  >
                    <BsFillArrowUpRightCircleFill />

                    {/* we don't need to cut out the link here */}
                    {destination.length > 15
                      ? `${destination.slice(0, 15)}...`
                      : destination}
                  </a>
                )}

                {/* When user who posted it and hovering it are same user then it shows a delete button */}
                {postedBy?._id === sub && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePin(_id)
                    }}
                    className="bg-white p-2 opacity-70 hover:opacity:100 text-dark font-bold   text-base rounded-3xl hover:shadow-md outline-none "
                  >
                    <AiTwotoneDelete />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <Link
          to={`user-profile/${user?._id}`}
          className="flex gap-2 mt-2 items-center"
        >
          <img
            className="w-8 h-8 rounded-full object-cover "
            src={postedBy?.image}
            alt="user-profile"
          />
          <p className="font-semibold capitalize">{postedBy?.userName}</p>
        </Link>
      </div>
    </a>
  )
}

export default Pin
