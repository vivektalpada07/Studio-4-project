import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import '../css/Header.css';
import LoadingPage from './Loadingpage';

function CustomerHeader() {
  // Extract logOut function from the user authentication 
  const { logOut } = useUserAuth();
  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Attempt to log out the user
      await logOut();
      // Redirect user to the login page after successful logout
      navigate('/login');
    } catch (error) {
      // Log any error that occurs during logout for debugging purposes
      console.log("Failed to logout: ", error);
    }
  };



  return (
    <Navbar expand="lg" className='Header'>
      <Container className='Navbar'>
        {/* Branding for the navigation bar */}
        <Navbar.Brand href="/customer" className="protest-guerrilla-regular" style={{marginTop: 5}}>
          Eco Shop
        </Navbar.Brand>
        {/* Button to toggle the navigation menu on small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        {/* Collapsible navigation links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Dropdown menu for product categories */}
            <NavDropdown title="Category" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Allproducts">All Products</NavDropdown.Item>
              <NavDropdown.Item href="/Furnitures">Furnitures</NavDropdown.Item>
              <NavDropdown.Item href="/Homewares">Homewares</NavDropdown.Item>
              <NavDropdown.Item href="/Electricalgoods">Electrical Goods</NavDropdown.Item>
              <NavDropdown.Item href="/Otherproducts">Other Products</NavDropdown.Item>
            </NavDropdown>
            {/* Links for purchase orders, becoming a seller, wishlist, and cart */}
            <Nav.Link href="/customer-orders">Purchase Orders</Nav.Link>
            <Nav.Link href='/beseller'>Become a Seller</Nav.Link>
            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link href='/Wishlist'>Wishlist</Nav.Link>
            
            {/* Button to log out */}
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomerHeader;
