import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CourseContent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingSection, setViewingSection] = useState(null); // เก็บ Section ที่กำลังอ่าน

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`);
                const data = await response.json();
                setCourse(data);
            } catch (err) {
                alert("ไม่สามารถโหลดเนื้อหาได้");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>กำลังโหลดข้อมูล...</div>;

    const renderTextWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'underline' }}>{part}</a>;
            }
            return part;
        });
    };

    return (
        <div style={styles.backgroundStyle}>
            {viewingSection ? (
                /* 1. หน้าแสดงรายละเอียดเนื้อหา (เมื่อกดเข้าบล็อกแล้ว) */
                <div style={styles.contentWrapper}>
                    <div style={styles.contentHeader}>
                        <span style={styles.typeBadge}>
                            {viewingSection.type === 'content' ? '📖 เนื้อหา' : '📝 แบบทดสอบ'}
                        </span>
                        <h2 style={{color: '#00695C', margin: '10px 0'}}>{viewingSection.title}</h2>
                    </div>
                    
                    <div style={styles.detailBox}>
                        {viewingSection.detail ? (
                            <p style={styles.detailText}>{renderTextWithLinks(viewingSection.detail || "")}</p>
                        ) : (
                            <p style={{color: '#95a5a6', fontStyle: 'italic', textAlign: 'center'}}>ไม่มีรายละเอียดเนื้อหาในส่วนนี้</p>
                        )}
                    </div>

                    <button style={styles.backToMenuButton} onClick={() => setViewingSection(null)}>
                        กลับสู่หน้ารายการ
                    </button>
                </div>
            ) : (
                /* 2. หน้าสารบัญ (รวมบล็อกเนื้อหา) */
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <button onClick={() => navigate('/user')} style={styles.exitButton}>← ออกจากบทเรียน</button>
                    
                    <h1 style={styles.headerTitle}>{course?.name}</h1>
                    <p style={styles.headerDesc}>{course?.description}</p>
                    
                    <div style={styles.mainContentArea}>
                        <div style={styles.cardPanel}>
                            <h3 style={styles.panelTitle}>📑 รายการเนื้อหาทั้งหมด</h3>
                            <div style={styles.listArea}>
                                {course?.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        style={styles.sectionBlock}
                                        onClick={() => setViewingSection(section)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div style={styles.blockInfo}>
                                            <span style={styles.numberBadge}>{index + 1}</span>
                                            <div>
                                                <div style={styles.blockTitle}>{section.title}</div>
                                                <div style={styles.blockType}>
                                                    {section.type === 'content' ? 'คลิกเพื่ออ่านเนื้อหา' : 'คลิกเพื่อทำแบบทดสอบ'}
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{color: '#00897B', fontSize: '1.2rem'}}>→</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Styles สำหรับหน้า CourseContent ---
const styles = {
    backgroundStyle: {
        backgroundColor: '#F8F9FA',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        fontFamily: "'Sarabun', sans-serif"
    },
    exitButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#BDC3C7',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '20px'
    },
    headerTitle: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '10px',
    },
    headerDesc: {
        color: '#7f8c8d',
        marginBottom: '30px',
        textAlign: 'center',
        maxWidth: '600px'
    },
    mainContentArea: {
        width: '100%',
        maxWidth: '800px',
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
    listArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    sectionBlock: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #F0F0F0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    blockInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    numberBadge: {
        width: '35px',
        height: '35px',
        backgroundColor: '#E0F2F1',
        color: '#00897B',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    blockTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#34495E'
    },
    blockType: {
        fontSize: '0.85rem',
        color: '#95a5a6'
    },
    /* --- Styles สำหรับหน้าอ่านเนื้อหา --- */
    contentWrapper: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '850px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column'
    },
    contentHeader: {
        borderBottom: '2px solid #E0F2F1',
        paddingBottom: '20px',
        marginBottom: '30px'
    },
    typeBadge: {
        backgroundColor: '#00897B',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    },
    detailBox: {
        minHeight: '300px'
    },
    detailText: {
        fontSize: '1.15rem',
        lineHeight: '1.8',
        color: '#2C3E50',
        whiteSpace: 'pre-wrap'
    },
    backToMenuButton: {
        alignSelf: 'center',
        marginTop: '40px',
        backgroundColor: '#00897B',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default CourseContent;