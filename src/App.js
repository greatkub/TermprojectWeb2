
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from './page/Homepage';
import ItemDetail from './page/ItemDetail';
import AddNewItem from './page/AddNewItem';
import Profile from './page/Profile';
import ReactFirebaseFileUpload from './page/ReactFirebaseFileUpload';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/lendit">LENDIT</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Profile</Nav.Link>
            <Nav.Link href="/addItem">Add Item</Nav.Link>
            <Nav.Link href="#pricing">History</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="#logout">LOGOUT</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Router>
        <Routes>
          <Route exact path="/lendit" element={<Homepage />} />
          <Route exact path="/itemDetail/:id" element={<ItemDetail />} />
          <Route exact path="/addItem" element={<AddNewItem />} />
          <Route exact path="/Profile/:userid" element={<Profile />} />
        </Routes>
      </Router>
      {/* <div className="box">

        <Container className="box-header">
          <label className="items">
            Items
          </label>

          <div className="form-group search">
            <input id="searchBar" type="text" className="form-control" placeholder="Search" />
            <span className="fa fa-search form-control-feedback"></span>
          </div>

        </Container>


      </div> */}


    </div>

  );
}


export default App;
