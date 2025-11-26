import React, { useState } from 'react';

import '../styles/CircleItem.css'; 

function CircleItem({ title, description, imagePath, circleSize }) {

  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    console.log(`Path selected: ${description}`); 
    alert(`คุณเลือกเส้นทาง: ${description}`);
    // เปลี่ยนหน้า ให้ใช้ navigate('/new-path')
  };

  const dynamicCircleStyle = {
      width: circleSize,
      height: circleSize,
  };

  return (
    <div 
      className="path-item" 
      style={styles.pathItem}
    > 
        <div 
          className="circle-shape" 
          style={{ ...styles.circleShape, ...dynamicCircleStyle }} 
          onClick={handleClick}  
        >
          <img 
            src={imagePath} 
            alt={description} 
            
            className={`circle-image`} 
          />
        </div>
      
      {/* ส่วนคำอธิบายด้านล่าง*/}
      <p 
        className="description-text font-sans text-center"
        style={styles.descriptionText}
      >
        {description}
      </p>
    </div>
  );
}

const styles = {
    pathItem: {
        
    },
    
    circleContainer: {
       
    },

    circleShape: {
      cursor: 'pointer',
    },

    descriptionText: {
      fontSize: '1.5vw', 
      color: '#002C5B', 
      padding: '10px 5px', 
      borderRadius: '5px', 
      lineHeight: 1.5, 
      whiteSpace: 'pre-wrap',
      minHeight: '6rem'
    }
};

export default CircleItem;