import { Container ,Box} from '@mui/material'
import React, { useEffect, useId } from 'react'
import { useMemo ,useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import InputIcon from '@mui/icons-material/Input';
import OutboundIcon from '@mui/icons-material/Outbound';
import { useUser } from '../context/UserContext';
const Summary = () => {
 const [selectedType, setSelectedType] = useState('expense');
 const [getAllIncome,setAllIncome]=useState(0);
 const { userId } = useUser();
 const [getAllExpense,setAllExpense]=useState(0);
const [cookies] = useCookies(['cookie'])
 const fullData = [
  { month: 'Jan', income: 2000, expense: 1500 },
  { month: 'Feb', income: 1800, expense: 1200 },
  { month: 'Mar', income: 2200, expense: 1600 },
  { month: 'Apr', income: 2500, expense: 1900 },
  { month: 'May', income: 2100, expense: 1700 },
  { month: 'Jun', income: 2300, expense: 1800 },
  { month: 'Jul', income: 2400, expense: 1850 },
  { month: 'Aug', income: 2600, expense: 1950 },
  { month: 'Sep', income: 2700, expense: 2000 },
  { month: 'Oct', income: 2800, expense: 2200 },
  { month: 'Nov', income: 3000, expense: 2100 },
  { month: 'Dec', income: 3200, expense: 2300 },
];
const dummyData = [
  {
    categories: 'Food',
    Data: '12 Aug 2025',
    status: 'Credit',
    Amount: '5000',
    user_id: '1',
  },
  {
    categories: 'Travel',
    Data: '10 Aug 2025',
    status: 'Debit',
    Amount: '1500',
    user_id: '2',
  },
  {
    categories: 'Shopping',
    Data: '05 Aug 2025',
    status: 'Credit',
    Amount: '3000',
    user_id: '1',
  },
  {
    categories: 'Bills',
    Data: '01 Aug 2025',
    status: 'Debit',
    Amount: '2000',
    user_id: '3',
  },
];

const getLast6MonthsData = (data) => {
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0 = Jan, 11 = Dec
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const index = (currentMonthIndex - i + 12) % 12;
    months.push(data[index]);
  }

  return months;
};
 
const chartData = useMemo(() => getLast6MonthsData(fullData), []);

useEffect(() => {
  if (!userId) return;

  const fetchData = async () => {
    try {
      const token = cookies.cookie;
      const response = await axios.get(`http://127.0.0.1:8000/api/finance/incomes/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Fetched income:', response.data);
  
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  fetchData();
}, [userId]);


  return (
   <Box sx={{my:5}}>


   <Box sx={{display:'flex' ,gap:5}}>
   
   <Box sx={{height:160, width:150,bgcolor:"#bce5c5"}}>
   <Box sx={{height:'40%',width:"100%",bgcolor:'#d8f1e0',borderBottomRightRadius:'30%',borderBottomLeftRadius:'15%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <Box sx={{display:"flex" ,flexDirection:'column',p:1}}>
     <InputIcon/>
     Income
    </Box>
    <Box sx={{p:1}}>
      <MoreVertIcon/>
    </Box>
   </Box>
   </Box>

   <Box sx={{height:160, width:150,bgcolor:"#d5c8f6"}}>
   <Box sx={{height:'40%',width:"100%",bgcolor:'#e3d7f9',borderBottomRightRadius:'30%',borderBottomLeftRadius:'15%',display:'flex',justifyContent:'space-between'}}>
    <Box sx={{display:"flex" ,flexDirection:'column',p:1}}>
     <OutboundIcon/>
     Expense
    </Box>
    <Box sx={{p:1}}>
      <MoreVertIcon/>
    </Box>
   </Box>
   </Box>

   <Box>
<div style={{ padding: '0px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
   <h2 style={{  textAlign: 'center' }}>
    Monthly {selectedType === 'income' ? 'Income' : 'Expense'} Overview
  </h2>
    <div style={{ marginTop: '15px', textAlign: 'center' }}>
    <label htmlFor="typeSelect" style={{ marginRight: '10px' }}>Select Type:</label>
    <select
      id="typeSelect"
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
    >
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
  </div>
  <div style={{ width: '40vw', height: 200 }}>
    <ResponsiveContainer>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey={selectedType}
          fill={selectedType === 'income' ? '#82ca9d' : '#8884d8'}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>


 
</div>

   </Box>
  
    </Box>

    {/* get all tracation of user  */}

    <Box>
     <TableContainer component={Paper} sx={{ margin: 'auto', marginTop: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>categories</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>status</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.categories}</TableCell>
              <TableCell>{row.Data}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <Typography
                  component="span"
                  sx={{
                    color: row.status.toLowerCase() === 'credit' ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {row.Amount}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
   </Box>
  )
}

export default Summary