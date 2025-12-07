import React from 'react';

// test_data ไว้ใช้ในกรณีที่ต้องการทดสอบ Front-end อย่างเดียว
const test_data = [
    { name: 'Test - Python' }, 
    { name: 'Test - C++' }, 
    { name: 'Test - OS' }
];

// ฟังก์ชันสำหรับ action คลิก
const handleItemClick = (itemName) => {
  alert(`คุณเลือกเนื้อหา: ${itemName}`);
};

// รับ 'data' เข้ามาเป็น prop
function KnowledgeBox({ data }) {
  // ใช้ 'data' ที่ส่งมาจาก prop (มาจาก API) เป็นหลัก
  // ถ้า data เป็น null หรือว่าง (หรือเกิด error ในการ fetch) ให้ใช้ test_data แทน
  const dataToDisplay = data && data.length > 0 ? data : test_data;
  
  return (
    <div style={tableStyles.container} className="font-sans">
      
      {/* ส่วนหัวตาราง */}
      <div style={tableStyles.header} className="font-sans">
        รายชื่อเนื้อหา
      </div>

      {/* ส่วนเนื้อหาตาราง (n x 1) */}
      <div style={tableStyles.body}>
        {dataToDisplay.map((item, index) => {
          // กำหนดสีพื้นหลังสลับกัน: เขียวเข้ม / เขียวอ่อน
          const isEven = index % 2 === 0;
          const rowStyle = isEven ? tableStyles.rowEven : tableStyles.rowOdd;

          return (
            <div
              key={item._id || index} // ใช้ _id เป็น key
              style={{ ...tableStyles.rowBase, ...rowStyle }}
              className="font-sans"
              onClick={() => handleItemClick(item.name)}
              role="button"
              tabIndex={0}
            >
              {item.name}
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
    width: '80%', 
    maxWidth: '600px', 
    margin: '20px auto', 
    border: '1px solid #38761D', 
    borderRadius: '4px',
    overflow: 'hidden', 
  },
  header: {
    backgroundColor: '#87CEFA', 
    color: '#000',
    padding: '10px',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  rowBase: {
    padding: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s', 
  },
  rowEven: {
    backgroundColor: '#6AA84F',
    color: '#fff',
  },
  rowOdd: {
    backgroundColor: '#A9D18E', 
    color: '#000',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  }
};