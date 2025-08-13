import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
} from '@mui/material';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Typography, FormControl, FormLabel, Input } from '@mui/joy';
import { Select, Option } from '@mui/joy';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Datagrid = () => {
  const [cookies] = useCookies(['cookie']);
  const navigate = useNavigate();
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [categories, setCategories] = useState([]);
const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
const [newCategoryName, setNewCategoryName] = useState('');
  const [editRow, setEditRow] = useState(null); // current row to edit
  const [editType, setEditType] = useState(''); // incomes or expenses

  // Modal fields for edit
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState(0);
  const [editCategory, setEditCategory] = useState('');
  const [token] = useCookies(['cookie']);


  // Function to show new category input
const handleShowNewCategoryInput = () => {
  setShowNewCategoryInput(true);
  setNewCategoryName('');
};

// Function to cancel adding new category
const handleCancelNewCategory = () => {
  setShowNewCategoryInput(false);
  setNewCategoryName('');
};

// Function to save new category
const handleSaveNewCategory = async () => {
  if (!newCategoryName.trim()) {
    toast.error("Category name can't be empty");
    return;
  }
      const token = cookies.cookie;
      if(!token) navigate('/login')
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/finance/categories/',
      { name: newCategoryName },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newCat = response.data;
    setCategories((prev) => [...prev, newCat]);
    setEditCategory(newCat.id);
    setShowNewCategoryInput(false);
    toast.success('Category added!');
  } catch (err) {
    console.error(err);
    toast.error('Failed to add category');
  }
};
  useEffect(() => {
      const token = cookies.cookie;
      if(!token) navigate('/login')

    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, categoryRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/finance/incomes/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/finance/expenses/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/finance/categories/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // categoryId -> name map
        const categoryObj = {};
        categoryRes.data.forEach((cat) => {
          categoryObj[cat.id] = cat.name;
        });

        setIncomeData(incomeRes.data);
        setExpenseData(expenseRes.data);
        setCategoryMap(categoryObj);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleEdit = (row, type) => {
    setEditRow(row);
    setEditType(type);
    setEditDescription(row.description);
    setEditAmount(row.amount);
    // If category is an object, use its id, else use the id directly
    setEditCategory(
      typeof row.category === 'object' ? row.category.id : row.category
    );
  };

  const handleDelete = async (id, type) => {
       const tokenVal = cookies.cookie;
      if(!tokenVal) navigate('/login')
    try {
      await axios.delete(`http://127.0.0.1:8000/api/finance/${type}/${id}/`, {
        headers: { Authorization: `Bearer ${tokenVal}` },
      });
      toast.success('Entry deleted successfully!');

      if (type === 'incomes') {
        setIncomeData((prev) => prev.filter((item) => item.id !== id));
      } else {
        setExpenseData((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete entry');
    }
  };

  const handleSave = async () => {
    if (!editRow) return;
   const token = cookies.cookie;
      if(!token) navigate('/login')
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/finance/${editType}/${editRow.id}/`,
        {
          amount: Number(editAmount),
          description: editDescription,
          category: editCategory,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Entry updated successfully!');
      setEditRow(null);

      // Refresh data
      const response = await axios.get(
        `http://127.0.0.1:8000/api/finance/${editType}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (editType === 'incomes') {
        setIncomeData(response.data);
      } else {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update entry');
    }
  };

  const columns = [
    { field: 'serial', headerName: 'ID', width: 70 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'edit',
      headerName: 'Edit Entry',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleEdit(params.row, params.row.type)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete Entry',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row.id, params.row.type)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const formatData = (dataArray, type) =>
    dataArray.map((item, index) => ({
      id: item.id, // real DB id for editing/deleting
      serial: index + 1, // incremental number for display in ID column
      category:
        typeof item.category === 'object'
          ? item.category.name
          : categoryMap[item.category] || 'N/A',
      amount: item.amount,
      description: item.description,
      date: item.date,
      type,
      category_id: typeof item.category === 'object' ? item.category.id : item.category,
    }));

  return (
    <Box sx={{ p: 4 }}>
      <h2>Income Data</h2>
      <DataGrid
        rows={formatData(incomeData, 'incomes')}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{ mb: 4 }}
      />

      <h2>Expense Data</h2>
      <DataGrid
        rows={formatData(expenseData, 'expenses')}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      {/* Edit Modal */}
      <Modal open={!!editRow} onClose={() => setEditRow(null)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" component="h2" mb={2}>
            Edit Entry
          </Typography>

          <FormControl sx={{ my: 2 }}>
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Enter description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
            />
          </FormControl>

          <FormControl sx={{ my: 2 }}>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              placeholder="Enter amount"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              required
            />
          </FormControl>
<FormControl sx={{ my: 2 }}>
  <FormLabel>Category</FormLabel>
  <Select
    value={editCategory}
    onChange={(e, newValue) => {
      setEditCategory(newValue);
      setShowNewCategoryInput(false);
    }}
    required
    placeholder="Select a category"
  >
    {categories.map((cat) => (
      <Option key={cat.id} value={cat.id}>
        {cat.name}
      </Option>
    ))}
  </Select>

  {!showNewCategoryInput && (
    <Button variant="text" sx={{ mt: 1 }} onClick={handleShowNewCategoryInput}>
      + Add New Category
    </Button>
  )}
</FormControl>

{showNewCategoryInput && (
  <FormControl sx={{ my: 2 }}>
    <FormLabel>New Category</FormLabel>
    <Input
      type="text"
      placeholder="Enter new category name"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
    />
    <Button variant="outlined" sx={{ mt: 1 }} onClick={handleSaveNewCategory}>
      Save Category
    </Button>
    <Button variant="text" sx={{ mt: 1, ml: 1 }} onClick={handleCancelNewCategory}>
      Cancel
    </Button>
  </FormControl>
)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => setEditRow(null)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Datagrid;
