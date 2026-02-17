import React, { useState, useEffect, useCallback } from 'react';
import '../styles/fonts.css';
import '../styles/colors.css';

function LogicGame() {
  const [inputs, setInputs] = useState({ A: 0, B: 0 });
  const [equation, setEquation] = useState("");
  const [targetValue, setTargetValue] = useState(0);
  const [showModal, setShowModal] = useState({ show: false, isCorrect: false });

  // --- Core Algorithm: Dynamic Logic Generator ---

  const generateEquation = useCallback((depth = 0) => {
    const operators = ['.', '+']; // AND, OR
    const variables = ['A', 'B', "A'", "B'"];
    
    // ควบคุมความลึก (Depth) เพื่อไม่ให้สมการยาวจนอ่านไม่รู้เรื่อง (แนะนำ 1 หรือ 2)
    const maxDepth = 2; 

    if (depth >= maxDepth || Math.random() > 0.6) {
      return variables[Math.floor(Math.random() * variables.length)];
    }

    const left = generateEquation(depth + 1);
    const right = generateEquation(depth + 1);
    const op = operators[Math.floor(Math.random() * operators.length)];

    return `(${left} ${op} ${right})`;
  }, []);

  const evaluateLogic = (eq, a, b) => {
    // แปลงสัญลักษณ์เป็น JavaScript Logical Operators
    let expression = eq
      .replace(/A'/g, `(!${a})`)
      .replace(/B'/g, `(!${b})`)
      .replace(/A/g, a)
      .replace(/B/g, b)
      .replace(/\./g, '&&')
      .replace(/\+/g, '||');

    try {
      return eval(expression) ? 1 : 0;
    } catch (e) {
      return 0;
    }
  };

  const generateRandomQuiz = useCallback(() => {
    const newA = Math.round(Math.random());
    const newB = Math.round(Math.random());
    const newEq = generateEquation();
    const result = evaluateLogic(newEq, newA, newB);

    setInputs({ A: newA, B: newB });
    setEquation(newEq);
    setTargetValue(result);
    setShowModal({ show: false, isCorrect: false });
  }, [generateEquation]);

  // ----------------------------------------------

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
      <h2 className="font-sans" style={styles.text}>ให้คุณคิด Output ของสมการต่อไปนี้ว่าเป็น 1 หรือ 0</h2>
      <div style={styles.quizCard}>
        <div style={styles.inputTable}>
          <div style={styles.tableHeader}>
            <div style={styles.cell}>Input</div>
            <div style={styles.cell}>Output</div>
          </div>
          <div style={styles.tableRow}>
            <div style={styles.cell}>A</div>
            <div style={styles.cell}>{inputs.A}</div>
          </div>
          <div style={styles.tableRow}>
            <div style={styles.cell}>B</div>
            <div style={styles.cell}>{inputs.B}</div>
          </div>
        </div>

        <div style={styles.equationArea}>
          <span style={styles.booleanText}>{equation}</span>
        </div>

        <button onClick={generateRandomQuiz} style={styles.randomBtn}>
          Random โจทย์ใหม่
        </button>
      </div>

      <div style={styles.answerSection}>
        <button onClick={() => checkAnswer(1)} style={styles.answerBtn}>1</button>
        <button onClick={() => checkAnswer(0)} style={styles.answerBtn}>0</button>
      </div>

      {showModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ color: showModal.isCorrect ? '#27ae60' : '#e74c3c' }}>
              {showModal.isCorrect ? 'ถูกต้อง! เก่งมาก ๆ 🤩' : 'ไม่ถูกนะ 🥹'}
            </h2>
            <button 
                onClick={() => setShowModal({ ...showModal, show: false })} 
                style={styles.closeBtn}
            >
                ย้อนกลับ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  title: {
    marginBottom: '40px',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#34495e',
    textAlign: 'center'
  },
  text: {
    marginBottom: '40px',
    fontSize: '1.2rem',
    color: '#34495e',
    textAlign: 'center'
  },
  quizCard: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    position: 'relative',
    width: '100%',
    maxWidth: '850px'
  },
  inputTable: {
    border: '2px solid #2c3e50',
    borderRadius: '10px',
    overflow: 'hidden',
    width: '180px',
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  tableRow: {
    display: 'flex',
    borderTop: '1px solid #2c3e50',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    padding: '12px',
    textAlign: 'center',
    fontSize: '1.3rem',
    fontWeight: 'bold'
  },
  equationArea: {
    fontSize: '2.2rem',
    fontWeight: '600',
    color: '#2980b9',
    textAlign: 'center',
    padding: '20px'
  },
  randomBtn: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    border: 'none',
    background: 'none',
    color: '#95a5a6',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem'
  },
  answerSection: {
    marginTop: '60px',
    display: 'flex',
    gap: '80px',
  },
  answerBtn: {
    fontSize: '4.5rem',
    background: 'none',
    border: '2px solid transparent',
    borderRadius: '15px',
    padding: '10px 30px',
    cursor: 'pointer',
    color: '#2c3e50',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '25px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%'
  },
  modalText: {
    fontSize: '1.2rem',
    margin: '20px 0'
  },
  closeBtn: {
    padding: '12px 30px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  }
};

export default LogicGame;