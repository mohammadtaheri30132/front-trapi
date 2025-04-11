'use client'
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, MenuItem, Select, InputLabel, FormControl, IconButton, Chip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AddAuthorModal from '@/app/components/AddAuthorModal';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import TextProcessorModal from '@/app/components/TextProcessorModal';
import SummeryBox from '@/app/components/SummeryBox';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });


const EditBookPage = () => {
    const params = useParams();
    const router = useRouter();
    const { slug } = params;
    const [book, setBook] = useState({
        name: '',
        author: '',
        short_desc: '',
        desc_book: '',
        about_the_book: '',
        book_review: '',
        image_url: '',
        mins: '',
        ratings: '',
        who_should_read: '',
        categories: [],
        topics: [],
        authors: [],
        faqs: []
    });
    const [processorModal,setProcessorModal]=useState(false)
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [authorModal, setAuthorModal] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            if (slug) {
                const response = await fetch(`http://193.242.208.20:4000/api/books/${slug}`);
                const data = await response.json();
                setBook(data);
       
            }
        };
        fetchBook();
    }, [slug]);
    const handleCopy=()=>{
        const matin =`
            موارد قبلی را در نظر نگیر و فراموش کن
            تو مترجم کتاب هستی

            مواردی که گفتم را انجام بده و رعایت کن

            تمام مواردی که گفتم در پایین را ترجمه کن به فارسی
            و با لحن محاوره ای و دوستانه
            
            اگر جایی از متن به خرید از امازون اشاره داشت ان را حذف کن
            بازم هم تاکیر میکنم پس از ترجمه لحن ترجمه فارسی باید محاوره ای باشه
            و نام کتاب ترجمه شده باشه

             و یک بیو گرافی از نویسنده یا نویسندگان بده در پایان بگو نویسنده کتاب چه کسی یا چه کسانی است 
            (به دو شکل انگلیسی و فارسی نام هایش را بنویس)
            همچنین نام کتاب را بهترین معادل فارسی ان در نظر بگیر
        نام کتاب :
        ${book.name}
        ---------------- 
        توضیحات کوتاه:
        ${book.short_desc}
        ----------------
        توضیحات کتاب :
        ${book.desc_book}
        ----------------
        درباره کتاب :
        ${book.about_the_book}
        ----------------
        برسی کتاب :
        ${book.book_review}
        ----------------
        چه کسانی این کتاب را میخوانند:
        ${book.who_should_read}
        ---------------
       
        در نهایت یک ابجکت جاوااسکریپت به نام info قابل کپی به من بده
        که 

        باز هم تاکید میکنم
        در خروجی فقط فایل جاوااسکریپت برایم و نویسندگان کتاب(نام نویسندگان و بیوگرافی انها  را بعد از فایل جاوااسکریپت به صورت متن بگو) مهم است بقیه توضیحات اضافی را نده

        const name ='ترجمه نام کتاب '
        const short_desc ='ترجمه توضیحات کوتاه '
        const desc_book ='ترجمه توضیحات کتاب '
        const about_the_book ='ترجمه نام کتاب '
        const book_review ='ترجمه برسی کتاب '
        const who_should_read ='ترجمه چه کسانی این کتاب را میخوانند'


        `
        navigator.clipboard.writeText(matin).then(() => {
            alert('متن با موفقیت کپی شد!');
          }).catch((err) => {
            alert('خطا در کپی کردن متن: ' + err);
          });
    }
    useEffect(() => {
        const fetchData = async () => {
            const [categoriesRes, topicsRes, authorsRes] = await Promise.all([
                fetch('http://193.242.208.20:4000/api/categories'),
                fetch('http://193.242.208.20:4000/api/topics'),
                fetch('http://193.242.208.20:4000/api/authors')
            ]);
            setCategories(await categoriesRes.json());
            setTopics(await topicsRes.json());
            setAuthors(await authorsRes.json());
        };
        fetchData();
    }, [authorModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleMultiSelectChange = (field) => (e) => {
        setBook({ ...book, [field]: e.target.value });
    };

    const handleFaqChange = (index, field, value) => {
        const newFaqs = [...book.faqs];
        newFaqs[index][field] = value;
        setBook({ ...book, faqs: newFaqs });
    };

    const handleAddFaq = () => {
        setBook({ ...book, faqs: [...book.faqs, { question: '', answer: '' }] });
    };

    const handleRemoveFaq = (index) => {
        const newFaqs = book.faqs.filter((_, i) => i !== index);
        setBook({ ...book, faqs: newFaqs });
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://193.242.208.20:4000/api/books/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });

            if (response.ok) {
                alert('کتاب با موفقیت به‌روزرسانی شد!');
                router.push(`/books/${slug}`);
            
            } else {
                throw new Error('خطا در به‌روزرسانی کتاب');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // const   textt=`
    // const targetLink = document.querySelector('a[href="/app/books/"]');
    // const p = targetLink.parentElement;

    // const pages = [...p.children].filter(item => {
    //     if (item.tagName === 'DIV') {
    //         const testText = item.innerText;
    //         return testText;
    //     }
    // });

    // const texts = pages.map((item) => {
    //     const line = item.innerText;
    //     const firstNewline = line.indexOf('\n'); // اولین \n
    //     const secondNewline = line.indexOf('\n', firstNewline + 1); // دومین \n
    //     const thirdNewline = line.indexOf('\n', secondNewline + 1); // سومین \n

    //     const title = line.substring(secondNewline + 1, thirdNewline).trim();

    //     const text = line.substring(thirdNewline + 1).trim();

    //     return {
    //         title: title,
    //         text: text
    //     };
    // });

    // const headerText = " میخواهم تایتل و متن هر کدام از ابجکت های زیر را برایم به فارسی ترجمه کنی و لحن ان باید محاوره ای باشد جتی اسم کتاب ها و نویسنده نیز باید فارسی یا معادل فارسی اند باشد همچنین هر جایی نیاز بود متن به خط بعدی برود بنویس ENTERBEZAN . در اخر یک فایل جاوا اسکریپت بده که یک ارایه مانند ارایه .توجه داشته باش من در خروجی فقط فایل جاوااسکریپت میخواهم.\n\n";

    // const jsonContent = JSON.stringify(texts, null, 2);

    // const finalContent = headerText + jsonContent;

    // const blob = new Blob([finalContent], { type: 'text/plain' });

    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'texts.txt'; // نام فایل برای دانلود
    // document.body.appendChild(a);

    // a.click();

    // document.body.removeChild(a);
    // `
    function generateCodeWithSlug() {
        // استرینگ کد اصلی که می‌خواهیم slug در آن قرار گیرد
        const codeTemplate = `
        const targetLink = document.querySelector('a[href="/app/books/${book.slug}"]');
        const p = targetLink.parentElement;
    
        const pages = [...p.children].filter(item => {
            if (item.tagName === 'DIV') {
                const testText = item.innerText;
                return testText;
            }
        });
    
        const texts = pages.map((item) => {
            const line = item.innerText;
            const firstNewline = line.indexOf('\\n'); // اولین \n
            const secondNewline = line.indexOf('\\n', firstNewline + 1); // دومین \n
            const thirdNewline = line.indexOf('\\n', secondNewline + 1); // سومین \n
    
            const title = line.substring(secondNewline + 1, thirdNewline).trim();
            const text = line.substring(thirdNewline + 1).trim();
    
            return {
                title: title,
                text: text
            };
        });
       const headerText = " میخواهم تایتل و متن هر کدام از ابجکت های زیر را برایم به فارسی ترجمه کنی و لحن ان باید محاوره ای باشد جتی اسم کتاب ها و نویسنده نیز باید فارسی یا معادل فارسی اند باشد همچنین هر جایی نیاز بود متن به خط بعدی برود بنویس ENTERBEZAN . در اخر یک فایل جاوا اسکریپت بده که یک ارایه به نام books مانند ارایه .توجه داشته باش من در خروجی فقط فایل جاوااسکریپت میخواهم.";

        const backslashn='   = '
        const jsonContent  = JSON.stringify(texts, null, 2);
        const finalContent = headerText +  jsonContent;
    
        const blob = new Blob([finalContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'texts.txt'; // نام فایل برای دانلود
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        `;
    
        // کپی کردن کد به کلیپ‌بورد
        navigator.clipboard.writeText(codeTemplate)
            .then(() => {
                alert("بزن بریم به صفحه کتاب");
                window.open(`http://blinkist.com/en/reader/books/${book.slug}`, '_blank')
            })
            .catch((err) => {
                console.error("خطا در کپی به کلیپ‌بورد:", err);
                alert("خطا در کپی کردن کد.");
            });
    }
    
    
    return (
        <Container maxWidth="md" sx={{ padding: '20px' }}>
            <Typography variant="h4">ویرایش کتاب</Typography>
            
            <Paper elevation={3} sx={{ padding: '20px' }}>
            <Button sx={{margin:2}} variant="contained" color="primary"
                    onClick={handleCopy}>کپی کد اطلاعات کتاب</Button>
            <Button variant="contained" sx={{margin:2}} color="primary" onClick={() => setProcessorModal(true)}>
                پردازش متن اطلاعات کتاب
            </Button>
          
            <Button variant="contained" sx={{margin:2}} color="warning" onClick={generateCodeWithSlug}>
               کد متن خلاصه کتاب
            </Button>

            <Button sx={{margin:2}}
                 onClick={() => window.open(`http://blinkist.com/en/books/${book.slug}`, '_blank')}
                variant="outlined" color="primary">
                      لینک سایت اصلی کتاب
                </Button>
                <TextProcessorModal book={book} open={processorModal} setOpen={setProcessorModal} setBook={setBook} />

           
               
                <Button sx={{margin:2}} variant="contained" color="success"
                    onClick={() => setAuthorModal(true)}>افزودن نویسنده</Button>
               
                <AddAuthorModal
                    isOpen={authorModal}
                    onClose={() => setAuthorModal(false)}
                />
                <form onSubmit={handleSubmit}>
                    {['name', 'short_desc', 'image_url', 'mins', 'ratings'].map((field) => (
                        <TextField key={field} fullWidth label={field} name={field} value={book[field]} onChange={handleChange} margin="normal" />
                    ))}
                    <div style={{ direction: 'rtl' }}>
                        <p>چه کسانی باید این کتاب را بخوانند</p>
                        <ReactQuill
                            value={book.who_should_read}
                            onChange={e=>setBook(p=>({...p,who_should_read:e}))}
                            theme="snow" // ظاهر ساده ویرایشگر
                            placeholder="اینجا بنویسید..."
                            />
                    </div>
                     <div style={{ direction: 'rtl' }}>
                        <p>برسی کتاب</p>
                        <ReactQuill
                            value={book.book_review}
                            onChange={e=>setBook(p=>({...p,book_review:e}))}
                            theme="snow" // ظاهر ساده ویرایشگر
                            placeholder="اینجا بنویسید..."
                            />
                    </div>
                     <div style={{ direction: 'rtl' }}>
                        <p>توضیحات کتاب</p>
                        <ReactQuill
                            value={book.desc_book}
                            onChange={e=>setBook(p=>({...p,desc_book:e}))}
                            theme="snow" // ظاهر ساده ویرایشگر
                            placeholder="اینجا بنویسید..."
                            />
                    </div>
                    <div style={{ direction: 'rtl' }}>
                        <p>درباره کتاب</p>
                        <ReactQuill
                            value={book.about_the_book}
                            onChange={e=>setBook(p=>({...p,about_the_book:e}))}
                            theme="snow" // ظاهر ساده ویرایشگر
                            placeholder="اینجا بنویسید..."
                            />
                    </div>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>دسته‌بندی‌ها</InputLabel>
                        <Select
                            multiple
                            value={book.categories}
                            onChange={handleMultiSelectChange("categories")}
                            renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((id) => {
                                const category = categories.find((c) => c._id === id);
                                return category ? <Chip key={id} label={category.persianName || category.name} /> : null;
                                })}
                            </Box>
                            )}
                        >
                            {categories.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.persianName || item.name}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                        <InputLabel>تاپیک‌ها</InputLabel>
                        <Select
                            multiple
                            value={book.topics}
                            onChange={handleMultiSelectChange("topics")}
                            renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((id) => {
                                const topic = topics.find((t) => t._id === id);
                                return topic ? <Chip key={id} label={topic.name} /> : null;
                                })}
                            </Box>
                            )}
                        >
                            {topics.map(({ _id, name }) => (
                            <MenuItem key={_id} value={_id}>
                                {name}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                        <InputLabel>نویسندگان</InputLabel>
                        <Select
                            multiple
                            value={book.authors}
                            onChange={handleMultiSelectChange("authors")}
                            renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((id) => {
                                const author = authors.find((a) => a._id === id);
                                return author ? <Chip key={id} label={author.name} /> : null;
                                })}
                            </Box>
                            )}
                        >
                            {authors.map(({ _id, name }) => (
                            <MenuItem key={_id} value={_id}>
                                {name}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>


                    {/* <Typography variant="h6">سوالات متداول</Typography>
                    {book.faqs.map((faq, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={2}>
                            <TextField fullWidth label="سوال" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} />
                            <TextField fullWidth label="پاسخ" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} />
                            <IconButton onClick={() => handleRemoveFaq(index)}><DeleteIcon /></IconButton>
                        </Box>
                    ))} */}
                    <Button onClick={handleAddFaq} startIcon={<AddIcon />}>افزودن سوال</Button>
                    
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Link href={`/books/${slug}`} passHref>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />}>بازگشت</Button>
                        </Link>
                        <Button type="submit" variant="contained" startIcon={<SaveIcon />}>ذخیره تغییرات</Button>
                    </Box>
                </form>
                {book?._id&&(
                    <SummeryBox id={book?._id}/>
                )}
            </Paper>
        </Container>
    );
};

export default EditBookPage;



// const parentDiv = document.querySelector('div[data-test-id="reader-content"]');
// let test=[...parentDiv.children]
// const divs=test.filter(item=>item.tagName==='DIV')

// divs.map(div => {
//     // استخراج title (از تگ h4 > span)
//     const title = div.querySelector('h4').innerText;

//     // استخراج heading (از تگ h2 > span)
//     const heading = div.querySelector('h2').innerText;
//     let text=''
//     // استخراج text (از آخرین span)
//      const spans = div.querySelectorAll("span");
//       if (spans.length > 0) {
//            text=  spans[spans.length - 1].innerText
//       }

//     // اضافه کردن اطلاعات به آرایه نتایج
//     return({ title, heading, text });
// });
