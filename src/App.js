
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
  const [userId, setUserId] = useState();

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("parentToken");
  //   if (loggedInUser) {
  //     setUserId(loggedInUser)
  //     console.log(loggedInUser)
  //   }
  // }, [])


  // const handleLogout = () => {
  //   setUserId();
  //   localStorage.clear();
  // }

  return (
    <div style={{ height: '100%', minHeight: '100vh', backgroundColor: '#F3FCF8' }}>
      {/* {parentToken  && */}
     <div style={{ backgroundColor: 'black', width: '100%', height: '100vh', zIndex: 1, opacity: 0.4, position: 'absolute' }}></div>

      <img src="https://www.ikea.com/images/a-bright-home-office-with-a-white-desk-a-white-yellow-green--65f1b5ed488093b71b665d1dd53274c1.jpg?f=sg"
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }} /> 
      {parentToken &&

        <Navbar bg="light" variant="light" style={{ boxShadow: '0px 0px 10px -6px #000000', height: 60, zIndex: 4,opacity: 0.9 }}>
          <Container>
            <Navbar.Brand href={"/lendit2"}>
              <div style={{ color: '#48846F', fontWeight: '500' }}>
                LENDIT
              </div>
            </Navbar.Brand>
            {/* {parentToken && */}

            <Nav className="me-auto">
              <Nav.Link href={"/Profile/" + parentId} >Profile</Nav.Link>
              <Nav.Link href="/addItem">Add Item</Nav.Link>
              <Nav.Link href={"/Items/" + parentId} >Items</Nav.Link>
              <Nav.Link href={"/History/" + parentId} >History</Nav.Link>
            </Nav>
            {/* } */}
            {/* {parentToken && */}
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link href="/lendit" onClick={() => { setParentToken('') }}>LOGOUT</Nav.Link>
            </Navbar.Collapse>
            {/* } */}
          </Container>

        </Navbar>
      }

      <Router>
        <Routes>
          <Route exact path='/lendit' element={<Login appId={parentId => {
            // localStorage.setItem('parentId', `"${parentId}"`)
            setParentId(parentId);
          }} appToken={parentToken => {
            // localStorage.setItem('parentToken', `"${parentToken}"`)
            setParentToken(parentToken);

          }} />} />

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
