import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/fonts.css';
import '../styles/colors.css';

function Test() {
  const [inputs, setInputs] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [equation, setEquation] = useState("");
  const [targetValue, setTargetValue] = useState(0);
  const [showModal, setShowModal] = useState({ show: false, isCorrect: false });
  const [maxDepth, setMaxDepth] = useState(1);
  
  const navigate = useNavigate();

  // --- Algorithm: สุ่มสมการรองรับ A, B, C, D ---
    const generateEquation = useCallback((currentDepth = 0, depthLimit) => {
    const operators = ['.', '+'];
    const variables = ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"];
    
    // ปรับตรงนี้: ถ้ายังไม่ถึงความลึกที่กำหนด (depthLimit) ให้บังคับสุ่มต่อ 
    // โดยการเอาเงื่อนไข Math.random() ออก หรือปรับให้โอกาสตัดจบน้อยลงมากในชั้นแรกๆ
    if (currentDepth >= depthLimit) {
        return variables[Math.floor(Math.random() * variables.length)];
    }

    const left = generateEquation(currentDepth + 1, depthLimit);
    const right = generateEquation(currentDepth + 1, depthLimit);
    const op = operators[Math.floor(Math.random() * operators.length)];

    return `(${left} ${op} ${right})`;
    }, []);

  const evaluateLogic = (eq, vals) => {
    let expression = eq
      .replace(/A'/g, `(!${vals.A})`).replace(/A/g, vals.A)
      .replace(/B'/g, `(!${vals.B})`).replace(/B/g, vals.B)
      .replace(/C'/g, `(!${vals.C})`).replace(/C/g, vals.C)
      .replace(/D'/g, `(!${vals.D})`).replace(/D/g, vals.D)
      .replace(/\./g, '&&')
      .replace(/\+/g, '||');
    try {
      // eslint-disable-next-line no-eval
      return eval(expression) ? 1 : 0;
    } catch (e) {
      return 0;
    }
  };

  const generateRandomQuiz = useCallback(() => {
    const newVals = {
      A: Math.round(Math.random()),
      B: Math.round(Math.random()),
      C: Math.round(Math.random()),
      D: Math.round(Math.random())
    };
    const newEq = generateEquation(0, maxDepth);
    const result = evaluateLogic(newEq, newVals);

    setInputs(newVals);
    setEquation(newEq);
    setTargetValue(result);
    setShowModal({ show: false, isCorrect: false });
  }, [generateEquation, maxDepth]);

  useEffect(() => {
    generateRandomQuiz();
  }, [generateRandomQuiz]);

  const checkAnswer = (userAnswer) => {
    if (userAnswer === targetValue) {
      setShowModal({ show: true, isCorrect: true });
    } else {
      setShowModal({ show: true, isCorrect: false });
    }
  };

  return (
    <div style={styles.container}>
      <h2 className="font-sans" style={styles.title}>กิจกรรมทดสอบความสามารถตรรกศาสตร์</h2>
      <h2 className="font-sans" style={styles.text}>ดูค่าตัวแปรนำเข้า (Input): สังเกตที่ตารางจะมีตัวแปร A, B, C และ D ซึ่งแต่ละตัวจะถูกสุ่มค่ามาให้เป็น 0 (เท็จ) หรือ 1 (จริง)</h2>
      <h2 className="font-sans" style={styles.text}>อ่านสมการที่ปรากฏอยู่ด้านล่างตาราง โดยใช้หลักการทำงานของเครื่องหมายตรรกะ . แทน AND, + แทน OR , ' แทน NOT</h2>
      <h2 className="font-sans" style={styles.text}>และวิเคราะห์ว่าผลลัพธ์ของสมการเป็น 0 หรือ 1</h2>
      {/* ย้ายส่วนปรับระดับความยากมาไว้ใต้หัวข้อรายละเอียดกิจกรรม */}
      <div style={styles.difficultyContainer}>
        <label style={styles.difficultyLabel}>ระดับความยาก {maxDepth}</label>
        <input 
          type="range" min="1" max="5" 
          value={maxDepth} 
          onChange={(e) => setMaxDepth(parseInt(e.target.value))}
          style={styles.slider}
        />
        <div style={styles.difficultyBadge}>
            {maxDepth <= 2 ? "Beginner" : maxDepth <= 4 ? "Intermediate" : "Logician"}
        </div>
      </div>

      <div style={styles.quizCard}>
        {/* ตาราง Input A B C D */}
        <div style={styles.inputGrid}>
          {Object.entries(inputs).map(([key, val]) => (
            <div key={key} style={styles.inputBox}>
              <div style={styles.inputLabel}>{key}</div>
              <div style={styles.inputValue}>{val}</div>
            </div>
          ))}
        </div>

        {/* ย้ายสมการมาอยู่ด้านล่างตัว Output */}
        <div style={styles.equationWrapper}>
          <div style={styles.equationLabel}>วิเคราะห์สมการด้านล่าง:</div>
          <div style={styles.equationText}>{equation}</div>
        </div>

        <button onClick={generateRandomQuiz} style={styles.randomBtn}>Random โจทย์ใหม่</button>
      </div>

      <div style={styles.answerSection}>
        <button onClick={() => checkAnswer(1)} style={styles.answerBtn}>1</button>
        <button onClick={() => checkAnswer(0)} style={styles.answerBtn}>0</button>
      </div>

      {showModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ color: showModal.isCorrect ? '#27ae60' : '#e74c3c', fontSize: '2rem' }}>
              {showModal.isCorrect ? 'Correct!' : 'Incorrect'}
            </h2>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={generateRandomQuiz} style={styles.nextBtn}>โจทย์ต่อไป</button>
              <button onClick={() => setShowModal({...showModal, show: false})} style={styles.backBtn}>ลองดูอีกที</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '40px' },
  title: { marginBottom: '10px', fontSize: '2.2rem', fontWeight: 'bold', color: '#2c3e50' },
  text: { marginBottom: '10px', fontSize: '1.2rem',  color: '#2c3e50' },
  difficultyContainer: { marginBottom: '30px', textAlign: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '300px' },
  difficultyLabel: { fontWeight: 'bold', marginBottom: '10px', display: 'block' },
  difficultyBadge: { marginTop: '8px', fontSize: '0.85rem', color: '#3498db', fontWeight: 'bold' },
  slider: { width: '100%', cursor: 'pointer' },
  quizCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', maxWidth: '800px', width: '100%' },
  inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '40px', width: '100%' },
  inputBox: { border: '2px solid #34495e', borderRadius: '12px', textAlign: 'center', overflow: 'hidden' },
  inputLabel: { backgroundColor: '#34495e', color: 'white', padding: '8px', fontWeight: 'bold', fontSize: '1.2rem' },
  inputValue: { padding: '15px', fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' },
  equationWrapper: { textAlign: 'center', borderTop: '2px dashed #eee', paddingTop: '30px', width: '100%' },
  equationLabel: { fontSize: '1rem', color: '#7f8c8d', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' },
  equationText: { fontSize: '2.4rem', color: '#2980b9', fontWeight: '700', wordBreak: 'break-all', lineHeight: '1.2' },
  randomBtn: { position: 'absolute', top: '20px', right: '25px', background: 'none', border: 'none', color: '#bdc3c7', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' },
  answerSection: { marginTop: '50px', display: 'flex', gap: '40px', },
  answerBtn: {
    fontSize: '3rem',
    fontWeight: 'bold',
    width: '120px',    
    height: '120px',    
    cursor: 'pointer',
    backgroundColor: '#fff',
    border: '3px solid #2c3e50',
    borderRadius: '15px', 
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 6px 0 #2c3e50', 
  },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(44, 62, 80, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '50px', borderRadius: '30px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' },
  nextBtn: { padding: '12px 25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' },
  backBtn: { padding: '12px 25px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }
};

export default Test;