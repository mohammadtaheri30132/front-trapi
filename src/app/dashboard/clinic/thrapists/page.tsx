'use client'
import  {useEffect, useState} from 'react';
import {
    Box, Button, Typography, TextField, Modal, Card, Avatar, Grid, IconButton
} from '@mui/material';
import {Person, Delete, Info} from "@mui/icons-material";
import api from "@/app/utils/api";
import {getClinicProperty} from "@/app/utils/helper";
import DashboardLayout from '../../components/DashboardLayout';
import { useRouter } from 'next/navigation';

const TherapistsClinicPage = () => {
    const router=useRouter()

    const [therapists, setTherapists] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    // const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState(null);
    const [newTherapist, setNewTherapist] = useState({
        firstName: '', lastName: '', phone: '', specialization: '', username: '', password: '',percentage:''
    });
    const [search, setSearch] = useState('');

    // فیلتر بر اساس نام
    const filteredTherapists = therapists.filter((t) =>
        `${t.firstName} ${t.lastName}`.includes(search)
    );

    // دریافت لیست درمانگرها
    const fetchTherapists = async () => {
        try {
            const clinicId = getClinicProperty('id');
            const response = await api.get(`/therapists/${clinicId}`);
            setTherapists(response.data);
        } catch (error) {
            console.error("خطا در دریافت تراپیست‌ها", error);
        }
    };

    useEffect(() => {
        fetchTherapists();
    }, []);

    // افزودن درمانگر
    const handleAddTherapist = async () => {
        try {
            console.log(Number(newTherapist.percentage))
            const clinicId = getClinicProperty('id');
           
            const data = {...newTherapist,percentage:parseInt(newTherapist?.percentage), clinicId};

            await api.post('/therapist', data);

            fetchTherapists();
            setModalOpen(false);
            setNewTherapist({firstName: '', lastName: '',percentage:'', phone: '', specialization: '', username: '', password: ''});
        } catch (error) {
            console.error("خطا در افزودن تراپیست", error);
        }
    };

    // حذف تراپیست
    const handleDeleteTherapist = async (therapistId:≈) => {
        try {
            await api.delete(`/therapists/delete/${therapistId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            });
            fetchTherapists();
        } catch (error) {
            console.error("خطا در حذف تراپیست", error);
        }
    };

    // نمایش اطلاعات درمانگر
    // const handleShowInfo = (therapist) => {
    //     setSelectedTherapist(therapist);
    //     // setInfoModalOpen(true);
    // };

    return (
        <DashboardLayout>
        <>
            <Box sx={{
                 margin: '0 auto', padding: 3,
                backgroundColor: '#ffffff', borderRadius: '12px',
            }}>
                <Box sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3
                }}>
                    <Typography variant="h4">درمانگرها</Typography>
                    <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                        افزودن درمانگر
                    </Button>
                </Box>

                <Typography variant="h6" sx={{mb: 2}}>
                    تعداد کل درمانگرها: {therapists.length}
                </Typography>

                <TextField
                    fullWidth variant="outlined" label="جستجوی درمانگر"
                    value={search} onChange={(e) => setSearch(e.target.value)} sx={{mb: 3}}
                />

                <Grid container spacing={2}>
                    {filteredTherapists.reverse().map((therapist) => (
                        <Grid item xs={12} key={therapist.id}>
                            <Card sx={{
                                display: 'flex', alignItems: 'center', p: 2,
                                borderRadius: 2, backgroundColor: '#f9f9f9',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                            }}>
                                <Avatar sx={{bgcolor: '#e3f2fd', color: '#1565c0', mr: 2}}>
                                    <Person/>
                                </Avatar>
                                <Typography variant="body1" sx={{flex: 1}}>
                                    {`${therapist.firstName} ${therapist.lastName}`}
                                </Typography>
                                <IconButton
                                    sx={{
                                        bgcolor: '#ffe5e5', color: '#f44336', ml: 1, boxShadow: 1,
                                        ':hover': {bgcolor: '#f44336', color: '#fff'},
                                    }}
                                    onClick={() => handleDeleteTherapist(therapist._id)}
                                >
                                    <Delete/>
                                </IconButton>
                                <IconButton
                                    sx={{
                                        bgcolor: '#e3f2fd', color: '#1565c0', ml: 1, boxShadow: 1,
                                        ':hover': {bgcolor: '#1565c0', color: '#fff'},
                                    }}
                                    onClick={() => router.push(`/dashboard/clinic/thrapists/`+therapist._id)}
                                >
                                    <Info/>
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {/* افزودن درمانگر */}
            <Modal open={modalOpen}  onClose={() => setModalOpen(false)}>
                <Box sx={{
                    width:'400px',
                    margin: '100px auto', padding: 3, backgroundColor: 'white',
                    borderRadius: '12px', boxShadow: 24,
                }}>
                    <Typography variant="h6" sx={{mb: 2}}>افزودن درمانگر جدید</Typography>
                    <TextField
                        sx={{mb: 2}}
                        fullWidth label="نام" value={newTherapist.firstName}
                        onChange={(e) => setNewTherapist({...newTherapist, firstName: e.target.value})}
                    />
                    <TextField
                        sx={{mb: 2}}
                        fullWidth label="نام خانوادگی" value={newTherapist.lastName}
                        onChange={(e) => setNewTherapist({...newTherapist, lastName: e.target.value})}
                    />
                    <TextField
                        sx={{mb: 2}}
                        fullWidth label="شماره موبایل" value={newTherapist.phone}
                        onChange={(e) => setNewTherapist({...newTherapist, phone: e.target.value})}
                    />
                     <TextField
                     type='number'
                    
                        sx={{mb: 2}}
                        fullWidth label="درصد" value={newTherapist.percentage}
                        onChange={(e) => setNewTherapist({...newTherapist, percentage: e.target.value})}
                    />
                    
                    <TextField
                        sx={{mb: 2}}
                        fullWidth label="تخصص" value={newTherapist.specialization}
                        onChange={(e) => setNewTherapist({...newTherapist, specialization: e.target.value})}
                    />
                    <TextField
                        sx={{mb: 2}}
                        fullWidth label="نام کاربری" value={newTherapist.username}
                        onChange={(e) => setNewTherapist({...newTherapist, username: e.target.value})}
                    />
                    <TextField
                        sx={{mb: 2}}
                        fullWidth label="رمز عبور" value={newTherapist.password}
                        onChange={(e) => setNewTherapist({...newTherapist, password: e.target.value})}
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{mt: 3}} onClick={handleAddTherapist}>
                        افزودن
                    </Button>
                </Box>
            </Modal>

            <Modal open={!!selectedTherapist} onClose={() => setSelectedTherapist(null)}>
                <Box
                    sx={{
                        margin: '100px auto',
                        width:'400px',
                        padding: 4,
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                        اطلاعات تراپیست
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>نام:</Typography>
                            <Typography variant="body1">{selectedTherapist?.firstName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>نام خانوادگی:</Typography>
                            <Typography variant="body1">{selectedTherapist?.lastName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>شماره موبایل:</Typography>
                            <Typography variant="body1">{selectedTherapist?.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>تخصص:</Typography>
                            <Typography variant="body1">{selectedTherapist?.specialization}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>نام کاربری:</Typography>
                            <Typography variant="body1">{selectedTherapist?.username}</Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4 }}
                        onClick={() => setSelectedTherapist(null)}
                        fullWidth
                    >
                        بستن
                    </Button>
                </Box>
            </Modal>

        </>
        </DashboardLayout>
    );
};

export default TherapistsClinicPage;
