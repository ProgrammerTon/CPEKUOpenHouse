import React from 'react';

/**
 * Modal สำหรับยืนยันการกระทำที่เป็นอันตราย (เช่น การลบ)
 * @param {object} props
 * @param {string} props.title - หัวข้อของ Modal
 * @param {string} props.message - ข้อความถามยืนยัน
 * @param {function} props.onClose - ฟังก์ชันสำหรับยกเลิก/ปิด Modal
 * @param {function} props.onConfirm - ฟังก์ชันสำหรับยืนยันการกระทำ
 */
const DangerModal = ({ title, message, onClose, onConfirm }) => {
    
    return (
        <div style={styles.overlay}>
            <div style={styles.modalContainer}>
                <h3 style={styles.titleStyle}>{title}</h3>
                <p style={styles.messageStyle}>{message}</p>
                <div style={styles.buttonGroup}>
                    <button 
                        style={styles.cancelButton} 
                        onClick={onClose}
                    >
                        ย้อนกลับ
                    </button>
                    <button 
                        style={styles.confirmButton} 
                        onClick={onConfirm}
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DangerModal;

const styles = {
        overlay: {
            fontFamily: 'font-sans',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // พื้นหลังมืด
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // ให้ Modal อยู่บนสุด
        },
        modalContainer: {
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '450px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
        },
        titleStyle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#C0392B', // สีแดงอันตราย
            marginBottom: '15px',
        },
        messageStyle: {
            fontSize: '1rem',
            color: '#333',
            marginBottom: '30px',
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
        },
        button: {
            padding: '10px 25px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'background-color 0.2s',
        },
        confirmButton: {
            backgroundColor: '#E74C3C', // แดง
            color: 'white',
            // Hover effect
            '&:hover': { backgroundColor: '#C0392B' }
        },
        cancelButton: {
            backgroundColor: '#ECF0F1', // เทาอ่อน
            color: '#333',
            border: '1px solid #BDC3C7',
            // Hover effect
            '&:hover': { backgroundColor: '#D5DBDB' }
        }
    };