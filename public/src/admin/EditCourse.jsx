import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import main_background from '../assets/main_background.png';
import KnowledgeBox from '../components/KnowledgeBox';
import { useNavigate } from 'react-router-dom';
import DangerModal from './DangerModal';

function EditCourse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();

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

  // ส่วนที่ 1: เมื่อกดปุ่มลบจากตาราง (แค่เปิด Modal และจำ ID ไว้)
  const handleInitiateDelete = (courseId) => {
      setSelectedCourseId(courseId);
      setIsModalOpen(true);
  };

  // ส่วนที่ 2: ฟังก์ชันที่จะทำงานเมื่อกดยืนยันใน Modal (ยิง API จริง)
  const handleConfirmDelete = async () => {
      if (!selectedCourseId) return;

      try {
          const response = await fetch(`http://localhost:5000/api/courses/${selectedCourseId}`, {
              method: 'DELETE',
          });
          
          if (response.ok) {
              setItems(prevItems => prevItems.filter(item => item._id !== selectedCourseId));
              alert("ลบสื่อการสอนสำเร็จ");
          } else {
              alert("เกิดข้อผิดพลาดในการลบข้อมูล");
          }
      } catch (err) {
          alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      } finally {
          // ปิด Modal และรีเซ็ตค่าเสมอ
          setIsModalOpen(false);
          setSelectedCourseId(null);
      }
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken'); // หรือ sessionStorage ตามที่คุณเลือกใช้
    window.location.href = '/login'; // ดีดกลับไปหน้า Login
  };

  return (
    <div style={{...styles.backgroundStyle, minHeight: '100vh'}}>
      
      {/* ส่วนหัวข้อ */}
      <h1 className='font-sans text-main text-center' style={styles.headingStyle}>
        สื่อการสอนทั้งหมด (แอดมิน)
      </h1>


      {/* ส่วนแสดงผลตามสถานะ */}
      {loading && <p className='font-sans text-center'>กำลังโหลดข้อมูล...</p>}
      {error && <p className='font-sans text-center' style={{ color: 'red' }}>{error}</p>}
      
      {/* แสดง KnowledgeBox เมื่อโหลดข้อมูลสำเร็จ */}
      {!loading && (
        <div style={{ width: '100%', maxWidth: '900px', padding: '0 20px' }}> 
          <KnowledgeBox 
              data={items} 
              onEdit={(id) => navigate(`/edit-specific-course/${id}`)} 
              onDelete={(id) => handleInitiateDelete(id)}
          />
        </div>
      )}
      {isModalOpen && (
            <DangerModal 
                title="ยืนยันการลบสื่อการสอน"
                message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleConfirmDelete}     
            />
        )}
      {/* ปุ่มสร้างใหม่ */}
      <button 
        onClick={() => navigate('/admin')} 
        style={styles.createButton}
      >
        + สร้างสื่อการสอนใหม่
      </button>
      <button onClick={handleLogout} style={styles.logoutBtn}>ออกจากระบบ</button>
    </div>
  );
}

export default EditCourse;

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
  },
  createButton: {
    backgroundColor: '#16A085',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'background 0.3s'
  },
  logoutBtn: {
        position: 'fixed', 
        bottom: '30px',   
        right: '30px',   
        backgroundColor: '#E74C3C', 
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '50px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)', 
        zIndex: 1000,
        transition: 'all 0.3s ease',
    }
};