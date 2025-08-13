import Box from '@mui/joy/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import GridViewIcon from '@mui/icons-material/GridView';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScheduleIcon from '@mui/icons-material/Schedule';

import TokenIcon from '@mui/icons-material/Token';
import { Grid, Typography } from '@mui/material';
import { useState,useEffect } from 'react';
import { useCookies } from 'react-cookie'
import Analytics from './Analytics';
import Summary from './Summary';
import { useNavigate } from 'react-router-dom';
const Dashbaord = () => {
    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const today=new Date();

    const currHr=today.getHours();
    const navigate=useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["cookie"]);
useEffect(() => {
  const token = cookies.cookie
  if (!token) {
    navigate('/login', { replace: true })
  }
}, [cookies, navigate])

const handleLogout=()=>{
removeCookie("cookie");
navigate('/login')
}
  return (
    <Box sx={{display:'flex' ,height:'100vh'}}>
    <Box sx={{ display: 'flex',bgcolor:'#fbfcfe' ,width:'15%',height:'100vh'}}>
        <Box role="presentation" sx={{display: 'flex',flexDirection:'column',justifyItems:"space-between",width:'100%'}}>
          <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',mb:4,mt:3,gap:2}}>
            <TokenIcon sx={{fontSize:'30px'}}/>
           <Typography sx={{fontSize:"20px"}}> FinanceMng</Typography>
          </Box>
          <List sx={{display: 'flex',alignItems:"center",justifyItems:'center'}}>
            {[['Dashboard',<GridViewIcon key="icone"/>], ['Analytics',<BarChartIcon key='Analytics'/>], ['Budgets',<DonutSmallIcon key="Budgets"/>]].map(([text,icon]) => (
              <ListItem key={text} sx={{my:1,width:'70%'}}>
                <ListItemButton onClick={() => setSelectedPage(text)} sx={{borderRadius:"10px",justifyContent:'center',bgcolor:text==selectedPage ? '#f0ecfc':''  }}>{icon} {text}</ListItemButton>
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
<Box sx={{ width: '85%', p: 4 }}>

   <Grid container spacing={2} sx={{ flexGrow: 1 ,justifyContent:'center',alignItems:'center' }}>
     <Grid size={4}>
    { 
     currHr<12 ? <Typography variant='h4' sx={{fontWeight:'bold',fontStretch:'extra-expanded', fontFamily: 'Roboto Flex',}}>Good morning , Chetan</Typography>
     : currHr <18 ? <Typography variant='h4'>Good afternoon</Typography>
     : <Typography variant='h4'>Good evening</Typography>
    }
  </Grid>
  <Grid size={8} sx={{display:'flex',justifyContent:'end',alignItems:'center'}}>
    <Typography sx={{mr:1,fontFamily:'cursive'}}>Chetax</Typography>
    <img src="https://picsum.photos/200/300" alt="userprofile" style={{borderRadius:"50%",height:'50px',width:'60px',cursor:'pointer'}} onClick={()=>navigate('/profile')}/>

  </Grid>
   </Grid>
    {selectedPage==='Dashboard' ? <Summary/> :
     selectedPage==='Analytics' ? <Analytics/>: 
     selectedPage
    }
     
  </Box>
    </Box>

  );
}

export default Dashbaord