// the navbar for the admon dashbaord
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext'; // Import authentication context for handling user actions
import '../css/Header.css'; // Import custom CSS for header styling

function AdminHeader() {
  const { logOut } = useUserAuth(); // Extract logOut function from the authentication context
  const navigate = useNavigate(); // Hook for navigating to different routes

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logOut(); // Call the logout function from the auth context
      navigate('/login'); // Navigate the user to the login page after successful logout
    } catch (error) {
      console.log("Failed to logout: ", error); // Log any errors that occur during the logout process
    }
  };
  // Show loading page while data is being fetched


  return (
    <Navbar expand="lg" className='Header'> {/* Navbar expands on large screens, className applied for custom styles */}
      <Container className='Navbar' style={{marginTop:20}}> {/* Container for aligning navbar content */}
        <Navbar.Brand href="/admin" className="protest-guerrilla-regular" style={{marginTop: 5}}>
          Eco Shop {/* Brand or logo with a custom font style */}
        </Navbar.Brand>

        {/* Navbar toggle button for mobile view with custom styling */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255, 255, 255, 0.5)'  }}>
          <span className="navbar-toggler-icon" style={{ backgroundImage: "url('data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e')" }}>
          </span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav"> {/* Collapsible part of the navbar for toggling on small screens */}
          <Nav className="ms-auto"> {/* Align navigation to the right (ms-auto) */}
            
            {/* Admin Dashboard Menu Dropdown */}
            <NavDropdown title="Dashboard" id="admin-dashboard-dropdown">
              <NavDropdown.Item href="/admin">Dashboard</NavDropdown.Item> {/* Links to admin dashboard */}
              <NavDropdown.Item href="/manageusers">Manage Users</NavDropdown.Item> {/* Links to manage users page */}
              <NavDropdown.Item href="/sellerqueries">Seller Queries</NavDropdown.Item> {/* Links to seller queries page */}
            </NavDropdown>
            
            {/* Product Management Menu Dropdown */}
            <NavDropdown title="Products" id="product-management-dropdown">
              <NavDropdown.Item href="/manageproduct">Manage Products</NavDropdown.Item> {/* Links to manage products page */}
              <NavDropdown.Item href="/addproduct">Add Product</NavDropdown.Item> {/* Links to add product page */}
              <NavDropdown.Item href="/mylistings">My Listings</NavDropdown.Item> {/* Links to user's product listings */}
             
            </NavDropdown>

            <Nav.Link href="/orders">Orders</Nav.Link> {/* Links to orders page */}

            {/* Category Menu Dropdown */}
            <NavDropdown title="Category" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Allproducts">All Products</NavDropdown.Item> {/* Links to all products page */}
              <NavDropdown.Item href="/Furnitures">Furnitures</NavDropdown.Item> {/* Links to furniture category */}
              <NavDropdown.Item href="/Homewares">Homewares</NavDropdown.Item> {/* Links to homewares category */}
              <NavDropdown.Item href="/Electricalgoods">Electrical Goods</NavDropdown.Item> {/* Links to electrical goods */}
              <NavDropdown.Item href="/Otherproducts">Other Products</NavDropdown.Item> {/* Links to other products */}
            </NavDropdown>

            <Nav.Link href="/customer-orders">Purchase Orders</Nav.Link> {/* Links to customer orders */}
            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link href='/Wishlist'>Wishlist</Nav.Link>
            
            {/* Logout Button */}
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button> {/* Calls handleLogout when clicked */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminHeader;
