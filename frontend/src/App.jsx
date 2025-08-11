import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import NotFound from './component/NotFound';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Dashbaord from './component/Dashbaord';
import Profile from './component/Profile';
import ForgotPassword from './component/ForgotPassword'

function App() {
  let isAuthentica=true;
  return (
    <Routes>
        <Route path="*" element={<NotFound/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path='/dashboard' element={isAuthentica ? <Dashbaord/> : <Navigate to="/login" replace/>}></Route>
        <Route path='/profile' element={isAuthentica ? <Profile/> : <Navigate to="/login" replace/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
    </Routes> 
  )
}

export default App
