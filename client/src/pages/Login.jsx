import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player'
import { FaGoogle } from "react-icons/fa";
import { useAuthData } from "@/context/AuthContext";
import loginani from "../../public/AnimationLogin.json"
import logo from "../../public/qultrLogo.png"
import googleLogo from "../../public/search.png"

const Login = () => {
    const { isSignedIn,login ,googleLogin} = useAuthData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
  const navigate = useNavigate(); 
  useEffect(()=>{
    if(isSignedIn){
        navigate("/"); 
    }
  },[isSignedIn])
    
    const handleLogin = () => {
        
        if(!email || !password){
            toast.error("Some fields are empty")
        }
        else{
        login( email,password );
   
    }
      };
  return (
    <div className="flex flex-wrap h-max w-2/3 m-auto max-md:w-full">
      <div className="w-1/2 h-full m-auto rounded-none border-0 max-md:w-full">
      <Lottie
      loop
      animationData={loginani}
      play
      style={{ width: "100%", border:"none", boxShadow:"none", height: "100%" }}

>
</Lottie>
      </div>
    <div className="flex-col w-1/2 m-auto max-md:w-full justify-center items-center">
      <Card className=" bg-gradient-to-br  from-[#c7f5a5] to-[#c7f5a5] rounded-xl p-0 shadow-lg ">
        <CardHeader className="text-center">
            <div className="flex flex-row justify-center"><img
            src={logo}
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="ml-3 text-xl font-bold align-middle my-auto text-gray-800">Qulth</span>
</div>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-gray-500">
            Welcome back, Login to continue
          </p>
        </CardHeader>
        <CardContent>
            <div className="flex sm:px-12 justify-center items-center align-middle">
        <button
        onClick={googleLogin}
        className="w-full px-4 py-2 flex justify-center items-center align-middle bg-[#81f82c] text-black rounded"
      >
        <img src={googleLogo} className="mx-3" width={25} height={25} alt="google_logo"></img> <span className="m-auto ">Continue with Google </span>
      </button>
      </div>
      <div className="flex flex-row items-center justify-evenly">
        <span className="w-2/5 mt-1 border-t-2 border-gray-500"></span>
      <p className="text-center m-2 w-1/5 ">OR</p>
      <span className="w-2/5 mt-1 border-t-2 border-gray-500"></span>
      </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 bg-[#e0ffca] outline-none focus:ring-0 text-gray-700  border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#e0ffca] mt-2 outline-none focus:ring-0 text-gray-700  border border-gray-300 rounded-lg focus:outline-none  focus:ring-indigo-400"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            onClick={()=>{handleLogin()}}
            className="w-full px-4 py-2 text-black bg-[#81f82c] rounded-lg hover:bg-[#6A669D] hover:text-white focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Login
          </button>
          <div className=" flex ml-2 justify-start">
            <Link className="text-left text-gray-600 hover:text-black text-sm" to={"/signup"}>New here? Signup</Link>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default Login;
