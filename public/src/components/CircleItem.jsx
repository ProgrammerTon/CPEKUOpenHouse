import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/CircleItem.css'; 

function CircleItem({ title, description, imagePath, circleSize,path_index }) {

  const navigate = useNavigate(); 

  const handleClick = () => {
    //console.log(`Path selected: ${description}`); 
    if (path_index===1) {
      //alert(`คุณเลือกเส้นทาง: ${description}`);
    }
    if (path_index===2) {
      //alert(`คุณเลือกเส้นทาง: ${description}`);
      navigate('/user');
    }
    if (path_index===3) {
      //alert(`คุณเลือกเส้นทาง: ${description}`);
      window.open('https://www.youtube.com', '_blank');
    }
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