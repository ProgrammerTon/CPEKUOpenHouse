import React from 'react';

function EditSection({ section, onSave, onBack }) {
    const [detail, setDetail] = React.useState(section.detail || "");

    return (
        <div style={styles.editContainer}>
            <h2>แก้ไขเนื้อหา: {section.title}</h2>
            <p>ประเภท: {section.type === 'content' ? 'เนื้อหา' : 'แบบทดสอบ'}</p>
            
            <textarea
                style={styles.detailInput}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                maxLength={1000}
                placeholder="พิมพ์เนื้อหาที่นี่ (ไม่เกิน 1000 คำ)..."
            />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button style={styles.backBtn} onClick={onBack}>ย้อนกลับ</button>
                <button style={styles.saveBtn} onClick={() => onSave(section.id, detail)}>บันทึกเนื้อหา</button>
            </div>
        </div>
    );
}

const styles = {
    editContainer: { 
        padding: '40px', 
        backgroundColor: '#fff', 
        borderRadius: '20px', 
        width: '100%', 
        maxWidth: '800px' 
    },
    detailInput: { width: '100%', minHeight: '300px', padding: '15px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '1.1rem' },
    saveBtn: { padding: '10px 20px', backgroundColor: '#16A085', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    backBtn: { padding: '10px 20px', backgroundColor: '#bdc3c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};