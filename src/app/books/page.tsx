'use client';
import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BooksTable = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalBooks, setTotalBooks] = useState(0);
    const limit = 20; // لیمیت ثابت 20
    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`http://193.242.208.20:4000/api/books?page=${currentPage}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error('خطا در دریافت داده‌ها');
                }
                const data = await response.json();
                setBooks(data.books);
                setTotalPages(data.totalPages);
                setTotalBooks(data.totalBooks);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [currentPage]);

    // تغییر صفحه به قبلی
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // تغییر صفحه به بعدی
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // تغییر صفحه با سلکت آپشن
    const handlePageChange = (event) => {
        setCurrentPage(Number(event.target.value));
    };

    if (loading) {
        return <div>در حال بارگذاری...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    // ساخت آرایه‌ای از شماره صفحات برای سلکت آپشن
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div style={{ padding: '0 20px' }}>
            {/* عنوان صفحه و تعداد کتاب‌ها */}
            <Typography variant="h4" component="h1" gutterBottom>
                لیست کتاب‌ها
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="subtitle1">
                    تعداد کتاب‌ها: {totalBooks}
                </Typography>
                {/* سلکت آپشن برای انتخاب صفحه */}
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="page-select-label">صفحه</InputLabel>
                    <Select
                        labelId="page-select-label"
                        value={currentPage}
                        label="صفحه"
                        onChange={handlePageChange}
                    >
                        {pageOptions.map((page) => (
                            <MenuItem key={page} value={page}>
                                صفحه {page}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* جدول کتاب‌ها */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">عکس</TableCell>
                            <TableCell align="right">نام کتاب</TableCell>
                            <TableCell align="right">توضیحات کوتاه</TableCell>
                            <TableCell align="right">عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book, index) => (
                            <TableRow
                                onClick={() => {
                                    router.push(`/books/${book.slug}`);
                                }}
                                key={book._id}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.04)' : 'inherit',
                                }}
                            >
                                <TableCell align="right">
                                    {/* <img
                                        src={book.image_url}
                                        alt={book.name}
                                        style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                                    /> */}
                                </TableCell>
                                <TableCell align="right">{book.name}</TableCell>
                                <TableCell align="right">{book.short_desc}</TableCell>
                                <TableCell align="right">
                                    <Link href={`/books/${book.slug}`} passHref>
                                        <IconButton color="primary">
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => window.open(`http://blinkist.com/en/books/${book.slug}`, '_blank')}
                                    >
                                        <LinkIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* کنترل‌های صفحه‌بندی پایین */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    قبلی
                </Button>
                <Typography variant="body1">
                    صفحه {currentPage} از {totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    بعدی
                </Button>
            </div>
        </div>
    );
};

export default BooksTable;