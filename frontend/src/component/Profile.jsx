import { Box, Button, Container, Typography, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TokenIcon from '@mui/icons-material/Token'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useCookies } from 'react-cookie'
import toast from 'react-hot-toast'
import { useUser } from '../context/UserContext';


const Profile = () => {
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('https://picsum.photos/200/300')
  const [cookies] = useCookies(['cookie'])
  const navigate = useNavigate()
const { userId } = useUser();

  // Fetch user info on mount
useEffect(() => {
  const fetchUserProfile = async () => {
    if (!userId) return; // Wait for userId to be ready

    try {
      const token = cookies.cookie;

      const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data;
      setName(user.name || '');
      setEmail(user.email || '');
      setImage(user.profile_picture || 'https://picsum.photos/200/300');
      console.log(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load profile.');
    }
  };

  fetchUserProfile();
}, [userId]); // Depend on userId so it refetches once it's set


  const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to delete your profile? This action is irreversible.')) {
    return
  }

  try {
    const token = cookies.cookie
    const decoded = jwtDecode(token)
    const userId = decoded.user_id

    await axios.delete(`http://127.0.0.1:8000/api/user/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    toast.success('Profile deleted successfully!')
    navigate('/register') // or navigate to login or home, depending on app flow
  } catch (error) {
    console.error('Error deleting profile:', error)
    toast.error('Failed to delete profile.')
  }
}

  // Submit updated data
  const handleUpdate = async () => {
    try {
      const token = cookies.cookie
      const decoded = jwtDecode(token)
      const userId = decoded.user_id

      const response = await axios.put(
        `http://127.0.0.1:8000/api/user/${userId}/`,
        {
          name,
          email,
          profile_picture: image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Profile updated successfully!')
      setEdit(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile.')
    }
  }

  return (
    <div>
      <Container>
        {/* Header */}
        <Box sx={{ display: 'flex', mb: 4, mt: 3, gap: 2, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <TokenIcon sx={{ fontSize: '30px' }} />
          <Typography sx={{ fontSize: '20px' }}>FinanceMng</Typography>
        </Box>

        {/* Profile Top */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 6 }}>
            <img src={image} alt="profile" style={{ borderRadius: '50%', height: '100px', width: '100px', marginRight: '15px' }} />
            <Box>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="subtitle1" sx={{ color: '#d4d4d7' }}>
                {email}
              </Typography>
            </Box>
          </Box>
          <Box>
            {!edit ? (
              <Button variant="contained" onClick={() => setEdit(true)}>
                Edit
              </Button>
            ) : (
              <Button variant="contained" sx={{ bgcolor: '#00e676' }} onClick={handleUpdate}>
                Submit
              </Button>
            )}
          </Box>
        </Box>

        {/* Editable Fields */}
        <Box>
          <Box>
            <Typography variant="h6">Name</Typography>
            <TextField
              sx={{ width: '50%', my: 4 }}
              label="Enter Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{ readOnly: !edit }}
            />
          </Box>

          <Box>
            <Typography variant="h6">Email</Typography>
            <TextField
              sx={{ width: '50%', my: 4 }}
              label="Enter Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{ readOnly: !edit }}
            />
          </Box>

          <Box>
            <Typography variant="h6">Image URL</Typography>
            <TextField
              sx={{ width: '50%', my: 4 }}
              label="Image URL"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              InputProps={{ readOnly: !edit }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <Typography variant="h6">Delete Your Profile</Typography>
            <Button variant="contained" sx={{ bgcolor: 'red', mx: 6, cursor: 'pointer' }}>
              Delete
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default Profile
