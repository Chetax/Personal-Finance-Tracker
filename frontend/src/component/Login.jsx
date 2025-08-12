import { Box, Button, Container, Typography, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
const Login = () => {
  const {userId, setUserId } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 const [cookies, setCookie, removeCookie] = useCookies(['cookieName']);

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
      email,
      password
    });
    const token = response.data;

    toast.success('Login successful!');
    setCookie('cookie', token.access, { path: '/' });
    const decoded = jwtDecode(token.access)
   console.log("Decoded token:", decoded);
    setUserId(decoded.user_id);
    console.log("Set userId:", decoded.user_id);
      console.log("Set userId:", userId);
    
    navigate('/dashboard');
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.detail || 'Login failed');
    } else {
      toast.error('Something went wrong!');
    }
    console.error('Login error:', error);
  }
};

  return (
       <div style={{backgroundColor:"#051221",overflow:'hidden'}}>
    <Container sx={{ height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ p: 7, width: 400, border: '1px solid black', borderRadius: '4px', boxShadow: '1px 2px 2px 1px',bgcolor:'white'  }}>
        <form onSubmit={handleSubmit}>
          <Typography variant='h4' sx={{ mb: 5, textAlign: 'center' }}>Login</Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5}}>
                  <Typography variant='subtitle-1' sx={{cursor:'pointer'}} onClick={()=>{
                    navigate('/forgotPassword')
                  }}>Reset Password</Typography>
                </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 6 }}>
            <Button type='submit' variant='contained'>Login</Button>
            <Typography variant='h6'>OR</Typography>
            <Button variant='outlined' onClick={() => navigate('/signup')}>Register</Button>
          </Box>
        </form>
      </Box>
    </Container>
    </div>
  )
}

export default Login
