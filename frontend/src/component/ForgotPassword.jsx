import { Box, Button, Container, Typography, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
const ForgotPassword = () => {
  const [password,setPassword]=useState('');
  const [conformPass,setConformPass]=useState('');
  const navigate=useNavigate();
  
  const handleSubmit=(e)=>{

    e.preventDefault();
    if(password===conformPass)
    {
     
      try{
        const user=axios.get("http://127.0.0.1:8000/api/user/",{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        
      }catch(err){
        console.log(err)
        toast.error("something wents wrong")
      }


      toast.success('Sucess',"Password Reset Successfully")
      navigate('/login')
    }
    else 
    {
       toast.error('Failure',"Conform password not matches with password")
    }

  }
  return (
   <div style={{backgroundColor:"#051221",overflow:'hidden'}}>
    <Container sx={{ height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ p: 7, width: 400, border: '1px solid black', borderRadius: '4px', boxShadow: '1px 2px 2px 1px',bgcolor:'white' }}>
       <form onSubmit={handleSubmit}>
                <Typography variant='h4' sx={{ mb: 5, textAlign: 'center' }}>Forgot Password</Typography>
  
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Enter Password"
                    type='password'
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </Box>
      
                <Box sx={{ mb: 3 }}>
                  <TextField
                   fullWidth
                    label="Comform Password"
                    type='password'
                    required
                     value={conformPass}
                    onChange={(e)=>setConformPass(e.target.value)}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                  <Button type='submit' variant='contained'>Reset Password</Button>
                </Box>
              </form>
        
      </Box>
    </Container>
    </div>
  )
}

export default ForgotPassword