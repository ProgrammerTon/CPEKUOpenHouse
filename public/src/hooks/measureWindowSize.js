import { useState, useEffect } from 'react';

/**
 * Custom Hook สำหรับติดตามขนาดความกว้างและความสูงของหน้าจอ (Viewport)
 * @returns {object} { width: number, height: number }
 */
function measureWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // 2. Function ที่ใช้ในการอัปเดต State
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 3. เรียกใช้ handleResize ทันทีเมื่อ Component ถูก Mount (เพื่อให้ได้ขนาดตั้งแต่แรก)
    handleResize();
    
    // 4. กำหนด Listener เมื่อหน้าจอถูกปรับขนาด
    window.addEventListener('resize', handleResize);

    // 5. Cleanup Function: ลบ Listener ออกเมื่อ Component ถูกถอดออก
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Array ว่าง [] ทำให้ Effect ทำงานแค่ครั้งเดียวเมื่อ Component โหลด

  return windowSize; // คืนค่า Object ที่มี width และ height
}

export default measureWindowSize;