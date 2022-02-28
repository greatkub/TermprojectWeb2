
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from './page/Homepage';
import ItemDetail from './page/ItemDetail';
import AddNewItem from './page/AddNewItem';
import Profile from './page/Profile';
import History from './page/History';
import ReactFirebaseFileUpload from './page/ReactFirebaseFileUpload';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './login/Login';
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';


function App() {
  const [parentId, setParentId] = useLocalStorage()
  const [parentToken, setParentToken] = useLocalStorage()


  return (
    <div style={{ height: '100vh', backgroundColor: '#F3FCF8' }}>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/lendit">
            <div style={{ color: '#48846F',fontWeight: '500' }}>
              LENDIT
            </div>

          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/Profile/6310023">Profile</Nav.Link>
            <Nav.Link href="/addItem">Add Item</Nav.Link>
            <Nav.Link href="/History/6310023">History</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="#logout">LOGOUT</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Router>
        <Routes>
          <Route exact path='/login' element={<Login appId={parentId => setParentId(parentId)} appToken={parentToken => setParentToken(parentToken)}/>} />
          <Route exact path="/lendit" element={<Homepage appToken={parentToken}/>} />
          <Route exact path="/itemDetail/:id" element={<ItemDetail />} />
          <Route exact path="/addItem" element={<AddNewItem />} />
          <Route exact path="/Profile/:userid" element={<Profile />} />
          <Route exact path="/History/:userid" element={<History />} />
        </Routes>
      </Router>



    </div>

  );
}


export default App;
