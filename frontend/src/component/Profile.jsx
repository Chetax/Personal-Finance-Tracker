import { Box, Button, Container, Typography ,TextField} from '@mui/material'
import React, { useEffect, useState } from 'react'
import TokenIcon from '@mui/icons-material/Token';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
const [edit,setEdit]=useState(false);
const [name,setName]=useState('Chetan')
const [email,setEmail]=useState('chex@gmail.com')
const [image,setImage]=useState('https://picsum.photos/200/300');
const navigate=useNavigate();  

  return (
   <div>
    <Container>
      {/* Header which has  profile and edit and delete  */}
       <Box sx={{display:'flex',mb:4,mt:3,gap:2,cursor:'pointer'}} onClick={()=>{
            navigate('/dashboard')
           }}>
            <TokenIcon sx={{fontSize:'30px'}}/>
           <Typography sx={{fontSize:"20px"}}  > FinanceMng</Typography>
          </Box>

      <Box>
        <Box sx={{display:'flex' ,alignItems:'center',justifyContent:'space-between'}}>
       <Box sx={{display:"flex",alignItems:'center',my:6,}}>
        <img src="https://picsum.photos/200/300" alt="profile" style={{borderRadius:"50%",height:"100px",width:'100px',marginRight:"15px"}} />
        <Box>
        <Typography variant='h6'>Chetan Padhen</Typography>
        <Typography variant='subtitle1' sx={{color:'#d4d4d7'}}> Chex@gmail.com</Typography>
        </Box>
       </Box>
       <Box>
        {
          !edit ? <Button variant='contained' onClick={()=>{setEdit(!edit)}}>Edit</Button> : <Button variant='contained'sx={{bgcolor:"#00e676"}} onClick={()=>{setEdit(!edit)}}>Submit</Button>
        }
        
       </Box>

        </Box>
      {/* We fetch the data and show here */}
      <Box>
       
       <Box>
        <Typography variant='h6' >Name</Typography>
         <TextField
                     sx={{width:"50%",my:4}}
                      label="Enter Name"
                      type="text"
                    
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      InputProps={{
                        readOnly:!edit
                      }}
                    />
       </Box>

        <Box>
        <Typography variant='h6'>Email</Typography>
            <TextField
                      sx={{width:"50%",my:4}}
                      label="Enter Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                        InputProps={{
                        readOnly:!edit
                      }}
                    />
       </Box>

        <Box>
        <Typography variant='h6'>Url</Typography>
        <TextField
                      sx={{width:"50%",my:4}}
                      label="Image url"
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required  InputProps={{
                        readOnly:!edit
                      }}
                    />
       </Box>
        <Box sx={{display:'flex'  ,alignItems:'center',mb:6}}>
        <Typography variant='h6'>Delete Your Profile </Typography>
        <Button variant='contained'  sx={{bgcolor:"red",mx:6,cursor:'pointer'}}> Delete</Button>
       </Box>
      </Box>



      </Box>
    </Container>
   </div>
  )
}

export default Profile