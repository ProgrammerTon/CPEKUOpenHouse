import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import main_background from '../assets/main_background.png';
import KnowledgeBox from '../components/KnowledgeBox';

function MainArchive() {
  // State สำหรับเก็บข้อมูลที่ดึงมาจาก API
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook สำหรับดึงข้อมูลจาก /api/items เมื่อ Component โหลดเสร็จ
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // APIs
        const response = await fetch('http://localhost:5000/api/courses'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setError("ไม่สามารถดึงข้อมูลเนื้อหาได้: โปรดตรวจสอบ Server และ MongoDB Connection");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []); 

  return (
    <div style={{...styles.backgroundStyle, minHeight: '100vh'}}>
      
      {/* ส่วนหัวข้อ */}
      <h1 className='font-sans text-main text-center' style={styles.headingStyle}>
        เลือกเนื้อหาที่คุณสนใจ
      </h1>

      {/* ส่วนแสดงผลตามสถานะ */}
      {loading && <p className='font-sans text-center'>กำลังโหลดข้อมูล...</p>}
      {error && <p className='font-sans text-center' style={{ color: 'red' }}>{error}</p>}
      
      {/* แสดง KnowledgeBox เมื่อโหลดข้อมูลสำเร็จ */}
      {!loading && (
        <KnowledgeBox data={items} /> 
      )}
      
    </div>
  );
}

export default MainArchive;

// --- Styles สำหรับ MainArchive ---
const styles = {
  backgroundStyle: {
    backgroundImage: `url(${main_background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    paddingTop: '50px', 
    boxSizing: 'border-box',
  },
  headingStyle: {
    marginBottom: '20px',
  }
};