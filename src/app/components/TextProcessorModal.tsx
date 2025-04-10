import React, { useState } from "react";
import { Modal, Box, TextareaAutosize, Typography, Button } from "@mui/material";

interface TextProcessorModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setBook: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const TextProcessorModal: React.FC<TextProcessorModalProps> = ({ open,book, setOpen, setBook }) => {
  const [text, setText] = useState("");
  function processBookData(bookObj) {
    // پردازش فیلد mins
    if (!bookObj.mins) {
      bookObj.mins = '15';
    } else {
      // استخراج فقط اعداد از رشته
      bookObj.mins = bookObj.mins.replace(/\D/g, '');
      // اگر پس از حذف غیراعداد، رشته خالی شد، مقدار پیشفرض قرار دهید
      if (bookObj.mins === '') {
        bookObj.mins = '15';
      }
    }
  
    // پردازش فیلد ratings
    if (!bookObj.ratings) {
      bookObj.ratings = '4.6';
    } else {
      // حذف پرانتز و محتوای داخل آن
      bookObj.ratings = bookObj.ratings.replace(/\(.*\)/g, '').trim();
      // حذف فاصله‌های اضافی
      bookObj.ratings = bookObj.ratings.trim();
    }
  
    return bookObj;
  }
  

  function extractBookData() {
    const func = new Function(text + '\n' + 'return info'); // ساخت یک تابع از کد ورودی
    const result = func(); // اجرای تابع و دریافت مقدار بازگشتی
    return result
  }


  const handleProcessText = () => {

    const info =extractBookData()
    const processedBook = processBookData({mins:book?.mins,ratings:book?.ratings});
    setBook((p) => ({ ...p, ...info,...processedBook }));
    setOpen(false); // بستن مدال
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          متن خود را وارد کنید:
        </Typography>

        <TextareaAutosize
          minRows={8}
          placeholder="متن را وارد کنید..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
            لغو
          </Button>
          <Button variant="contained" color="primary" onClick={handleProcessText}>
            پردازش متن
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TextProcessorModal;
