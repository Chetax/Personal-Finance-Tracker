import { Box, Button, Container, Typography, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name,setName]=useState('');
    const [profile,setProfile]=useState('');

    const navigate = useNavigate();
    const handleSubmit = (e) => {
       toast.success('Register successful!');
    e.preventDefault();
    console.log({profile,name, email, password });
  };
  return (
        <div style={{backgroundColor:"#051221",overflow:'hidden'}}>
     <Container sx={{ height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ p: 7, width: 450, border: '1px solid black', borderRadius: '4px', boxShadow: '1px 2px 2px 1px',bgcolor:'white' }}>
            <form onSubmit={handleSubmit}>
              <Typography variant='h4' sx={{ mb: 5, textAlign: 'center' }}>Register</Typography>

  

              <Box sx={{ mb: 3 }}>
                  <TextField
                  fullWidth
                  label="Enter Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Box>

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
      <Box sx={{ mb: 6 }}>
                  <TextField
                  fullWidth
                  label="Image url"
                  type="text"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 6 }}>
                <Button type='submit' variant='contained'>Register</Button>
                <Typography variant='h6'>OR</Typography>
                <Button variant='outlined' onClick={() => navigate('/login')}>Login</Button>
              </Box>
              
            </form>
          </Box>
        </Container>
        </div>
  )
}

export default SignUp