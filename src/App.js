
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


function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/lendit">LENDIT</Navbar.Brand>
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
          <Route exact path="/lendit" element={<Homepage />} />
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
