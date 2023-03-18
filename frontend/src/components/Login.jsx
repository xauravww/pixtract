import React from "react"
// import { GoogleLogin } from "react-google-login" // depreceated now , use "@react-oauth/google" instead
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
    //-----------------------------------------
    //just checking out if it giving any response
    console.log(response)
    // -------------------------------------------

    localStorage.setItem("user", JSON.stringify(response))
    var decodedHeader = jwt_decode(response.credential)
    console.log(decodedHeader)
    const { name, sub, picture } = decodedHeader
    // in older version of api it was name , googleId , imageUrl
    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture
    }
    client.createIfNotExists(doc).then(() => {
      console.log("sub or id  is" + " " + name)
      navigate("/", { replace: true })
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
                //   clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                //   render={(renderProps) => (
                //     <button
                //       type="button"
                //       className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                //       onClick={renderProps.onClick}
                //       disabled={renderProps.disabled}
                //     >
                //       <FcGoogle className="mr-4" />
                //       Sign in with Google
                //     </button>
                //   )}
                //   onSuccess={responseGoogle}
                //   onFailure={responseGoogle}
                //   cookiePolicy="single_host_origin"
                // />
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
