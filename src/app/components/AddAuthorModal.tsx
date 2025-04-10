import React, { useEffect, useState } from "react";
import { Modal, Button, TextField, Box, Typography, MenuItem, Select, FormControl, InputLabel, Chip } from "@mui/material";
import axios from "axios";

const AddAuthorModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchAuthors();
  }, [isOpen]);

  // دریافت لیست نویسندگان
  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:2424/api/authors");
      setAuthors(response.data);
    } catch (error) {
      console.error("خطا در دریافت نویسندگان:", error);
    }
  };

  // افزودن نویسنده جدید
  const handleAddAuthor = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:2424/api/authors", { name, bio });
      if (response.status === 201) {
        setAuthors([...authors, response.data]);
        setName("");
        setBio("");
      }
    } catch (error) {
      console.error("خطا در افزودن نویسنده:", error);
    } finally {
      setLoading(false);
    }
  };

  // حذف نویسندگان انتخاب‌شده
  const handleDeleteAuthors = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedAuthors.map(id => axios.delete(`http://localhost:2424/api/authors/${id}`)));
      setAuthors(authors.filter(author => !selectedAuthors.includes(author._id)));
      setSelectedAuthors([]);
    } catch (error) {
      console.error("خطا در حذف نویسندگان:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 450, bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 24, display: "flex", flexDirection: "column", gap: 2
      }}>
        <Typography variant="h6">مدیریت نویسندگان</Typography>

        {/* افزودن نویسنده جدید */}
        <TextField label="نام نویسنده" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="بیوگرافی" value={bio} onChange={(e) => setBio(e.target.value)} fullWidth multiline rows={3} />
        <Button onClick={handleAddAuthor} variant="contained" color="primary" disabled={loading}>
          {loading ? "در حال ارسال..." : "افزودن نویسنده"}
        </Button>

        {/* انتخاب نویسندگان برای حذف */}
        <FormControl fullWidth>
          <InputLabel>نویسندگان</InputLabel>
          <Select
            multiple
            value={selectedAuthors}
            onChange={(e) => setSelectedAuthors(e.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((id) => {
                  const author = authors.find(a => a._id === id);
                  return author ? <Chip key={id} label={author.name} /> : null;
                })}
              </Box>
            )}
          >
            {authors.map((author) => (
              <MenuItem key={author._id} value={author._id}>{author.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedAuthors.length > 0 && (
          <Button onClick={handleDeleteAuthors} variant="contained" color="error" disabled={loading}>
            حذف نویسندگان انتخاب‌شده
          </Button>
        )}

        <Button onClick={onClose} color="secondary" disabled={loading}>بستن</Button>
      </Box>
    </Modal>
  );
};

export default AddAuthorModal;
