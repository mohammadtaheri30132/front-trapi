import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import { TextField, Button, IconButton, Modal, Box, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const SummeryBox = ({ id }) => {
    const [summary, setSummary] = useState({ content: [] }); // کل خلاصه کتاب
    const [newPageTitle, setNewPageTitle] = useState(""); // عنوان صفحه جدید
    const [openModal, setOpenModal] = useState(false); // حالت مدال
    const [importedText, setImportedText] = useState(""); // متن وارد شده از فایل

    // دریافت داده‌ها از سرور
    useEffect(() => {
        const fetchBook = async () => {
            const res = await fetch(`http://localhost:2323/api/summaries/book/${id}`);
            const data = await res.json();
            if (data.content) {
                setSummary(data);
            }
        };
        fetchBook();
    }, [id]);

    // اضافه کردن صفحه جدید
    const handleAddPage = () => {
        const newPage = { title: newPageTitle || "عنوان جدید", text: "" }; // صفحه جدید
        const updatedSummary = {
            ...summary,
            content: [...summary.content, newPage],
        };
        setSummary(updatedSummary);
        setNewPageTitle(""); // ریست کردن عنوان صفحه جدید
    };

    // حذف صفحه
    const handleDeletePage = (index) => {
        const updatedContent = summary.content.filter((_, i) => i !== index);
        const updatedSummary = { ...summary, content: updatedContent };
        setSummary(updatedSummary);
    };

    // به‌روزرسانی عنوان صفحه
    const handleTitleChange = (index, value) => {
        const updatedContent = summary.content.map((page, i) =>
            i === index ? { ...page, title: value } : page
        );
        setSummary({ ...summary, content: updatedContent });
    };

    // به‌روزرسانی متن صفحه
    const handleTextChange = (index, value) => {
        const updatedContent = summary.content.map((page, i) =>
            i === index ? { ...page, text: value } : page
        );
        setSummary({ ...summary, content: updatedContent });
    };

    // ذخیره تغییرات در سرور
    const handleSaveSummary = async () => {
        const response = await fetch(`http://localhost:2323/api/summaries/book/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(summary),
        });
        console.log(response);
    };

    // باز کردن مدال
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // اعمال متن وارد شده به summary

    
    const handleApplyImportedText = () => {
        try {
            // جایگزینی کلیدهای بدون کوتیشن با کلیدهای معتبر JSON
            const fixedText = importedText.replace(/(\w+):/g, '"$1":');
            const parsedText = JSON.parse(fixedText);
    
            if (Array.isArray(parsedText)) {
                const updatedSummary = {
                    ...summary,
                    content: [...summary.content, ...parsedText],
                };
                setSummary(updatedSummary);
                setImportedText("");
                handleCloseModal();
            } else {
                alert("فرمت فایل وارد شده صحیح نیست. باید یک آرایه از صفحات باشد.");
            }
        } catch (error) {
            console.log(error)
            alert("خطا در پردازش فایل متنی. لطفاً فرمت JSON را بررسی کنید.");
        }
    };

    return (
        <div style={{ direction: 'rtl', marginTop: '50px' }}>
            <p>خلاصه کتاب</p>

            {/* لیست صفحات */}
            {summary.content.map((page, index) => (
                <div key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
                    {/* اینپوت برای عنوان صفحه */}
                    <TextField
                        fullWidth
                        label="عنوان صفحه"
                        value={page.title}
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        margin="normal"
                    />

                    {/* ویرایشگر متن برای متن صفحه */}
                    <ReactQuill
                        style={{ marginTop: '20px', marginBottom: '20px' }}
                        value={page.text}
                        onChange={(value) => handleTextChange(index, value)}
                        theme="snow"
                        placeholder="متن صفحه را اینجا بنویسید..."
                    />

                    {/* دکمه حذف صفحه */}
                    <IconButton onClick={() => handleDeletePage(index)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}

            {/* افزودن صفحه جدید */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                    fullWidth
                    sx={{ marginLeft: 10, textAlign: 'right' }}
                    label="عنوان صفحه جدید"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    margin="normal"
                />
                <Button onClick={handleAddPage} sx={{ width: '40%', height: '100%' }} variant="contained" startIcon={<AddIcon />}>
                    صفحه جدید
                </Button>
            </div>

            {/* دکمه ذخیره تغییرات */}
            <Button onClick={handleSaveSummary} sx={{ width: '100%', marginTop: 10 }} type="submit" variant="contained" startIcon={<SaveIcon />}>
                ذخیره خلاصه
            </Button>

            {/* دکمه باز کردن مدال */}
            <Button onClick={handleOpenModal} sx={{ width: '100%', marginTop: 2 }} variant="contained" color="secondary">
                وارد کردن فایل متنی
            </Button>

            {/* مدال برای وارد کردن فایل متنی */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    direction: 'rtl'
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        وارد کردن فایل متنی
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        value={importedText}
                        onChange={(e) => setImportedText(e.target.value)}
                        placeholder="متن فایل را اینجا وارد کنید..."
                        sx={{ mt: 2 }}
                    />
                    <Button onClick={handleApplyImportedText} sx={{ mt: 2 }} variant="contained" color="primary">
                        اعمال
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default SummeryBox;