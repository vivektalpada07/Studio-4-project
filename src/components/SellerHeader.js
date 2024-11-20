import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import '../css/Header.css';

function SellerHeader() {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  // Logs out the user and redirects to the login page
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.log("Failed to logout: ", error);
    }
  };

  return (
    <Navbar expand="lg" className='Header'>
      <Container className='Navbar' style={{marginTop: 20}}>
        {/* Brand logo that links back to the seller's homepage */}
        <Navbar.Brand href="/seller" className="protest-guerrilla-regular" style={{marginTop: 5}}>
          Eco Shop
        </Navbar.Brand>

        {/* Toggler for responsive navbar */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
          <span className="navbar-toggler-icon" style={{ backgroundImage: "url('data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e')" }}></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/addproduct">Add Product</Nav.Link>
            <Nav.Link href="/mylistings">My Listings</Nav.Link>
            <Nav.Link href="/orders">Orders</Nav.Link>

            {/* Dropdown for product categories */}
            <NavDropdown title="Category" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Allproducts">All Products</NavDropdown.Item>
              <NavDropdown.Item href="/Furnitures">Furnitures</NavDropdown.Item>
              <NavDropdown.Item href="/Homewares">Homewares</NavDropdown.Item>
              <NavDropdown.Item href="/Electricalgoods">Electrical Goods</NavDropdown.Item>

              <NavDropdown.Item href="/Otherproducts">OtherProducts</NavDropdown.Item>
            </NavDropdown>        
            <Nav.Link href="/customer-orders">Purchase Orders</Nav.Link> 

            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link href='/Wishlist'>Wishlist</Nav.Link>

            {/* Logout button */}
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SellerHeader;
