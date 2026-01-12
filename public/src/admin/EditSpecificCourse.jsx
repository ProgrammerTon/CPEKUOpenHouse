import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoxComponent from './BoxComponent'; 
import DangerModal from './DangerModal';

// --- Logic ยังคงเดิมทุกประการ ---
const swapElements = (list, index1, index2) => {
    const result = Array.from(list);
    [result[index1], result[index2]] = [result[index2], result[index1]];
    return result;
};

function EditSpecificCourse() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [sections, setSections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`);
                const data = await response.json();
                setCourseTitle(data.name);
                setCourseDescription(data.description);
                setSections(data.sections || []);
            } catch (err) {
                alert("ไม่สามารถโหลดข้อมูลคอร์สได้");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

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

    const handleBoxClick = (section) => {
        setScrollPosition(window.scrollY);
        setEditingSection(section); 
    };
    
    const handleUpdateDetail = (id, newDetail) => {
        setSections(prevSections => {
            const updated = prevSections.map(s => 
                s.id === id ? { ...s, detail: newDetail } : s
            );
            return updated;
        });
        setEditingSection(null); 

        requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition);
        });
    };

    const handleUpdateSubmit = async () => {
        if (courseTitle.trim() === '' || sections.length === 0) {
            alert('กรุณากรอกชื่อสื่อการสอนและเพิ่มส่วนประกอบอย่างน้อย 1 ส่วน');
            return;
        }
        const updatedData = { name: courseTitle, description: courseDescription, sections: sections };
        try {
            const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                alert('ยืนยันแก้ไขสื่อการสอนสำเร็จ!');
                navigate('/edit-course');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        }
    };

    const handleInitiateDelete = (sectionId) => {
        setSectionToDelete(sectionId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (sectionToDelete) {
            setSections(sections.filter(s => s.id !== sectionToDelete));
        }
        setIsModalOpen(false);
        setSectionToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setSectionToDelete(null);
    };

    const renderSections = () => (
        <div style={styles.listArea}>
            {sections.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#BDC3C7', padding: '50px 0' }}>
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
                        onClick={() => handleBoxClick(section)}
                        onMove={handleMoveSection}
                        onDelete={() => handleInitiateDelete(section.id)}
                        onTitleChange={(newTitle) => {
                            const updated = [...sections];
                            updated[index].title = newTitle;
                            setSections(updated);
                        }}
                    />
                ))
            )}
        </div>
    );

    if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>กำลังโหลดข้อมูล...</div>;

    const renderOnlyLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const links = text.match(urlRegex); // ค้นหา URL ทั้งหมดแล้วเก็บเป็น Array
        
        if (!links) return <span style={{ color: '#999', fontStyle: 'italic' }}>ไม่พบลิงก์ในข้อความ</span>;

        return links.map((link, i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#007BFF', textDecoration: 'underline', wordBreak: 'break-all' }}
            >
                {link}
            </a>
            </div>
        ));
    };

    return (
        <div style={styles.backgroundStyle}>
            {editingSection ? (
                <div style={styles.editWrapper}>
                    <h2 style={{color: '#00695C', marginBottom: '20px'}}>แก้ไขเนื้อหา: {editingSection.title}</h2>
                    <textarea
                        style={styles.detailTextArea}
                        value={editingSection.detail || ""}
                        onChange={(e) => setEditingSection({...editingSection, detail: e.target.value})}
                        maxLength={1000}
                        placeholder="พิมพ์รายละเอียดเนื้อหาที่นี่..."
                    />
                    {/* ส่วนแสดงเฉพาะลิงก์ที่แก้ไขใหม่ */}
                    <div style={{
                        width: '100%', 
                        marginTop: '15px', 
                        padding: '15px', 
                        backgroundColor: '#f1f8f7', 
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        textAlign: 'left',
                        border: '1px solid #e0e0e0',
                        boxSizing: 'border-box'
                    }}>
                        <strong style={{ color: '#00695C', display: 'block', marginBottom: '10px' }}>🔗 ลิงก์ที่ตรวจพบในเนื้อหา:</strong>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {renderOnlyLinks(editingSection.detail || "")}
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center', width: '100%'}}>
                        <button 
                            style={styles.backButton} 
                            onClick={() => {
                                setEditingSection(null);
                                requestAnimationFrame(() => {
                                    window.scrollTo(0, scrollPosition);
                                });
                            }}
                        >
                            ย้อนกลับ
                        </button>
                        <button style={styles.saveDetailButton} onClick={() => handleUpdateDetail(editingSection.id, editingSection.detail)}>บันทึกเนื้อหา</button>
                    </div>
                </div>
            ) : (
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h1 className='font-sans' style={styles.header}>แก้ไขสื่อการสอน</h1>
                    <p style={{color: '#7f8c8d', marginBottom: '30px'}}>จัดการเนื้อหาและแบบทดสอบของคอร์สเรียน</p>
                    
                    <div style={styles.mainContentArea}>
                        {/* Section 1: ข้อมูลสื่อการสอน */}
                        <div style={styles.cardPanel}>
                            <h3 style={styles.panelTitle}>📖 ข้อมูลสื่อการสอน</h3>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>ชื่อสื่อการสอน</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={courseTitle}
                                    onChange={(e) => setCourseTitle(e.target.value)}
                                    placeholder="กรอกชื่อสื่อการสอน..."
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>คำอธิบายเบื้องต้น</label>
                                <textarea
                                    style={styles.textarea}
                                    value={courseDescription}
                                    onChange={(e) => setCourseDescription(e.target.value)}
                                    placeholder="คำอธิบายเนื้อหาโดยย่อ..."
                                />
                            </div>
                        </div>

                        {/* Section 2: รายการเนื้อหา */}
                        <div style={styles.cardPanel}>
                            <h3 style={styles.panelTitle}>📑 รายการเนื้อหา</h3>
                            <div style={styles.addButtonGroup}>
                                <button style={styles.addButton} onClick={handleAddContent}>+ เพิ่มเนื้อหา</button>
                                <button style={styles.addButton} onClick={handleAddQuiz}>+ เพิ่มแบบทดสอบ</button>
                            </div>
                            {renderSections()}
                        </div>
                    </div>

                    <button style={styles.submitButton} onClick={handleUpdateSubmit}>
                        ยืนยันแก้ไขสื่อการสอน
                    </button>
                </div>
            )}

            {isModalOpen && (
                <DangerModal
                    title="ยืนยันการลบส่วนประกอบ"
                    message="คุณแน่ใจหรือไม่ว่าต้องการลบส่วนประกอบนี้?"
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}

// --- Styles ปรับปรุงใหม่ตามภาพ Reference ---
const styles = {
    backgroundStyle: {
        backgroundColor: '#F8F9FA', // สีพื้นหลังเทาอ่อนตามภาพ
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        fontFamily: "'Sarabun', sans-serif"
    },
    header: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '10px',
    },
    mainContentArea: {
        display: 'flex',
        flexDirection: 'column', // ปรับเป็นแนวตั้งตามภาพที่ซ้อนกัน
        gap: '30px',
        width: '100%',
        maxWidth: '1000px',
    },
    cardPanel: {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E0E0E0',
    },
    panelTitle: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#004D40',
        marginBottom: '20px',
        borderBottom: '2px solid #F1F1F1',
        paddingBottom: '10px'
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#34495E',
    },
    input: {
        width: '100%',
        height: '50px',
        padding: '10px 15px',
        border: '1px solid #DCDFE6',
        borderRadius: '10px',
        fontSize: '1rem',
        backgroundColor: '#FFFFFF',
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '15px',
        border: '1px solid #DCDFE6',
        borderRadius: '10px',
        fontSize: '1rem',
        resize: 'vertical',
        backgroundColor: '#FFFFFF',
    },
    addButtonGroup: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
    },
    addButton: {
        flex: 1,
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #DCDFE6',
        backgroundColor: '#FFFFFF',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s',
        fontSize: '1rem'
    },
    listArea: {
        marginTop: '10px'
    },
    submitButton: {
        marginTop: '40px',
        backgroundColor: '#00897B', // สีเขียวหัวเป็ดตามภาพ
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: 'fit-content'
    },
    editWrapper: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '800px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    detailTextArea: {
        width: '100%',
        height: '400px',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        fontSize: '1.1rem',
        fontFamily: 'inherit',
        resize: 'none',
        outline: 'none'
    },
    saveDetailButton: {
        padding: '12px 30px',
        backgroundColor: '#00897B',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    backButton: {
        padding: '12px 30px',
        backgroundColor: '#BDC3C7',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer'
    }
};

export default EditSpecificCourse;