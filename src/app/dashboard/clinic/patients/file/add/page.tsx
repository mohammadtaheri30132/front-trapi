'use client'
import { useState, useEffect, useRef, Suspense } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, AppBar, Tabs, Tab } from '@mui/material';
import { useSearchParams ,useRouter} from 'next/navigation';
import DashboardLayout from '@/app/dashboard/components/DashboardLayout';
import api from '@/app/utils/api';
import { getClinicProperty } from '@/app/utils/helper';
import { Grid } from '@mui/system';
import moment from 'moment-jalaali';

const   ReportAddPage = () => {
  return (
      <Suspense fallback={<p>در حال بارگذاری...</p>}>
          <PatientForm />
      </Suspense>
  );
};

const PatientForm=()=> {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    const [patientInfo, setPatientInfo] = useState({
      name: '',
      lastName: '',
      desc: '',
      clinic: '',
      therapists: [],
      file: '',
      birthDate: '',
      gender: '',
      initialDiagnosis: '',
      visitDate: '',
      address: '',
      phoneNumber: ''
  });
    const searchParams = useSearchParams();
    const patientId = searchParams.get('id');
    const chatEndRef = useRef(null);
    const [reports,setReports]=useState([])
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);
    useEffect(() => {
        const fetchFileData = async () => {
            try {
                const response = await api.get(`/patients/file/${patientId}`);
                if (response.data) {
                  
                    setFormData(prevData => ({
                        ...prevData,
                        ...response.data
                    }));

                }
            
            } catch (error) {
                console.log(error)
                console.error('Error fetching file data:', error);
            }
        };
        const fetchInfoData = async () => {
            try {
              const res‍Info = await api.get(`/patient/${patientId}`);

                if (res‍Info.data) {
                  
                  setPatientInfo(res‍Info?.data)


                }
            
            } catch (error) {
                console.log(error)
                console.error('Error fetching file data:', error);
            }
        };
        const fetchReportData = async () => {
            try {
                const res = await api.get(`/patients/${patientId}/reports`);
                console.log('repoet , ',res.data)
                if (res.data) {
                    setReports(res.data)
                }
            } catch (error) {
                console.log(error)
                console.error('Error fetching file data:', error);
            }
        };
        fetchInfoData()
        fetchReportData()
        fetchFileData();
    }, []);
    const [formData, setFormData] = useState({
        childrenInfo: '',
        childOrder: '',
        parentsJob: '',
        birthDiseases: '',
        associatedProblems: '',
        surgeryHistory: '',
        medicationHistory: '',
        assistiveDevices: '',
        rehabilitationHistory: '',
        initialAssessmentResults: '',
        treatmentGoals: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        const clinic= getClinicProperty('id')
        try {
            const data={ ...formData,clinic, patient: patientId }
            const response = await api.post('/patients/file',data);
            if (response.status==200) {
                alert('اطلاعات با موفقیت ارسال شد');
                router.push('/dashboard/clinic/patients');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (

        <DashboardLayout>
  <Container maxWidth="lg">
  <AppBar position="static" color="primary">
    <Tabs 
        value={tabIndex} 
        onChange={(e, newIndex) => setTabIndex(newIndex)} 
        centered 
        sx={{ 
          p:2,
            '.MuiTab-root': { color: 'white' }, // رنگ متن تب‌ها در حالت عادی سفید
            '.Mui-selected': { 
                color: 'primary.main', // رنگ متن در حالت فعال آبی
                backgroundColor: 'white', // پس‌زمینه سفید در حالت فعال
                borderRadius: '8px', // کمی گرد شدن گوشه‌ها
                transition: 'all 0.3s', // انیمیشن نرم برای تغییر حالت
            },
            '.MuiTabs-indicator': { backgroundColor: 'transparent' } // حذف خط زیر تب‌ها
        }}
    >
        <Tab label="اطلاعات کلی" />
        <Tab label="فرم بیمار" />
        <Tab label="گزارشات بیمار" />
    </Tabs>
</AppBar>

    <Typography variant="h5" sx={{marginTop:4,marginBottom:3}}  gutterBottom>
      {tabIndex==0&&'اطلاعات اولیه بیمار'}
      {tabIndex==1&&'فرم تکمیلی بیمار'}
      {tabIndex==2&&'گزارشات بیمار'}
    </Typography>
    <Box display="flex" gap={4}>
      {/* فرم */}
        {tabIndex==0&&(
          <Grid container spacing={2}>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="نام" 
                  name="name" 
                  value={patientInfo.name} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="نام خانوادگی" 
                  name="lastName" 
                  value={patientInfo.lastName} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })} 
              />
          </Grid>
          <Grid item xs={12}>
              <TextField 
                  fullWidth 
                  multiline 
                  rows={3} 
                  label="توضیحات" 
                  name="desc" 
                  value={patientInfo.desc} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, desc: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="تاریخ تولد" 
                  type="date" 
                  name="birthDate" 
                  InputLabelProps={{ shrink: true }}
                  value={patientInfo.birthDate} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, birthDate: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="تاریخ مراجعه" 
                  type="date" 
                  name="visitDate" 
                  InputLabelProps={{ shrink: true }}
                  value={patientInfo.visitDate} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, visitDate: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="آدرس" 
                  name="address" 
                  value={patientInfo.address} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="شماره همراه" 
                  name="phoneNumber" 
                  value={patientInfo.phoneNumber} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, phoneNumber: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  label="تشخیص اولیه" 
                  name="initialDiagnosis" 
                  value={patientInfo.initialDiagnosis} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, initialDiagnosis: e.target.value })} 
              />
          </Grid>
          <Grid item xs={6}>
              <TextField 
                  fullWidth 
                  select 
                  label="جنسیت" 
                  name="gender" 
                  value={patientInfo.gender} 
                  onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })} 
                  SelectProps={{ native: true }}
              >
                  <option value="">انتخاب کنید</option>
                  <option value="Male">مرد</option>
                  <option value="Female">زن</option>
              </TextField>
          </Grid>
          {/* <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={() => console.log(patientInfo)}>
                  ذخیره
              </Button>
          </Grid> */}
      </Grid>
      
        )}
        {tabIndex==1&&(
           <Box flex={1}>
           <Grid container spacing={2}>
             <Grid item xs={6}>
               <TextField fullWidth label="اطلاعات فرزندان" name="childrenInfo" placeholder="مثلاً: یک پسر و یک دختر" value={formData.childrenInfo} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="ترتیب فرزند" name="childOrder" placeholder="مثلاً: ۲" type="number" value={formData.childOrder} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="شغل والدین" name="parentsJob" placeholder="مثلاً: معلم و مهندس" value={formData.parentsJob} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="بیماری‌های کودک هنگام تولد" name="birthDiseases" placeholder="مثلا تشنج ، زردی ، اسهال ، ضربه به سر" value={formData.birthDiseases} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="مشکلات همراه کودک" name="associatedProblems" placeholder="نابینایی ، عقب ماندگی ، مشکلات گفتاری" value={formData.associatedProblems} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="سابقه جراحی" name="surgeryHistory" value={formData.surgeryHistory} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="سابقه مصرف دارویی" name="medicationHistory" value={formData.medicationHistory} onChange={handleChange} />
             </Grid>
             <Grid item xs={6}>
               <TextField fullWidth label="از وسایل کمکی استفاده میکند؟" name="assistiveDevices" value={formData.assistiveDevices} onChange={handleChange} />
             </Grid>
             <Grid item xs={12}>
               <TextField fullWidth multiline rows={3} label="تاریخچه توانبخشی دریافت شده" name="rehabilitationHistory" value={formData.rehabilitationHistory} onChange={handleChange} />
             </Grid>
             <Grid item xs={12}>
               <TextField fullWidth multiline rows={3} label="نتایج ارزیابی اولیه" name="initialAssessmentResults" value={formData.initialAssessmentResults} onChange={handleChange} />
             </Grid>
             <Grid item xs={12}>
               <TextField fullWidth multiline rows={3} label="اهداف درمانی" name="treatmentGoals" value={formData.treatmentGoals} onChange={handleChange} />
             </Grid>
           </Grid>
           <Box display="flex" justifyContent="space-between" mt={2}>
             <Button variant="contained" color="secondary" onClick={() => router.back()}>
               بازگشت
             </Button>
             <Button type="submit" variant="contained" onClick={handleSubmit} color="primary">
               ارسال
             </Button>
           </Box>
         </Box>
        )}
      {tabIndex==2&&(
        <Box flex={1} overflow="auto" p={2} borderRadius={2} sx={{borderWidth:1,borderColor:'#e6e6e6'}} bgcolor="#f8f8f8" display="flex" flexDirection="column-reverse">
      {reports?.map((msg, index) => (
            <Paper key={index} sx={{ p: 1.5, mb: 1, backgroundColor: "#ffffff", borderRadius: 2 }}>
              <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',}}>
              <Typography sx={{color:'#8d8d8d'}}  variant="body2">{msg?.therapist?.firstName} {msg?.therapist?.lastName} نوشت :</Typography>
              <Typography sx={{color:'#8d8d8d',}}  variant="body2">{moment(msg?.createdAt).local().format("jYYYY/jMM/jDD HH:mm:ss")}</Typography>
              </Box>
              <Typography sx={{p:2}} variant="body2">{msg?.reportText}</Typography>
            </Paper>
          ))}
        <div ref={chatEndRef} />
      </Box>
      )}
      {/* باکس چت */}
      
    </Box>
  </Container>
</DashboardLayout>

    );
}
export default ReportAddPage;
