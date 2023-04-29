import React, { useState, useEffect } from "react"
import { MdDownloadForOffline } from "react-icons/md"
import { Link, useParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

import { client, urlFor } from "../client"
import MasonryLayout from "./MasonryLayout"
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data"
import Spinner from "./Spinner"

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState("")
  const [AddingComment, setAddingComment] = useState(false)

  const { pinId } = useParams()

  // Define the function to delete a comment from the current pin
  const deleteComment = (commentId) => {
    // Use the Sanity client to patch the current pin, removing the specified comment
    client
      .patch(pinId)
      .unset([`comments[${commentId}]`])
      .commit()
      .then(() => {
        console.log("ho gyi delete")
        fetchPinDetails()
      })
  }

  const addComment = () => {
    if (comment) {
      setAddingComment(true)

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user?._id
            }
          }
        ])
        .commit()
        .then(() => {
          fetchPinDetails()
          setComment("")
          setAddingComment(false)
        })
    }
  }
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0])

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0])
          client.fetch(query).then((res) => setPins(res))
        }
      })
    }
  }
  useEffect(() => {
    console.log(user)
    fetchPinDetails()
  }, [pinId])

  if (!pinDetail) return <Spinner message="Loading pin." />
  return (
    <>
      <div
        className=""
        // style={{ overflowY: "hidden" }}
      >
        <div
          className="flex xl:flex-row flex-col m-auto bg-white py-3 px-3 shadow-lg "
          style={
            {
              // maxWidth: "1500px",
              // borderRadius: "32px",
              // minHeight: "calc(100vh - 4rem)"
            }
          }
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              src={pinDetail?.image && urlFor(pinDetail.image).url()}
              className="h-full rounded-t-3xl rounded-b-lg"
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-630">
            <div className="flex items-center justify-between bg-gray-100 rounded-md p-3">
              <div className="flex gap-2 items-center ">
                <a
                  href={`${pinDetail.image?.asset?.url}?dl=`}
                  download
                  className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-dark text-2xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a
                href={pinDetail.destination}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {pinDetail.destination}
              </a>
            </div>

            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about} </p>
            </div>
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg p-3 shadow-md"
            >
              <img
                className="w-8 h-8 rounded-full object-cover "
                src={pinDetail?.postedBy?.image}
                alt="user-profile"
              />
              <p className="font-semibold capitalize">
                {pinDetail.postedBy?.userName}
              </p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {/* // Render the comments section, including a delete button for each
            comment if the comment was posted by the current user */}
              {pinDetail?.comments?.map((comment, i) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg p-3 shadow-md"
                  key={i}
                >
                  <img
                    src={comment?.postedBy?.image}
                    alt="user-profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4 w-full">
                    <p className="text-gray-800 font-semibold">
                      {comment.postedBy?.userName}
                    </p>
                    <div className="flex-1 ml-4">
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                    {comment.postedBy?._id === user?._id && (
                      <button
                        onClick={() => {
                          deleteComment(i)
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 font-semibold text-sm outline-none flex-shrink-0"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`user-profile/${user?._id}`}>
                <img
                  className="w-10 h-10 rounded-full cursor-pointer shadow-md"
                  src={user?.image}
                  alt="user-profile"
                />
              </Link>
              <input
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 shadow-md"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none shadow-md"
                onClick={addComment}
              >
                {AddingComment ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  )
}

export default PinDetail
