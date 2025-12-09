import React, { useState } from 'react';
import BoxComponent from './BoxComponent'; 
import DangerModal from './DangerModal';
// ฟังก์ชันสำหรับจัดการการสลับตำแหน่งของรายการ
const swapElements = (list, index1, index2) => {
    const result = Array.from(list);
    [result[index1], result[index2]] = [result[index2], result[index1]];
    return result;
};

function AddCourse() {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [sections, setSections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    const generateUniqueId = () => `section-${Date.now()}-${Math.random()}`;

    const handleAddContent = () => {
        const newSection = { id: generateUniqueId(), type: 'content', title: `ส่วนเนื้อหาใหม่ ${sections.length + 1}` };
        setSections([...sections, newSection]);
    };

    const handleAddQuiz = () => {
        const newSection = { id: generateUniqueId(), type: 'quiz', title: `แบบทดสอบใหม่ ${sections.length + 1}` };
        setSections([...sections, newSection]);
    };

    const handleMoveSection = (index, direction) => {
        let newIndex = index;
        if (direction === 'up' && index > 0) newIndex = index - 1;
        else if (direction === 'down' && index < sections.length - 1) newIndex = index + 1;
        else return;

        const reorderedSections = swapElements(sections, index, newIndex);
        setSections(reorderedSections);
    };

    const handleBoxClick = (sectionId, index) => {
        alert(`คลิกเพื่อแก้ไขส่วน: ${sections[index].title} (ลำดับที่ ${index + 1})`);
    };
    
    const handleSubmit = () => {
        if (courseTitle.trim() === '' || sections.length === 0) {
            alert('กรุณากรอกชื่อสื่อการสอนและเพิ่มส่วนประกอบอย่างน้อย 1 ส่วน');
            return;
        }
        console.log('ข้อมูลคอร์สพร้อมส่ง...');
        alert('สร้างคอร์สเสร็จสิ้น! ข้อมูลพร้อมสำหรับการเชื่อมต่อ Backend');
    };
    const handleInitiateDelete = (sectionId) => {
        setSectionToDelete(sectionId);
        setIsModalOpen(true);
    };

    // 2. ยืนยันการลบ
    const handleConfirmDelete = () => {
        if (sectionToDelete) {
            setSections(sections.filter(s => s.id !== sectionToDelete));
        }
        // ปิด Modal และรีเซ็ต State
        setIsModalOpen(false);
        setSectionToDelete(null);
    };

    // 3. ยกเลิกการลบ (ปิด Modal)
    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setSectionToDelete(null);
    };

    // ปุมเลื่อนลำดับ
    const renderSections = () => (
        <div style={styles.listArea}>
            {sections.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#7F8C8D', padding: '50px 0' }}>
                    💡 กดปุ่มด้านบนเพื่อเพิ่มส่วนเนื้อหาหรือแบบทดสอบ
                </div>
            ) : (
                sections.map((section, index) => (
                    <BoxComponent
                        key={section.id}
                        type={section.type}
                        index={index} 
                        totalSections={sections.length}
                        title={section.title}
                        onClick={() => handleBoxClick(section.id, index)} 
                        onMove={handleMoveSection}
                        onDelete={() => handleInitiateDelete(section.id)}
                    />
                ))
            )}
        </div>
    );

    return (
        <div style={styles.backgroundStyle}>
            <h1 className='font-sans text-main text-center' style={styles.header}>
                สร้างสื่อการสอน
            </h1>
            
            <div style={styles.mainContentArea}>
                {/* Panel ซ้าย: ข้อมูลคอร์สหลัก */}
                <div style={styles.leftPanel}>
                    <div style={styles.formGroup}>
                        <label htmlFor="courseTitle" style={styles.label}>ชื่อสื่อการสอน:</label>
                        <input
                            id="courseTitle"
                            type="text"
                            style={styles.input}
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            maxLength={100} 
                            placeholder="ชื่อสื่อการสอน..."
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="courseDescription" style={styles.label}>คำอธิบายเบื้องต้น:</label>
                        <textarea
                            id="courseDescription"
                            style={styles.textarea}
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            maxLength={500}
                            placeholder="คำอธิบายเนื้อหาโดยย่อ..."
                        />
                    </div>
                </div>

                {/* Panel ขวา: ส่วนประกอบ เนื้อหา/แบบทดสอบ */}
                <div style={styles.rightPanel}>
                    
                    {/* ปุ่มเพิ่มส่วนประกอบ */}
                    <div style={styles.addButtonGroup}>
                        <button style={styles.addButton} onClick={handleAddContent}>เพิ่มเนื้อหา</button>
                        <button style={styles.addButton} onClick={handleAddQuiz}>เพิ่มแบบทดสอบ</button>
                    </div>

                    {renderSections()}

                    {/* ปุ่มสร้างเสร็จสิ้น (ล่างขวา) */}
                    <button style={styles.submitButton} onClick={handleSubmit}>
                        สร้างเสร็จสิ้น
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <DangerModal
                    title="ยืนยันการลบส่วนประกอบ"
                    message="คุณแน่ใจหรือไม่ว่าต้องการลบส่วนประกอบนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}

export default AddCourse;

const INPUT_BASE = { // สร้าง Base Style สำหรับ Input/Textarea
    width: '100%',
    padding: '10px',
    border: '1px solid #BDC3C7',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '1rem',
    backgroundColor: '#FFFF00',
    maxLength: '100' // ใส่ไว้ที่นี่ แต่ต้องใช้ attribute ใน JSX จริง
};

const PANEL_BASE = {
    flex: 1,
    height: '500px',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#E6F4E6', 
    border: '3px solid #A9D18E',
    display: 'flex',
    flexDirection: 'column',
};


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
    header: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '40px',
        color: '#16A085', 
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        padding: '10px 30px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    mainContentArea: {
        display: 'flex',
        gap: '40px',
        width: '90%',
        maxWidth: '1200px',
    },
    leftPanel: {
        ...PANEL_BASE, 
    },
    rightPanel: {
        ...PANEL_BASE,
        
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#34495E',
        fontSize: '1.1rem'
    },
    input: {
        ...INPUT_BASE,
        height: '45px',
    },
    textarea: {
        ...INPUT_BASE,
        resize: 'vertical',
        minHeight: '200px',
        maxLength: '500', 
        padding: '10px',
    },
    addButtonGroup: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    addButton: {
        flex: 1,
        padding: '12px 20px',
        borderRadius: '8px',
        border: '1px solid #FFC107',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'background-color 0.3s',
        backgroundColor: '#FFEB3B',
    },
    listArea: {
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '15px',
        paddingBottom: '10px',
        flexGrow: 1, 
        marginTop: '10px'
    },
    submitButton: {
        position: 'absolute',
        bottom: '20px',
        right: '30px',
        backgroundColor: '#FFEB3B',
        border: '1px solid #FFC107',
        padding: '12px 30px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'opacity 0.3s',
        marginTop: '20px'
    }
};