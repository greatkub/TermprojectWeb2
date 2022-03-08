
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from './page/Homepage';
import ItemDetail from './page/ItemDetail';
import AddNewItem from './page/AddNewItem';
import Profile from './page/Profile';
import History from './page/History';
import Items from './page/Items';
import ReactFirebaseFileUpload from './page/ReactFirebaseFileUpload';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './login/Login';
import { useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';


function App() {
  const [parentId, setParentId] = useLocalStorage()
  const [parentToken, setParentToken] = useLocalStorage('');
  

  return (
    <div style={{ height: '100vh', backgroundColor: '#F3FCF8' }}>
      {parentToken != '' &&
        <Navbar bg="light" variant="light">
          <Container>
            <Navbar.Brand href={"/lendit2"}>
              <div style={{ color: '#48846F', fontWeight: '500' }}>
                LENDIT
              </div>

            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href={"/Profile/" + parentId} >Profile</Nav.Link>
              <Nav.Link href="/addItem">Add Item</Nav.Link>
              <Nav.Link href={"/Items/" + parentId} >Items</Nav.Link>
              <Nav.Link href={"/History/" + parentId} >History</Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link href="/lendit" onClick={() => { setParentToken('') }}>LOGOUT</Nav.Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      }

      <Router>
        <Routes>
          <Route exact path='/lendit' element={<Login appId={parentId => setParentId(parentId)} appToken={parentToken => setParentToken(parentToken)} />} />
          <Route exact path="/lendit2" element={<Homepage appToken={parentToken} appId={parentId} />} />
          <Route exact path="/itemDetail/:id" element={<ItemDetail appToken={parentToken} appId={parentId} />} />
          <Route exact path="/addItem" element={<AddNewItem appToken={parentToken} appId={parentId} />} />
          <Route exact path="/Profile/:userid" element={<Profile appToken={parentToken} />} />
          <Route exact path="/History/:userid" element={<History appToken={parentToken} />} />
          <Route exact path="/Items/:userid" element={<Items appToken={parentToken} />} />
        </Routes>
      </Router>



    </div >

  );
}


export default App;
