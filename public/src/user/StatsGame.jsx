import React, { useState, useEffect, useCallback } from 'react';

function StatsGame() {
  const [size, setSize] = useState(5);
  const [isPositiveOnly, setIsPositiveOnly] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [answers, setAnswers] = useState({
    min: '', max: '', range: '', mean: '', median: '', mode: '', sd: '', variance: ''
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (key, value) => {
  // สำหรับ Mode: ยอมรับ ตัวเลขที่มีทศนิยม 2 ตำแหน่ง, ค่าว่าง, หรือเครื่องหมาย "-" ตัวเดียว
    if (key === 'mode') {
        const modeRegex = /^-?\d*\.?\d{0,2}$|^-$|/; 
        if (value === '-' || value === '' || (modeRegex.test(value) && parseFloat(value) <= 100 && parseFloat(value) >= -100)) {
        setAnswers({ ...answers, [key]: value });
        return;
        }
    }

    const regex = /^-?\d*\.?\d{0,2}$/;
    if (value === '' || (regex.test(value) && parseFloat(value) <= 100 && parseFloat(value) >= -100)) {
        setAnswers({ ...answers, [key]: value });
    }
    };

  const customRound = (num) => {
    const multiplier = 100;
    let val = num * multiplier;
    const decimal = val - Math.floor(val);
    if (decimal <= 0.5) {
      val = Math.floor(val);
    } else {
      val = Math.ceil(val);
    }
    return val / multiplier;
  };

  const calculateStats = useCallback((list) => {
    if (list.length === 0) return {};
    const sorted = [...list].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;

    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 
        ? sorted[mid] 
        : (sorted[mid - 1] + sorted[mid]) / 2;

    const variance = list.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / list.length;
    const sd = Math.sqrt(variance);
    // ---------------------------------------

    const counts = {};
    list.forEach(n => counts[n] = (counts[n] || 0) + 1);
    
    let maxCount = 0;
    let modeCandidates = [];
    
    for (const key in counts) {
        if (counts[key] > maxCount) {
        maxCount = counts[key];
        modeCandidates = [Number(key)];
        } else if (counts[key] === maxCount) {
        modeCandidates.push(Number(key));
        }
    }

    const finalMode = (maxCount === 1 || modeCandidates.length === list.length) 
        ? "-" 
        : customRound(modeCandidates[0]);

    return {
        min: customRound(min),
        max: customRound(max),
        range: customRound(range),
        mean: customRound(mean),
        median: customRound(median),
        mode: finalMode,
        variance: customRound(variance),
        sd: customRound(sd)
    };
    }, []);

  const generateData = useCallback(() => {
    const newList = [];
    for (let i = 0; i < size; i++) {
      const num = isPositiveOnly 
        ? Math.floor(Math.random() * 21) 
        : Math.floor(Math.random() * 41) - 20;
      newList.push(num);
    }
    setDataList(newList.sort((a, b) => a - b));
    setResults(null);
    setAnswers({ min: '', max: '', range: '', mean: '', median: '', mode: '', sd: '', variance: '' });
  }, [size, isPositiveOnly]);

  useEffect(() => { generateData(); }, [generateData]);

  
  return (
    <div style={styles.container}>
        {/* CSS เพิ่มเติมเพื่อซ่อนลูกศร Spinner */}
        <style>
            {`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}
        </style>

      <h2 style={styles.title}>กิจกรรมทดสอบความสามารถการวิเคราะห์ชุดข้อมูลพื้นฐาน</h2>
      <h2 style={styles.description}>คุณสามารถกำหนดขนาดของชุดข้อมูลได้ตั้งแต่ 0-10 และกำหนดตัวเลขในชุดข้อมูลว่าต้องการให้มีจำนวนเต็มลบหรือไม่ คุณจะต้องคำนวณค่าที่จำเป็นในทางสถิติต่าง ๆ ให้ถูกต้อง</h2>
      <div style={styles.controlBox}>
        <label>Size: </label>
        <input 
            style={styles.sizeInput} 
            type="number" 
            min="1" 
            max="10" 
            value={size} 
            onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= 10) setSize(val);
                else if (e.target.value === '') setSize('');
            }} 
        />
        <select style={styles.select} value={isPositiveOnly} onChange={(e) => setIsPositiveOnly(e.target.value === 'true')}>
          <option value="true">0 ถึง 20</option>
          <option value="false">-20 ถึง 20</option>
        </select>
        <button onClick={generateData} style={styles.btnRandom}>Random โจทย์ใหม่</button>
      </div>

      <div style={styles.dataDisplay}>
        <span>[ {dataList.join(', ')} ]</span>
      </div>

      <div style={styles.gridInputs}>
        {Object.keys(answers).map((key) => (
          <div key={key} style={styles.inputGroup}>
            <label style={styles.label}>{key.toUpperCase()}:</label>
            <input 
              type="text" // เปลี่ยนเป็น text เพื่อคุม regex ได้แม่นยำขึ้น
              placeholder=""
              value={answers[key]} 
              onChange={(e) => handleInputChange(key, e.target.value)}
              style={{
                ...styles.input, 
                borderColor: results ? (Number(answers[key]) === results[key] ? '#27ae60' : '#e74c3c') : '#ccc'
              }}
            />
            {results && <span style={styles.correctLabel}>คำตอบ: {results[key]}</span>}
          </div>
        ))}
      </div>

      <button onClick={() => setResults(calculateStats(dataList))} style={styles.btnCheck}>ตรวจคำตอบ</button>
    </div>
  );
}

const styles = {
  container: { padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: 'sans-serif' },
  title: { color: '#2c3e50', marginBottom: '20px', fontWeight: 'bold' },
  controlBox: { display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  sizeInput: { width: '50px', padding: '5px', textAlign: 'center' },
  select: { padding: '5px', borderRadius: '5px' },
  dataDisplay: { fontSize: '1.8rem', fontWeight: 'bold', color: '#34495e', margin: '30px 0', borderBottom: '3px solid #3498db' },
  gridInputs: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '100%', maxWidth: '700px' },
  inputGroup: { display: 'flex', flexDirection: 'column', position: 'relative' },
  label: { fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '5px', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '8px', border: '2px solid', fontSize: '1.1rem', textAlign: 'center', transition: '0.3s' },
  btnRandom: { padding: '8px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnCheck: { marginTop: '40px', padding: '15px 60px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)' },
  correctLabel: { fontSize: '0.85rem', color: '#2980b9', marginTop: '5px', textAlign: 'right' },
  description: {
    color: '#95a5a6',
    fontSize: '1rem',
    marginBottom: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    lineHeight: '1.5'
  },
};

export default StatsGame;