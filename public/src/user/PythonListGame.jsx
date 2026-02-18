import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function PythonListGame() {
  const [difficulty, setDifficulty] = useState(3);
  const [activeLists, setActiveLists] = useState(['A', 'B']);
  const [gameData, setGameData] = useState({ code: [], initial: {}, correctOutput: {} });
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState({ show: false, isCorrect: false });
  const navigate = useNavigate();

  // --- 1. Simulation Engine (ใช้คำนวณทั้งระหว่างทางและผลลัพธ์สุดท้าย) ---
  const runSimulation = useCallback((initialState, commands) => {
    let state = JSON.parse(JSON.stringify(initialState));
    commands.forEach(cmd => {
      const list = state[cmd.target];
      if (!list) return;

      switch (cmd.action) {
        case 'append': 
          list.push(cmd.val); 
          break;
        case 'pop':
          const pIdx = cmd.idx !== undefined ? cmd.idx : list.length - 1;
          if (pIdx >= 0 && pIdx < list.length) list.splice(pIdx, 1);
          break;
        case 'reverse': 
          list.reverse(); 
          break;
        case 'sort': 
          list.sort((a, b) => cmd.rev ? b - a : a - b); 
          break;
        case 'insert': 
          list.splice(cmd.idx, 0, cmd.val); 
          break;
        case 'remove': 
          const remIdx = list.indexOf(cmd.val);
          if (remIdx !== -1) list.splice(remIdx, 1);
          break;
        default: break;
      }
    });

    const finalState = {};
    Object.keys(state).forEach(key => {
      finalState[key] = JSON.stringify(state[key]);
    });
    return finalState;
  }, []);

  // ฟังก์ชัน Helper สำหรับจำลอง Step ระหว่างสร้างโจทย์ (เพื่อเช็คว่ามีเลขให้ remove ไหม)
  const runSimulationForStep = (initialState, commands) => {
    let state = JSON.parse(JSON.stringify(initialState));
    commands.forEach(cmd => {
      const list = state[cmd.target];
      if (!list) return;
      if (cmd.action === 'append') list.push(cmd.val);
      else if (cmd.action === 'pop') {
        const pIdx = cmd.idx !== undefined ? cmd.idx : list.length - 1;
        if (pIdx >= 0 && pIdx < list.length) list.splice(pIdx, 1);
      }
      else if (cmd.action === 'remove') {
        const remIdx = list.indexOf(cmd.val);
        if (remIdx !== -1) list.splice(remIdx, 1);
      }
      else if (cmd.action === 'insert') list.splice(cmd.idx, 0, cmd.val);
      else if (cmd.action === 'reverse') list.reverse();
      else if (cmd.action === 'sort') list.sort((a, b) => cmd.rev ? b - a : a - b);
    });
    return state;
  };

  // --- 2. Generator ---
  const generateNewGame = useCallback(() => {
    const initial = {};
    activeLists.forEach(name => {
      const size = Math.floor(Math.random() * 4) + 2; 
      initial[name] = Array.from({ length: size }, () => Math.floor(Math.random() * 41) - 20);
    });

    const commands = [];
    const ops = ['append', 'pop', 'reverse', 'sort', 'insert', 'remove'];

    for (let i = 0; i < difficulty; i++) {
      const action = ops[Math.floor(Math.random() * ops.length)];
      const target = activeLists[Math.floor(Math.random() * activeLists.length)];
      
      let val = Math.floor(Math.random() * 21); 
      let idx = 0;
      let rev = Math.random() > 0.5;
      let text = "";

      if (action === 'append') {
        text = `${target}.append(${val})`;
      } else if (action === 'pop') {
        text = `${target}.pop(0)`;
      } else if (action === 'reverse') {
        text = `${target}.reverse()`;
      } else if (action === 'sort') {
        text = `${target}.sort(reverse=${rev})`;
      } else if (action === 'insert') {
        text = `${target}.insert(${idx}, ${val})`;
      } else if (action === 'remove') {
        const currentListInSim = runSimulationForStep(initial, commands); 
        const targetList = currentListInSim[target];
        
        if (targetList && targetList.length > 0) {
          val = targetList[Math.floor(Math.random() * targetList.length)];
        } else {
          val = Math.floor(Math.random() * 21);
        }
        text = `${target}.remove(${val})`;
      }

      commands.push({ action, target, val, idx, rev, text });
    }

    // เรียกใช้ runSimulation ที่นิยามไว้ด้านบนสุด
    const correct = runSimulation(initial, commands);
    setGameData({ code: commands, initial, correctOutput: correct });
    
    const emptyAnswers = {};
    activeLists.forEach(name => emptyAnswers[name] = '');
    setAnswers(emptyAnswers); 
    setShowModal({ show: false, isCorrect: false });
  }, [activeLists, difficulty, runSimulation]);

  useEffect(() => {
    generateNewGame();
  }, [generateNewGame]);

  const checkAnswer = () => {
    const isAllCorrect = activeLists.every(name => {
      const user = (answers[name] || '').replace(/\s+/g, '');
      const correct = (gameData.correctOutput[name] || '').replace(/\s+/g, '');
      return user === correct;
    });
    setShowModal({ show: true, isCorrect: isAllCorrect });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>กิจกรรมทำความเข้าใจ List ของ Python</h1>
      <p style={styles.description}>วิเคราะห์สถานะสุดท้ายของ List ทั้งหมดหลังจากรันโค้ดบรรทัดสุดท้าย</p>

      <div style={styles.controlBox}>
        <div>
          <label>Difficulty (Lines): {difficulty}</label>
          <input type="range" min="1" max="10" value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))} />
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <button style={styles.btnSmall} onClick={() => setActiveLists(['A', 'B'])}>2 Lists</button>
          <button style={styles.btnSmall} onClick={() => setActiveLists(['A', 'B', 'C', 'D'])}>4 Lists</button>
        </div>
      </div>

      <div style={styles.codeContainer}>
        <div style={styles.initialState}>
          {Object.entries(gameData.initial).map(([name, val]) => (
            <div key={name} style={{color: '#ce9178'}}>{name} = {JSON.stringify(val)}</div>
          ))}
        </div>

        <div style={styles.codeBlock}>
          {gameData.code.map((line, idx) => (
            <div key={idx} style={styles.codeLine}>
              <span style={styles.lineNum}>{idx + 1}</span> {line.text}
            </div>
          ))}
          {activeLists.map((name, i) => (
            <div key={i} style={{...styles.codeLine, color: '#6a9955'}}>
              <span style={styles.lineNum}>{gameData.code.length + i + 1}</span> print({name})
            </div>
          ))}
        </div>

        <div style={styles.answerSection}>
          {activeLists.map(name => (
            <div key={name} style={styles.inputGroup}>
              <label style={{width: '40px', fontWeight: 'bold'}}>{name} = </label>
              <input 
                style={styles.input}
                placeholder="เช่น [1,2,3]"
                value={answers[name] || ''}
                onChange={(e) => setAnswers({...answers, [name]: e.target.value})}
              />
            </div>
          ))}
          <div style={styles.actionRow}>
            <button style={styles.btnSubmit} onClick={checkAnswer}>Submit Output</button>
            <button style={styles.btnRandom} onClick={generateNewGame}>Random โจทย์ใหม่</button>
          </div>
        </div>
      </div>

      {showModal.show && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
            <h2 style={{ color: showModal.isCorrect ? '#27ae60' : '#e74c3c', fontSize: '2rem' }}>
                {showModal.isCorrect ? 'Correct! 🎉' : 'Incorrect ❌'}
            </h2>
            
            <div style={{ textAlign: 'left', margin: '20px 0', color: '#ce9178' }}>
                <p style={{ color: '#fff', borderBottom: '1px solid #444', paddingBottom: '5px' }}>เฉลยคำตอบที่ถูกต้อง:</p>
                {Object.entries(gameData.correctOutput).map(([name, val]) => (
                <div key={name} style={{ fontSize: '1.2rem', marginTop: '5px' }}>
                    <strong>{name}</strong> = {val}
                </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                <button onClick={generateNewGame} style={styles.modalBtnNext}>
                ข้อต่อไป
                </button>
                <button 
                onClick={() => setShowModal({ ...showModal, show: false })} 
                style={styles.modalBtnRetry}
                >
                ลองใหม่อีกที
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}

const styles = {
  container: { padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#1e1e1e', minHeight: '100vh', color: '#d4d4d4', fontFamily: 'Consolas, monospace' },
  title: { color: '#61dafb', marginBottom: '10px' },
  description: { color: '#888', marginBottom: '30px' },
  controlBox: { display: 'flex', gap: '30px', marginBottom: '30px', backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '12px', border: '1px solid #444' },
  btnSmall: { padding: '5px 15px', backgroundColor: '#3c3c3c', color: '#fff', border: '1px solid #555', borderRadius: '5px', cursor: 'pointer' },
  codeContainer: { backgroundColor: '#252526', padding: '35px', borderRadius: '15px', width: '100%', maxWidth: '750px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid #3c3c3c' },
  initialState: { marginBottom: '20px', fontSize: '1.1rem', borderLeft: '4px solid #ce9178', paddingLeft: '15px' },
  codeBlock: { marginBottom: '30px', fontSize: '1.1rem' },
  codeLine: { display: 'flex', gap: '15px', marginBottom: '4px' },
  lineNum: { color: '#858585', width: '25px', textAlign: 'right' },
  answerSection: { borderTop: '1px solid #444', paddingTop: '25px' },
  inputGroup: { display: 'flex', alignItems: 'center', marginBottom: '12px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#3c3c3c', color: '#fff', fontSize: '1.1rem', outline: 'none' },
  actionRow: { display: 'flex', gap: '15px', marginTop: '20px' },
  btnSubmit: { flex: 2, padding: '15px', backgroundColor: '#0e639c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' },
  btnRandom: { flex: 1, padding: '15px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '25px', textAlign: 'center', border: '1px solid #444', minWidth: '350px' },
  modalBtnNext: { padding: '12px 25px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', flex: 1 },
  modalBtnRetry: { padding: '12px 25px', backgroundColor: '#e67e22', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', flex: 1 },
};

export default PythonListGame;