'use client'
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // آیکون ویرایش
import LinkIcon from '@mui/icons-material/Link'; // آیکون لینک
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BooksTable = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router=useRouter()
    useEffect(() => {
        // دریافت لیست کتاب‌ها از API
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:2323/api/books');
                if (!response.ok) {
                    throw new Error('خطا در دریافت داده‌ها');
                }
                const data = await response.json();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return <div>در حال بارگذاری...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '0 20px' }}>
            {/* عنوان صفحه و تعداد کتاب‌ها */}
            <Typography variant="h4" component="h1" gutterBottom>
                لیست کتاب‌ها
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                تعداد کتاب‌ها: {books.length}
            </Typography>

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
                                onClick={()=>{
                                    router.push(`/books/${book.slug}`)
                                }}
                                key={book._id}
                                sx={{
                                    cursor:'pointer',
                                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.04)' : 'inherit',
                                }}
                            >
                                {/* عکس کتاب */}
                                <TableCell align="right">
                                    {/* <img
                                        src={book.image_url}
                                        alt={book.name}
                                        style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                                    /> */}
                                </TableCell>

                                {/* نام کتاب */}
                                <TableCell align="right">{book.name}</TableCell>

                                {/* نویسنده */}

                                {/* توضیحات کوتاه */}
                                <TableCell align="right">{book.short_desc}</TableCell>

                                {/* امتیاز */}

                                {/* عملیات (آیکون‌ها) */}
                                <TableCell align="right">
                                    {/* آیکون ویرایش */}
                                    <Link href={`/books/${book.slug}`} passHref>
                                        <IconButton color="primary">
                                            <EditIcon />
                                        </IconButton>
                                    </Link>

                                    {/* آیکون لینک به آدرس خارجی */}
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
        </div>
    );
};

export default BooksTable;