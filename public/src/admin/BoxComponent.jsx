import React from 'react';


const BoxComponent = ({ type, index, totalSections, title, onClick, onMove, onDelete, onTitleChange }) => {
    
    const isContent = type === 'content';
    const indexColor = isContent ? '#16A085' : '#8E44AD';

    // ตรวจสอบว่าสามารถเลื่อนขึ้น/ลงได้หรือไม่
    const canMoveUp = index > 0;
    const canMoveDown = index < totalSections - 1;
    const styles = getBoxStyles(indexColor);

    return (
        <div 
            style={styles.boxContainer} 
            // เมื่อคลิกจะเปิดหน้าแก้ไข (ยกเว้นคลิกที่ปุ่มควบคุม)
            onClick={onClick}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
        >
            <div style={styles.contentGroup}>
                <div style={styles.boxIndexContainer}>
                    <div style={{...styles.boxIndex, color: indexColor}}>{(index + 1).toString().padStart(2, '0')}</div>
                    <div style={styles.boxTypeLabel}>{isContent ? 'เนื้อหา' : 'ทดสอบ'}</div>
                </div>
                <div style={styles.boxTitle}>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)} // ส่งค่าที่พิมพ์กลับไปอัปเดต State
                        onClick={(e) => e.stopPropagation()}           // กันไม่ให้คลิกแล้วไปเรียก onClick ของตัว Box
                        style={styles.titleInput}
                        placeholder="ชื่อหัวข้อ"
                        maxLength={100}
                    />
                </div>
            </div>
            
            {/* ปุ่มควบคุมลำดับ */}
            <div style={styles.controlGroup}>
                <button 
                    style={styles.deleteButton} 
                    onClick={(e) => {
                        e.stopPropagation(); // หยุดการทำงานของ onClick บน box container
                        onDelete(); 
                    }}
                >
                    ลบ
                </button>
                <button 
                    style={{...styles.controlButton, opacity: canMoveUp ? 1 : 0.4}} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        if (canMoveUp) onMove(index, 'up');
                    }}
                    disabled={!canMoveUp}
                >
                    ▲
                </button>
                <button 
                    style={{...styles.controlButton, opacity: canMoveDown ? 1 : 0.4}} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        if (canMoveDown) onMove(index, 'down');
                    }}
                    disabled={!canMoveDown}
                >
                    ▼
                </button>
            </div>
        </div>
    );
};

export default BoxComponent;

const getBoxStyles = (indexColor) => ({
    boxContainer: {
        fontFamily: 'font-sans',
        backgroundColor: '#FFFFFF',
        border: `1px solid #E0E0E0`,
        borderRadius: '8px',
        padding: '15px 10px',
        marginBottom: '10px',
        cursor: 'pointer', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        width: '100%', 
        minHeight: '60px', 
        boxSizing: 'border-box',
    },
    contentGroup: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
    },
    boxIndexContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '15px',
        paddingRight: '15px',
        borderRight: '1px solid #CFD8DC',
        minWidth: '60px', 
    },
    boxIndex: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    boxTypeLabel: {
        fontSize: '0.8rem',
        color: '#777',
        marginTop: '2px'
    },
    boxTitle: {
        fontSize: '1rem',
        fontWeight: 'normal',
        color: '#333',
        flexGrow: 1
    },
    controlButton: {
        padding: '3px 8px',
        borderRadius: '4px',
        border: '1px solid #DEDEDE',
        backgroundColor: '#F5F5F5',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        lineHeight: 1,
    },
    controlGroup: {
        display: 'flex',
        alignItems: 'center', // จัดให้อยู่กลางแนวตั้ง
        marginLeft: '15px',
        gap: '10px', // เว้นช่องระหว่างปุ่มลบกับปุ่มเลื่อน
    },
    deleteButton: { // สไตล์ปุ่มลบ
        backgroundColor: '#E74C3C',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s',
        lineHeight: 1, // จัดข้อความให้สวยงาม
    },
    moveButtonGroup: { // จัดกลุ่มปุ่มเลื่อนขึ้นลง
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    titleInput: {
        width: '100%',
        border: 'none',
        borderBottom: '1px dashed #ccc',
        padding: '4px 8px',
        fontSize: '1rem',
        outline: 'none',
        backgroundColor: 'transparent',
        fontFamily: 'inherit',
        color: '#333',
    },
});