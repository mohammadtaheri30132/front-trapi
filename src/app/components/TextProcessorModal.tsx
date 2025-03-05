import React, { useState } from "react";
import { Modal, Box, TextareaAutosize, Typography, Button } from "@mui/material";

interface TextProcessorModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setBook: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const TextProcessorModal: React.FC<TextProcessorModalProps> = ({ open, setOpen, setBook }) => {
  const [text, setText] = useState("");

  const extractFields = (inputText: string) => {
    const fieldNames = [
      "who_should_read",
      "book_review",
      "about_the_book",
      "desc_book",
      "short_desc",
      "name",
    ];

    const extractedData: Record<string, string> = {};

    fieldNames.forEach((field) => {
      console.log("field", field)
      const regex = new RegExp(`const ${field} = ['"](.*?)['"];`, "s");
      const match = inputText.match(regex);
      console.log('match',match)
      if (match) {
        extractedData[field] = match[1];
      }
    });

    return extractedData;
  };

  const handleProcessText = () => {
    console.log(' console.log(extractedValues)',)
    const extractedValues = extractFields(text);
    console.log(extractedValues)
    setBook((p) => ({ ...p, ...extractedValues }));
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
