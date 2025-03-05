'use client'
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedPersianName, setEditedPersianName] = useState('');
    const [newTopic, setNewTopic] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:2323/api/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('خطا در دریافت دسته‌بندی‌ها:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleEditStart = (category) => {
        setEditingCategoryId(category._id);
        setEditedName(category.name);
        setEditedPersianName(category.persianName);
    };

    const handleEditSave = async (categoryId) => {
        try {
            const response = await axios.put(`http://localhost:2323/api/categories/${categoryId}`, {
                name: editedName,
                persianName: editedPersianName,
            });
            setCategories(categories.map(cat => (cat._id === categoryId ? response.data : cat)));
            setEditingCategoryId(null);
        } catch (err) {
            console.error('خطا در به‌روزرسانی دسته‌بندی:', err);
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:2323/api/categories/${categoryId}`);
            setCategories(categories.filter(cat => cat._id !== categoryId));
        } catch (err) {
            console.error('خطا در حذف دسته‌بندی:', err);
        }
    };

    const handleAddTopic = async (categoryId) => {
        try {
            const response = await axios.post(`http://localhost:2323/api/categories/${categoryId}/topics`, {
                name: newTopic,
            });
            setCategories(categories.map((item) => item._id === categoryId ? response.data : item));
            setNewTopic('');
        } catch (err) {
            console.error('خطا در اضافه کردن تاپیک:', err);
        }
    };

    const handleDeleteTopic = async (categoryId, topicId) => {
        try {
            const response = await axios.delete(`http://localhost:2323/api/categories/${categoryId}/topics/${topicId}`);
            setCategories(categories.map((item) => item._id === categoryId ? response.data : item));
        } catch (err) {
            console.error('خطا در حذف تاپیک:', err);
        }
    };
    
    return (
        <Container maxWidth="sm" sx={{ padding: '10px' }}>
            <Typography variant="h5" gutterBottom>
                مدیریت دسته‌بندی‌ها
            </Typography>

            {categories.map((category) => (
                <Paper key={category._id} elevation={2} sx={{
                    padding: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: category.persianName ? 'none' : '4px solid red',
                }}>
                    {editingCategoryId === category._id ? (
                        <Box sx={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                            <TextField label="نام" value={editedName} onChange={(e) => setEditedName(e.target.value)} size="small" fullWidth />
                            <TextField label="نام فارسی" value={editedPersianName} onChange={(e) => setEditedPersianName(e.target.value)} size="small" fullWidth />
                            <Button variant="contained" size="small" onClick={() => handleEditSave(category._id)}>
                                ذخیره
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                                {category.name} ({category.persianName || 'بدون نام فارسی'})
                            </Typography>
                            <Box>
                                <IconButton size="small" onClick={() => handleEditStart(category)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(category._id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    <List dense>
                        {category.topics.map((topic) => (
                            <ListItem key={topic._id} sx={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                                <ListItemText primary={topic.name} />
                                <IconButton size="small" onClick={() => handleDeleteTopic(category._id, topic._id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <TextField label="تاپیک جدید" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} size="small" fullWidth />
                        <Button variant="contained" size="small" onClick={() => handleAddTopic(category._id)} startIcon={<AddIcon fontSize="small" />}>
                            افزودن
                        </Button>
                    </Box>
                </Paper>
            ))}
        </Container>
    );
};

export default CategoriesPage;
