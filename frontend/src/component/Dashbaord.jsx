import Box from '@mui/joy/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import GridViewIcon from '@mui/icons-material/GridView';
import BarChartIcon from '@mui/icons-material/BarChart';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios'
import { useUser } from '../context/UserContext';
import TokenIcon from '@mui/icons-material/Token';
import { Grid, Typography } from '@mui/material';
import { useState,useEffect } from 'react';
import { useCookies } from 'react-cookie'
import Analytics from './Analytics';
import Summary from './Summary';
import { useNavigate } from 'react-router-dom';
const Dashbaord = () => {
   const { userId } = useUser();

  const [selectedPage, setSelectedPage] = useState(() => {
  return localStorage.getItem('selectedPage') || 'Dashboard';
});
    const [username,setUsername]=useState('');
    const [loading, setLoading] = useState(true);
    const today=new Date();
    const currHr=today.getHours();
    const navigate=useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["cookie"]);
    const handlePageChange = (page) => {
  setSelectedPage(page);
  setLoading(true);
  localStorage.setItem('selectedPage', page);
};

useEffect(() => {
  const token = cookies.cookie
  if (!token) {
    navigate('/login', { replace: true })
  }
 const getInfo =async()=>{
  try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data[0];
      setUsername(user.name.trim().split(" ").filter(Boolean)[0]);

      setTimeout(() => {
        setLoading(false);
      }, 500);
    }catch(err){
      console.log(err);
      setLoading(false); 
    }
    }
    getInfo()
}, [cookies, navigate,selectedPage])

const handleLogout=()=>{
removeCookie("cookie");
navigate('/login')
}
  return (
    <Box sx={{display:'flex' }}>
    <Box sx={{ display: 'flex',bgcolor:'#fbfcfe' ,width:'15%',height:'100vh',position:'fixed',zIndex:4}}>
        <Box role="presentation" sx={{display: 'flex',flexDirection:'column',justifyItems:"space-between",width:'100%'}}>
          <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',mb:4,mt:3,gap:2}}>
            <TokenIcon sx={{fontSize:'30px'}}/>
           <Typography sx={{fontSize:"20px"}}> FinanceMng</Typography>
          </Box>
          <List sx={{display: 'flex',alignItems:"center",justifyItems:'center'}}>
            {[['Dashboard',<GridViewIcon key="icone"/>], ['Analytics',<BarChartIcon key='Analytics'/>]].map(([text,icon]) => (
              <ListItem key={text} sx={{my:1,width:'70%'}}>
                <ListItemButton onClick={() => handlePageChange(text)} sx={{borderRadius:"10px",justifyContent:'center',bgcolor:text==selectedPage ? '#f0ecfc':''  }}>{icon} {text}</ListItemButton>
              </ListItem>
            ))}
          </List>
          <List sx={{display: 'flex',alignItems:"center",justifyContent:'end',mb:4}}>
            {[[ 'Logout',<LogoutIcon key="logout"/>]].map(([text,icon]) => (
              <ListItem key={text} sx={{my:1}}>
                <ListItemButton onClick={handleLogout} sx={{borderRadius:"10px"}}>   {icon} {text}</ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
</Box>

{
  loading ?  <Box sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ClipLoader size={60} color="#5e35b1" loading={loading} />
      </Box> : (<>
  <Box sx={{ width: '85%', p: 4,ml:"14%" }}>

   <Grid container spacing={2} sx={{ flexGrow: 1 ,justifyContent:'center',alignItems:'center' }}>
     <Grid size={4}>
    { 
     currHr<12 ? <Typography variant='h4' sx={{fontWeight:'bold',fontStretch:'extra-expanded', fontFamily: 'Roboto Flex',}}>Good morning , {username}</Typography>
     : currHr <18 ? <Typography variant='h4'>Good afternoon , {username}</Typography>
     : <Typography variant='h4'>Good evening , {username}</Typography>
    }
  </Grid>
  <Grid size={8} sx={{display:'flex',justifyContent:'end',alignItems:'center'}}>
    <Typography sx={{mr:1,fontFamily:'cursive'}}>{username}</Typography>
    <img src="https://picsum.photos/200/300" alt="userprofile" style={{borderRadius:"50%",height:'50px',width:'60px',cursor:'pointer'}} onClick={()=>navigate('/profile')}/>

  </Grid>
   </Grid>
    {selectedPage==='Dashboard' ? <Summary/> :
  <Analytics/>

    }
     
  </Box>
  </>)
}

    </Box>
  );
}

export default Dashbaord