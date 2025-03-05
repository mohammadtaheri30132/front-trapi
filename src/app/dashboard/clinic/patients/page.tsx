'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import api from '../../../utils/api';
import { getClinicProperty } from '../../../utils/helper';
import DashboardLayout from '../../components/DashboardLayout';
import moment from 'moment-jalaali';
moment.loadPersian({ dialect: 'persian-modern' });

function convertToJalali(dateString) {
  return moment(dateString).format("jYYYY/jMM/jDD");
}

const PatientsPage = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const router = useRouter();
    

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                console.log('sss')
                const clinicId = getClinicProperty('id');
                const response = await api.get(`/patients/${clinicId}`);
                console.log(response.data.data)

                setPatients(response.data.data);
                console.log(response.data.data)
    
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('آیا از حذف این بیمار اطمینان دارید؟')) {
            try {
                await api.delete(`/patients/${id}`);
                setPatients((prev) => prev.filter((patient) => patient.id !== id));
                alert('بیمار با موفقیت حذف شد');
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('مشکلی در حذف بیمار رخ داد');
            }
        }
    };

    // const handleEdit = (id: string) => {
    //     router.push(`/patients/edit/${id}`);
    // };

    // const handleViewDetails = (id: string) => {
    //     router.push(`/patients/details/${id}`);
    // };

    const handleCreateFile = (id: string) => {
     
        router.push(`/dashboard/clinic/patients/file/add?id=${id}`);
        // اینجا می‌توانید منطق مرتبط با تشکیل پرونده را اضافه کنید
    };

    return (
       <DashboardLayout>
         <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">لیست بیماران</Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/dashboard/clinic/patients/add')}>
                    افزودن بیمار
                </Button>
            </Box>
            {patients.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">نام</TableCell>
                                <TableCell align="right">نام خانوادگی</TableCell>
                                <TableCell align="right">تاریخ ویزیت</TableCell>
                                <TableCell align="right">شماره همراه</TableCell>
                                <TableCell align="right">عملیات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.map((patient, index) => (
                                <TableRow
                                    key={patient.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.04)' : 'inherit',
                                    }}
                                >
                                    <TableCell align="right">{patient.name}</TableCell>
                                    <TableCell align="right">{patient.lastName}</TableCell>
                                    <TableCell align="right">{convertToJalali(patient.visitDate) || '—'}</TableCell>
                                    <TableCell align="right">{patient.phoneNumber || '—'}</TableCell>
                                    <TableCell align="right">
                                        {/* <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(patient._id)}
                                            title="ویرایش"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDelete(patient._id)}
                                            title="حذف"
                                        >
                                            <Delete />
                                        </IconButton> */}
                                        <Button onClick={() => handleCreateFile(patient._id)}>
                                            اطلاعات تکمیلی
                                        </Button>
                                        {/* <IconButton
                                            color="default"
                                            onClick={() => handleCreateFile(patient._id)}
                                            title="تشکیل پرونده"
                                        >
                                            <FolderOpen />
                                        </IconButton> */}
                                        {/* <IconButton
                                            color="info"
                                            onClick={() => handleViewDetails(patient._id)}
                                            title="اطلاعات کامل"
                                        >
                                            <Info />
                                        </IconButton> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 3, textAlign: 'center' }}>
                    هیچ بیماری یافت نشد.
                </Typography>
            )}
        </Box>
       </DashboardLayout>
    );
};

export default PatientsPage;
