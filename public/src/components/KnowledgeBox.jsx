import React from 'react';

const test_data = [
    { name: 'Test - Python' }, 
    { name: 'Test - C++' }, 
    { name: 'Test - OS' }
];

function KnowledgeBox({ data, onEdit, onDelete}) {
  const dataToDisplay = data && data.length > 0 ? data : test_data;
  
return (
      <div style={tableStyles.container} className="font-sans">
        <div style={tableStyles.header}>รายชื่อเนื้อหา</div>

        <div style={tableStyles.body}>
          {dataToDisplay.map((item, index) => {
            const isEven = index % 2 === 0;
            const rowStyle = isEven ? tableStyles.rowEven : tableStyles.rowOdd;

            return (
              <div
                key={item._id || index}
                style={{ ...tableStyles.rowBase, ...rowStyle }}
                className="font-sans"
              >
                {/* ส่วนที่คลิกเพื่อเข้าดูหรือแก้ไข (ด้านซ้าย) */}
                <div 
                  style={tableStyles.contentClickable} 
                  onClick={() => {
                    if (item._id) onEdit(item._id);
                    else alert("รายการนี้ไม่มี ID (ข้อมูลทดสอบ)");
                  }}
                >
                  <span style={tableStyles.numberBadge}>{index + 1}</span>
                  <span style={tableStyles.textName}>{item.name}</span>
                </div>

                {/* ส่วนปุ่มลบ (แสดงเฉพาะเมื่อมีการส่ง onDelete มา - หน้า Admin) */}
                {onDelete && (
                  <button
                    style={tableStyles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onDelete(item._id);
                    }}
                  >
                    ลบ
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default KnowledgeBox;

const tableStyles = {
  container: {
    width: '100%',
    margin: '20px auto', 
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  header: {
    backgroundColor: '#1e3a8a',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    fontSize: '2em',
    fontWeight: 'bold',
  },
  rowBase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', 
    padding: '12px 25px',
    borderBottom: '1px solid #f0f0f0',
  },
  contentClickable: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1, 
    cursor: 'pointer',
    padding: '6px 0',
  },
  rowEven: { backgroundColor: '#ffffff' },
  rowOdd: { backgroundColor: '#f8fbff' },
  numberBadge: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.9em',
    fontWeight: 'bold',
    marginRight: '20px',
    flexShrink: 0,
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
  },
  textName: {
    fontSize: '1.1em',
    color: '#334155',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    marginLeft: '10px',
  }
};