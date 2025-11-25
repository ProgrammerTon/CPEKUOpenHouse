import React from 'react';

import '../styles/CircleItem.css'; 

function CircleItem({ title, description, imagePath, circleSize }) {

  const dynamicCircleStyle = {
      width: circleSize,
      height: circleSize,
  };

  return (
    <div className="path-item" style={styles.pathItem}> 
      <div className="circle-container" style={styles.circleContainer}>
        <div 
          className="circle-shape" 
          style={{ ...styles.circleShape, ...dynamicCircleStyle }}
        >
          <img 
            src={imagePath} 
            alt={description} 
            className="circle-image" 
          />
        </div>
      </div>
      <p 
        className="description-text font-kanit text-center"
        style={styles.descriptionText}
      >
        {description}
      </p>
    </div>
  );
}

const styles = {
    pathItem: {
        // เพิ่มสไตล์สำหรับ div.path-item ที่นี่
    },
    
    circleContainer: {
        // เพิ่มสไตล์สำหรับ div.circle-container ที่นี่
    },

    circleShape: {
        // เพิ่มสไตล์สำหรับ div.circle-shape ที่นี่
    },

    descriptionText: {
        // *** สไตล์สำหรับข้อความคำอธิบาย ***
        fontSize: '1.2rem', // ตัวอย่าง: กำหนดขนาดตัวอักษรให้ใหญ่ขึ้นเล็กน้อย
        color: '#002C5B', // ตัวอย่าง: กำหนดสีตัวอักษรใหม่ (ถ้า text-main ไม่พอ)
        padding: '10px 5px', // ตัวอย่าง: กำหนดขอบด้านใน
        borderRadius: '5px', // ตัวอย่าง: ทำให้ขอบมนขึ้น
        lineHeight: 1.5, // ตัวอย่าง: กำหนดระยะห่างระหว่างบรรทัด
    }
};

export default CircleItem;