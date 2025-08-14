import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

import axios from 'axios';
import { useCookies } from 'react-cookie';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InputIcon from '@mui/icons-material/Input';
import OutboundIcon from '@mui/icons-material/Outbound';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useUser } from '../context/UserContext';

const Summary = () => {
  const [selectedType, setSelectedType] = useState('expense');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cookies] = useCookies(['cookie']);
  const { userId } = useUser();
  const token = cookies.cookie;

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

  const getLast6MonthsData = (data) => {
    const now = new Date();
    const idx = now.getMonth();
    return Array.from({ length: 6 }, (_, i) => data[(idx - 5 + i + 12) % 12]);
  };
  const chartData = useMemo(() => getLast6MonthsData(fullData), []);

  useEffect(() => {
    if (!userId) return;

    const fetchAll = async () => {
      try {
        const [analyticsRes, budgetsRes, categoriesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/finance/analytics/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/finance/budgets/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/finance/categories/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAnalytics(analyticsRes.data);
        setTotalIncome(analyticsRes.data.total_incomes);
        setTotalExpense(analyticsRes.data.total_expenses);

        setBudgets(budgetsRes.data);
        setCategories(categoriesRes.data);
        console.log()
      } catch (err) {
        console.error('Error loading summary:', err);
      }
    };

    fetchAll();
  }, [userId, token]);

  if (!analytics) return <Typography>Loading summary...</Typography>;

  // Build helper maps
  const catNameToId = Object.fromEntries(categories.map(cat => [cat.name, cat.id]));
  const budgetsByCategory = Object.fromEntries(budgets.map(b => [b.category, b.amount]));

  const rows = analytics.expenses_by_category.map(({ category__name, total }) => {
    const catId = catNameToId[category__name];
    const budgetVal = budgetsByCategory[catId] ?? null;
   const usagePercent = ((total / budgetVal) * 100).toFixed(2);

const excess = budgetVal
  ? usagePercent > 100
    ? `Excess by ${(usagePercent - 100).toFixed(2)}%`
    : `${usagePercent}% of budget`
  : 'N/A';

    return {
      category: category__name,
      expense: total,
      budget: budgetVal != null ? budgetVal : '–',
      excess,
    };
  });

  return (
    <Box sx={{ my: 5 }}>
      {/* Income & Expense Cards */}
      <Box sx={{ display: 'flex', gap: 5 }}>
        {/* Income Card */}
        <Box sx={{ height: 160, width: 150, bgcolor: "#bce5c5" }}>
          <Box sx={{ height: '40%', bgcolor: '#d8f1e0', borderBottomRightRadius: '30%', borderBottomLeftRadius: '15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
              <InputIcon />
              Income
            </Box>
            <MoreVertIcon sx={{ p: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60%' }}>
            <Typography variant="h4">＄{totalIncome}</Typography>
          </Box>
        </Box>

        {/* Expense Card */}
        <Box sx={{ height: 160, width: 150, bgcolor: "#d5c8f6" }}>
          <Box sx={{ height: '40%', bgcolor: '#e3d7f9', borderBottomRightRadius: '30%', borderBottomLeftRadius: '15%', display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
              <OutboundIcon />
              Expense
            </Box>
            <MoreVertIcon sx={{ p: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60%' }}>
            <Typography variant="h4">＄{totalExpense}</Typography>
          </Box>
        </Box>

        {/* Monthly Chart */}
        <Box>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
            <h2>Monthly {selectedType === 'income' ? 'Income' : 'Expense'} Overview</h2>
            <div style={{ margin: '15px 0', textAlign: 'center' }}>
              <label htmlFor="typeSelect" style={{ marginRight: '10px' }}>Select Type:</label>
              <select id="typeSelect" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div style={{ width: '40vw', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={selectedType} fill={selectedType === 'income' ? '#82ca9d' : '#8884d8'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Box>
      </Box>

      {/* Budget vs Expense Summary Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Budget vs Expense Summary</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>% Excess</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.expense}</TableCell>
                  <TableCell>{row.budget}</TableCell>
                  <TableCell>{row.excess}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Summary;
