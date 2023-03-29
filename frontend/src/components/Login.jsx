import React from "react"
import { GoogleLogin } from "@react-oauth/google"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import logo from "../assets/logopix.png"
import share from "../assets/share.mp4"
import jwt_decode from "jwt-decode"
import { client } from "../client.js"

// Login code
const Login = () => {
  const navigate = useNavigate()

  function responseGoogle(response) {
    localStorage.setItem("user", JSON.stringify(response))
    var decodedHeader = jwt_decode(response.credential)
    const { name, sub, picture } = decodedHeader

    // Check if the user already exists in Sanity
    client.getDocument(sub).then((user) => {
      if (user) {
        console.log("new doc not creating")
        // Update the user document with the new details
        const updateUserDoc = {
          ...user,
          userName: name,
          image: picture
        }

        client
          .patch(sub)
          .set(updateUserDoc)
          .commit()
          .then(() => {
            client.getDocument(sub).then((user) => {
              console.log(user)
            })

            navigate("/", { replace: true })
          })
          .catch((error) => {
            console.error("Error updating user document: ", error)
          })
      } else {
        console.log("new doc creating")
        // Create a new user document
        const newUserDoc = {
          _id: sub,
          _type: "user",
          userName: name,
          image: picture
        }

        client
          .create(newUserDoc)
          .then(() => {
            navigate("/", { replace: true })
          })
          .catch((error) => {
            console.error("Error creating user document: ", error)
          })
      }
    })
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={share}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            >
              <GoogleLogin
                onSuccess={(codeResponse) => responseGoogle(codeResponse)}
                onError={() => {
                  console.log("Login Failed")
                }}
                size="large"
                text="Sign in with Google"
                shape="square"
                width="12px"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
