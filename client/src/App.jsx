import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Questions from './pages/Questions';
import AdminQuestions from './pages/AdminQuestions';
import Question from './pages/Question';
import Login from './pages/Login';
import { AuthProvider, useAuthData } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuthCallback from './components/OAuthCallback';
import Signup from './pages/Signup';
import SerchQuestion from './pages/SerchQuestion';



function App() {


  return (
    <>
    
    <AuthProvider>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>

      <BrowserRouter>
        <Routes>
          <Route>
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
            <Route path='/' element={<Home/>}/>
            <Route path='/question/:id' element={<Question />}/>
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path='/questionSearch/:keyword' element={<SerchQuestion/>} />
            <Route
            path="/questions"
            element={<ProtectedRoute element={<Questions />} />}
          />
          <Route
            path="/adminQuestions"
            element={<ProtectedRoute element={<AdminQuestions />} />}
          />
          </Route>
        </Routes>
      </BrowserRouter>
      
<ToastContainer />
      </AuthProvider>
    </>
  )
}

export default App
