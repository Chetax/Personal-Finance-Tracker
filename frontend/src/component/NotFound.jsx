import {colors, Container} from '@mui/material';
import Typography from '@mui/material/Typography';
const NotFound = () => {
  return (
    <Container sx={{ height:'100vh',display:'flex',justifyContent:"center",alignItems:"center"}}>
   <Typography variant='h4' sx={{color:'grey'}}>404 - Page Not Found</Typography> 
    </Container>
  )
}

export default NotFound