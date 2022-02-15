
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from './page/Homepage';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">LENDIT</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Profile</Nav.Link>
            <Nav.Link href="#features">Items</Nav.Link>
            <Nav.Link href="#pricing">History</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="#logout">LOGOUT</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Homepage/>

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
