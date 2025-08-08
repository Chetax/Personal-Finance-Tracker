import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import NotFound from './component/NotFound';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Dashbaord from './component/Dashbaord';
function App() {
  let isAuthentica=true;
  return (
    <Routes>
        <Route path="*" element={<NotFound/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path='/dashboard' element={isAuthentica ? <Dashbaord/> : <Navigate to="/login" replace/>}></Route>
    </Routes>
  )
}

export default App
