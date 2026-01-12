import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import main_background from '../assets/main_background.png';
import KnowledgeBox from '../components/KnowledgeBox';

function MainArchive() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses'); 
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []); 

  return (
    <div style={styles.backgroundStyle}>
      <h1 className='font-sans text-main text-center' style={styles.headingStyle}>เลือกเนื้อหาที่คุณสนใจ</h1>
      
      {!loading && (
        <div style={styles.tableWrapper}>
          <KnowledgeBox 
            data={items} 
            // เมื่อ User กด ให้ไปหน้าแสดงเนื้อหา
            onEdit={(id) => navigate(`/course-content/${id}`)} 
          /> 
        </div>
      )}
    </div>
  );
}

const styles = {
  backgroundStyle: {
    backgroundImage: `url(${main_background})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    paddingTop: '60px',
  },
  headingStyle: {
    marginBottom: '20px',
  },
  tableWrapper: {
    width: '100%',
    maxWidth: '800px', // คุมความกว้างไม่ให้ยืดเกินไป
    padding: '0 20px'
  }
};

export default MainArchive;