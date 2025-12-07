import React from 'react';
import CircleItem from './CircleItem';
import { Container } from 'react-bootstrap';

import path_image_1 from '../assets/path1.png'; 
import path_image_2 from '../assets/path2.png'; 
import path_image_3 from '../assets/path3.png'; 

import measureWindowSize from '../hooks/measureWindowSize';

function PathSelection() {
    const { width } = measureWindowSize(); 

    const circleSize = width * 0.24; 
    
    if (!width) {
        return null;
    }

    const pathData = [
    {
        image: path_image_1,
        description: "เดินสำรวจอาคารภาควิชา วิศวกรรมคอมพิวเตอร์\nอันเป็นที่รัก",
        path_index: 1
    },
    {
        image: path_image_2,
        description: "เรียนรู้กับอาจารย์และ ทดสอบความสามารถ",
        path_index: 2
    },
    {
        image: path_image_3,
        description: "คลี่คลายข้อสงสัยให้กระจ่าง พร้อมแชทบอทที่ช่วยชี้แจงแถลงไข",
        path_index: 3
    },
    ];

    return (
        <Container style={styles.mainContainer} className="d-flex flex-column align-items-center">
            <h2 
                className="font-sans text-center" 
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
                        path_index={path.path_index}
                    />
                ))}
            </div>
        </Container>
    );
}

const styles = {
    title: {
        fontSize: '3vw',
        fontWeight: 'bold',
        marginTop: '5vw',
    },
    mainContainer: {
    },
    pathsContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: '-6vw'
    }
};


export default PathSelection;