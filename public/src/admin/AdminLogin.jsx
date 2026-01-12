import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('adminToken', data.token);
                navigate('/edit-course');
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
        }
    };

    return (
        <div style={loginStyles.container}>
            <form onSubmit={handleLogin} style={loginStyles.box}>
                <h2>Admin Login</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    onChange={(e) => setUsername(e.target.value)} 
                    style={loginStyles.input}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={loginStyles.input}
                />
                <button type="submit" style={loginStyles.button}>Login</button>
            </form>
        </div>
    );
}

const loginStyles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    box: { padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', width: '300px' },
    input: { marginBottom: '15px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' },
    button: { padding: '10px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default AdminLogin;