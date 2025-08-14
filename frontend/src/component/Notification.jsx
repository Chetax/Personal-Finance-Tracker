import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  TableContainer,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import ClipLoader from 'react-spinners/ClipLoader';

const Notification = () => {
  const [cookies] = useCookies(['cookie']);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const token = cookies.cookie
  if (!token) {
    navigate('/login', { replace: true })
  }
    const getNotifications = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/finance/notifications/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [cookies]);

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClipLoader size={60} color="#5e35b1" loading={loading} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography>No notifications found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell>ID</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  sx={{
                    backgroundColor: notification.read ? '#ffffff' : '#f9f5ff',
                  }}
                >
                  <TableCell>{notification.id}</TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>
                    {new Date(notification.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Notification;
