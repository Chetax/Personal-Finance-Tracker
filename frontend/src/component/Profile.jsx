import { Box, colors, Container, Typography } from '@mui/material'
import React, { useState } from 'react'


const Profile = () => {
  return (
   <Container sx={{display:'flex' ,justifyContent:'center',alignItems:'center',height:'100vh',bgcolor:"black"}}>
   <Box sx={{bgcolor:'green',height:'70vh',width:"50vw"}}>
    <Box sx={{display:'flex'}}> 
         <Typography>Name</Typography>
         <input type="text" />
    </Box>
   </Box>
   </Container>
  )
}

export default Profile