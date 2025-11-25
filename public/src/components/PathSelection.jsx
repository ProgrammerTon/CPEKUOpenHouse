import React from 'react';
import CircleItem from './CircleItem';
import { Container } from 'react-bootstrap';

import path_image_1 from '../assets/path1.png'; 
import path_image_2 from '../assets/path1.png'; 
import path_image_3 from '../assets/path1.png'; 

import measureWindowSize from '../hooks/measureWindowSize';

function PathSelection() {
    const { width } = measureWindowSize(); 

    const circleSize = width * 0.25; 
    
    if (!width) {
        return null;
    }

    const pathData = [
    {
        image: path_image_1,
        description: "เดินสำรวจอาคารภาควิชา วิศวกรรมคอมพิวเตอร์อันเป็นที่รัก"
    },
    {
        image: path_image_2,
        description: "เรียนรู้กับอาจารย์และ ทดสอบความสามารถ"
    },
    {
        image: path_image_3,
        description: "คลี่คลายข้อสงสัยให้กระจ่าง พร้อมแชทบอทที่ช่วยชี้แจงแถลงไข" 
    },
    ];

    return (
        <Container style={styles.mainContainer} className="d-flex flex-column align-items-center">
            <h2 
                className="font-kanit text-main text-center mb-5" 
                style={styles.title}
            >
                เลือกเส้นทางที่คุณต้องการ
            </h2>
            
            <div style={styles.pathsContainer} className="circle-container">
                {pathData.map((path, index) => (
                    <CircleItem
                        key={index}
                        imagePath={path.image}
                        description={path.description}
                        circleSize={circleSize}
                    />
                ))}
            </div>
        </Container>
    );
}

const styles = {
    title: {
        fontSize: '2vw',
        fontWeight: 'bold',
    },
    mainContainer: {
    },
    pathsContainer: {
    }
};


export default PathSelection;