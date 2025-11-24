import React from 'react';
import './styles/fonts.css';
import './styles/colors.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      {/* ใช้ Component จาก react-bootstrap */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Best 2x2 App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">หน้าแรก</Nav.Link>
              <Nav.Link href="#link">ฟีเจอร์</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* เนื้อหา */}
      <div className='p-3'>
        <h1 className='font-sarabun text-primary'>Hello Best 2x2 with React Yay!</h1>
      </div>
    </div>
  );
}

export default App;