import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import main_background from '../assets/main_background.png';
import PathSelection
 from '../components/PathSelection';
 
function MainArchive() {

  return (
    <div style={styles.backgroundStyle}>
      <h1 className='font-kanit text-main text-center'>
        เลือกเนื้อหาที่คุณสนใจ
      </h1>
    </div>
  );
}

export default MainArchive;

const styles = {
    backgroundStyle: {
    backgroundImage: `url(${main_background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // เพิ่ม display flex และ flex-direction column เพื่อให้ใช้ justify-content/align-items ได้
    display: 'flex', 
    flexDirection: 'column', 
    // จัดวางเนื้อหาใน div ให้อยู่ตรงกลางทั้งแนวตั้งและแนวนอน
    alignItems: 'center',
    paddingTop: '2%',
    boxSizing: 'border-box',
  }
};