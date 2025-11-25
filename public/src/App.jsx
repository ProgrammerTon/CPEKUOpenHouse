import React from 'react';
import './styles/fonts.css';
import './styles/colors.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import main_background from './assets/main_background.png';

function App() {
  const verticalAdjustment = '2%';

  const backgroundStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${main_background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // เพิ่ม display flex และ flex-direction column เพื่อให้ใช้ justify-content/align-items ได้
    display: 'flex', 
    flexDirection: 'column', 
    // จัดวางเนื้อหาใน div ให้อยู่ตรงกลางทั้งแนวตั้งและแนวนอน
    alignItems: 'center',
    paddingTop: verticalAdjustment,
  };

  return (
    <div style={backgroundStyle}>
      <h1 className='font-sarabun text-success text-center display-1'>
        CPEKU OPENHOUSE
      </h1>
    </div>
  );
}

export default App;