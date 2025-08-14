
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';


import { Grid, Typography, IconButton, Drawer } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


import TokenIcon from '@mui/icons-material/Token';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import GridViewIcon from '@mui/icons-material/GridView';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';


import Summary from './Summary';
import Analytics from './Analytics';
import Notification from './Notification';
import { useUser } from '../context/UserContext';

const Dashbaord = () => {
   const { userId } = useUser();
  const [selectedPage, setSelectedPage] = useState(() => {
  return localStorage.getItem('selectedPage') || 'Dashboard';
});
    const [username,setUsername]=useState('');
    const [userimage,setUserimage]=useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const today=new Date();
    const currHr=today.getHours();
    const navigate=useNavigate();
    const [cookies, removeCookie] = useCookies(["cookie"]);
    const handlePageChange = (page) => {
  setSelectedPage(page);
  setLoading(true);
  localStorage.setItem('selectedPage', page);
};

useEffect(() => {
const token = cookies.cookie;
  if (!token) return; // Don't even try if no token
 const getInfo =async()=>{
  try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data[0];
      setUserimage(user.image)
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


const handleLogout = () => {
  removeCookie("cookie");
  localStorage.clear(); // optional
  navigate('/login', { replace: true });
};

  return (
    <Box>
      <Box sx={{ display:{ xs: 'flex',sm: 'flex',md: 'flex',lg: 'none'},mb:4,mt:3,gap:2}}>
            <TokenIcon sx={{fontSize:'30px'}}/>
           <Typography sx={{fontSize:"20px"}}> FinanceMng</Typography>
          </Box>



    <Box sx={{display:'flex' }}>
    
    <Box sx={{  display:{ xs: 'none',sm: 'none',md: 'none',lg: 'flex'},bgcolor:'#fbfcfe' ,width:{ xs: '0',sm: '0',md: '0',lg: '15%'},height:'100vh',position:'fixed',zIndex:4}}>
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

 <Drawer
    anchor="right"
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    sx={{ display: { lg: 'none' } }} 
  >
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Welcome, {username}</Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ my: 2 }}>
        <img
          src={userimage}
          alt="profile"
          style={{ borderRadius: '50%', height: '80px', width: '80px', cursor: 'pointer' }}
          onClick={() => {
            navigate('/profile');
            setDrawerOpen(false);
          }}
        />
    
      </Box>
      <List>
        {[['Dashboard', <GridViewIcon key="icon" />], ['Analytics', <BarChartIcon key='Analytics' />]].map(([text, icon]) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => {
              handlePageChange(text);
              setDrawerOpen(false);
            }}>
              {icon}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={() => {
            handleLogout();
            setDrawerOpen(false);
          }}>
            <LogoutIcon />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  </Drawer>


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
 <Box
  sx={{
    width: {
      xs: '100%',
      sm: '100%',
      md: '100%',
      lg: '85%' 
    },
    ml: {
      xs: 0,
      sm: 0,
      md: 0,
      lg: '15%' 
    },
    p: 4
  }}
>


   <Grid container spacing={2} sx={{ flexGrow: 1 ,justifyContent:'center',alignItems:'center' }}>
     <Grid size={4}>
    { 
     currHr<12 ? <Typography variant='h4' sx={{fontWeight:'bold',fontStretch:'extra-expanded', fontFamily: 'Roboto Flex',}}>Good morning , {username}</Typography>
     : currHr <18 ? <Typography variant='h4'>Good afternoon , {username}</Typography>
     : <Typography variant='h4'>Good evening , {username}</Typography>
    }
  </Grid>
  <Grid size={8} sx={{display:'flex',justifyContent:'end',alignItems:'center'}}>

     <NotificationImportantIcon onClick={() => handlePageChange("Notification")} sx={{mx:2 ,cursor:'pointer'}} />
            <IconButton
  sx={{ display: { lg: 'none' }, ml: 1, cursor: 'pointer' }}
  onClick={() => setDrawerOpen(true)}
>

  <MenuIcon />
</IconButton>
 <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', mr: 1 }}>
 
  <Typography sx={{ mr: 1, fontFamily: 'cursive' }}>{username}</Typography>
  <img
    src="https://picsum.photos/200/300"
    alt="userprofile"
    style={{ borderRadius: "50%", height: '50px', width: '60px', cursor: 'pointer' }}
    onClick={() => navigate('/profile')}
  />

</Box>


  </Grid>
   </Grid>
    {
    selectedPage==='Dashboard' ? <Summary/> :
    selectedPage=='Notification'? <Notification/>:
  <Analytics/>
    }
  </Box>
  </>)
}

    </Box>
    </Box>
  );
}

export default Dashbaord