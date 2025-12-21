import React from 'react';
import '../styles/fonts.css';
import '../styles/colors.css';
import main_background from '../assets/main_background.png';

function MakeQuiz() {

  return (
    <div style={styles.backgroundStyle}>
            <h1 className='font-sans text-main text-center' style={styles.header}>
                สร้างแบบทดสอบ
            </h1>
    </div>
  );
}

export default MakeQuiz;

const styles = {
    backgroundStyle: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        paddingTop: '20px',
        paddingBottom: '50px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        backgroundColor: '#F7F9FC',
        fontFamily: 'font-sans'
    },
};
