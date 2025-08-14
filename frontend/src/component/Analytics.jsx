import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Typography, FormControl, FormLabel, Input } from '@mui/joy';
import axios from 'axios';
import { Select, Option } from '@mui/joy';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import Datagrid from './Datagrid';

const Analytics = () => {
  const [cookies] = useCookies(['cookie']);
  const [openModal, setOpenModal] = useState(null); 
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesId, setCategoriesId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const token = cookies.cookie;

  const handleOpen = (type) => {
    setOpenModal(type);
    setShowNewCategoryInput(false); 
    setNewCategory('');
  };

  const handleClose = () => setOpenModal(null);

  const handleNewCategoryAddition = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name can't be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/finance/categories/",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newCat = response.data;
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat.id);
      setCategoriesId(newCat.id);
      setShowNewCategoryInput(false);
      toast.success("Category added!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while adding category!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   const dataHandle = {
    amount,
    category: categoriesId,
    description,
  };

  if (openModal === 'budgets') {
    const today = new Date().toISOString().split('T')[0];
    dataHandle.month = today;
  }


    try {
      await axios.post(
        `http://127.0.0.1:8000/api/finance/${openModal}/`,
        dataHandle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${openModal} added successfully!`);
      setAmount(0)
      setDescription('')
    } catch (err) {
      toast.error('Something went wrong!');
      setAmount(0)

      setDescription('')
      console.log(err);
    }
    
    handleClose();
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/finance/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();


  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4, my: 3 }}>
        <Button variant="outlined" onClick={() => handleOpen('incomes')}>
          Add Income
        </Button>
        <Button variant="outlined" onClick={() => handleOpen('expenses')}>
          Add Expenses
        </Button>
        <Button variant="outlined" onClick={() => handleOpen('budgets')}>
          Add Budget
        </Button>
      </Box>

      <Modal open={!!openModal} onClose={handleClose}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" component="h2">
            {openModal === 'incomes' && 'Add Income'}
            {openModal === 'expenses' && 'Add Expenses'}
            {openModal === 'budgets' && 'Add Budget'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormControl sx={{ my: 2 }}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter title"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormControl>

            <FormControl sx={{ my: 2 }}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </FormControl>

            <FormControl sx={{ my: 2 }}>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select a category"
                required
                value={selectedCategory}
                onChange={(e, newValue) => {
                  setSelectedCategory(newValue);
                  setCategoriesId(newValue);
                }}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </FormControl>

            {showNewCategoryInput ? (
              <FormControl sx={{ my: 2 }}>
                <FormLabel>New Category</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                  sx={{ mt: 1 }}
                  variant="outlined"
                  onClick={handleNewCategoryAddition}
                >
                  Save Category
                </Button>
              </FormControl>
            ) : (
              <Button
                sx={{ my: 2 }}
                variant="text"
                onClick={() => setShowNewCategoryInput(true)}
              >
                + Add New Category
              </Button>
            )}

            <Button type="submit" variant="outlined">
              Submit
            </Button>
          </form>
        </ModalDialog>
      </Modal>
      <Datagrid/>
    </Box>
  );
};

export default Analytics;
