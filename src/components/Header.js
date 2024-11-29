  import React from 'react';
  import Container from 'react-bootstrap/Container';
  import Nav from 'react-bootstrap/Nav';
  import Navbar from 'react-bootstrap/Navbar';
  import NavDropdown from 'react-bootstrap/NavDropdown';
  import Button from 'react-bootstrap/Button';
  import '../css/Header.css';  // Ensure this file includes your CSS class
  import LoadingPage from './Loadingpage';

  function Header() {
    
    return (
      <Navbar expand="lg" className='Header' >
        <Container className='Navbar'>
          <Navbar.Brand href="/" className="protest-guerrilla-regular" style={{marginTop: 8}}>
            Eco Shop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Category" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Allproducts">All Products</NavDropdown.Item>
                <NavDropdown.Item href="/Furnitures">Furnitures</NavDropdown.Item>
                <NavDropdown.Item href="/Homewares">Homewares</NavDropdown.Item>
                <NavDropdown.Item href="/Electricalgoods">Electrical Goods</NavDropdown.Item>
                <NavDropdown.Item href="/Otherproducts">Other products</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/cart">Cart</Nav.Link>
              <Nav.Link href='/Wishlist'>Wishlist</Nav.Link>
          
              
              <Nav.Link href="/login">
                <Button variant="outline-light" className="login-button">
                  Login
                </Button>
              </Nav.Link>
              <Nav.Link href="/signup">
                <Button variant="light" className="signup-button">
                  Signup
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
export default Header;