import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";

const EditPatientModal = ({
  modalOpen,
  handleCloseModal,
  patientData,
  therapists,
  handleUpdatePatient,
}) => {
  const [updatedPatient, setUpdatedPatient] = useState(patientData);
  const [changedFields, setChangedFields] = useState([]);

  useEffect(()=>{
    console.log('updatedPatient')
    console.log(updatedPatient)
  },[updatedPatient])

  useEffect(() => {
    setUpdatedPatient(patientData);
    setChangedFields([]);
  }, [patientData]);

  const handleFieldChange = (field, value) => {
    setUpdatedPatient((prev) => {
      const updated = { ...prev, [field]: value };
      if (patientData[field] !== value && !changedFields.includes(field)) {
        setChangedFields((prev) => [...prev, field]);
      }
      if (patientData[field] === value) {
        setChangedFields((prev) => prev.filter((f) => f !== field));
      }
      return updated;
    });
  };

  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box
        sx={{
          margin: "100px auto",
          padding: 3,
          width: "400px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          ویرایش بیمار
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="نام"
              value={updatedPatient?.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="نام خانوادگی"
              value={updatedPatient?.lastName}
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="توضیحات"
              value={updatedPatient?.desc}
              onChange={(e) => handleFieldChange("desc", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={therapists}
              getOptionLabel={(option) =>
                `${option?.firstName} ${option?.lastName}`
              }
              value={therapists.filter((therapist) =>
                updatedPatient.therapists.some(
                  (tp) => tp._id === therapist._id
                )
              )}
              onChange={(event, values) => {
                console.log('values',values)
                const selectedIds = values.map((value) => value._id);
                handleFieldChange("therapists", values);
                setUpdatedPatient((prev) => ({
                  ...prev,
                  therapists: selectedIds,
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="انتخاب درمانگرها" fullWidth />
              )}
            />
          </Grid>
        </Grid>
        {/* {changedFields.length > 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2, textAlign: "center" }}
          >
            فیلدهای تغییر یافته: {changedFields.join(", ")}
          </Typography>
        )} */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => handleUpdatePatient(updatedPatient)}
        >
          ثبت تغییرات
        </Button>
      </Box>
    </Modal>
  );
};

export default EditPatientModal;
