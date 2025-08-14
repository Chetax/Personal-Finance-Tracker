import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import NotFound from './component/NotFound';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Dashbaord from './component/Dashbaord';
import Profile from './component/Profile';
import ForgotPassword from './component/ForgotPassword'
import { useEffect, useState } from 'react';
import Notification from './component/Notification';
function App() { 
  return (
    <Routes>
        <Route path="*" element={<NotFound/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path='/dashboard' element={<Dashbaord/>}></Route>
        <Route path='/profile' element={<Profile/> }></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/notification' element={<Notification/>}></Route>
    </Routes> 
  )
}

export default App
