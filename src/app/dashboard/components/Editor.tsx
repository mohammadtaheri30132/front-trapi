import { useState } from "react";

const SimpleEditor = ({ setEditorContent, editorContent }) => {

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        document.execCommand("insertImage", false, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event) => {
    setEditorContent(event.target.innerHTML);
  };

  return (
    <div>
      <div>
        {/* <button
          onClick={() => document.execCommand("bold")}
          style={{ marginRight: "8px" }}
        >
          پررنگ
        </button>
        <button
          onClick={() => document.execCommand("italic")}
          style={{ marginRight: "8px" }}
        >
          ایتالیک
        </button>
        <button
          onClick={() => document.execCommand("underline")}
          style={{ marginRight: "8px" }}
        >
          زیرخط
        </button> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginLeft: "8px" }}
        />
      </div>

      <div
        contentEditable
        dir="rtl" 
        style={{
          border: "1px solid #ccc",
          minHeight: "200px",
          padding: "10px",
          marginTop: "10px",
          direction: "rtl", // اضافه کردن جهت راست به چپ
          fontFamily: "Vazir, Tahoma, sans-serif", // استفاده از فونت مناسب برای فارسی
        }}
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: editorContent }}
      ></div>

      <div style={{ marginTop: "20px" }}>
        <h3>محتوای ویرایش شده:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorContent }}></div>
      </div>
    </div>
  );
};

export default SimpleEditor;
