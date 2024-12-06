import React from 'react';
import Container from 'react-bootstrap/Container'; // Importing Bootstrap's container for layout
import Nav from 'react-bootstrap/Nav'; // Navigation component
import Navbar from 'react-bootstrap/Navbar'; // Navbar component for navigation bar
import Button from 'react-bootstrap/Button'; // Button component
import NavDropdown from 'react-bootstrap/NavDropdown'; // Dropdown menu for navigation items

import { useNavigate } from 'react-router-dom'; // React Router hook for page redirection
import { useUserAuth } from '../context/UserAuthContext'; // Context hook to handle authentication actions
import '../css/Header.css'; // Custom styles for the header

function AdminHeader() {
  const { logOut } = useUserAuth(); // Retrieves the logout function from the authentication context
  const navigate = useNavigate(); // Hook to programmatically redirect users

  /**
   * Handles the logout process for the user.
   * Attempts to log out the user and navigates to the login page.
   * Logs an error message if the process fails.
   */
  const handleLogout = async () => {
    try {
      await logOut(); // Calls the context-provided logout function
      navigate('/login'); // Redirects the user to the login screen post-logout
    } catch (error) {
      console.error("Logout failed: ", error); // Provides feedback if logout encounters an issue
    }
  };

  return (
    <Navbar expand="lg" className='Header'> {/* Creates a responsive navigation bar with class styling */}
      <Container className='Navbar' style={{ marginTop: 20 }}> {/* Defines the navbar's layout within a Bootstrap container */}
        <Navbar.Brand href="/admin" className="protest-guerrilla-regular" style={{ marginTop: 5 }}>
          Eco Shop {/* Displays the site logo or title */}
        </Navbar.Brand>

        {/* Toggles navbar visibility for smaller devices with a custom toggle button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
          <span
            className="navbar-toggler-icon"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e')",
            }}>
          </span>
        </Navbar.Toggle>

        {/* Collapsible menu for navigation items */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* Aligns the navigation links to the right side of the navbar */}

            {/* Dropdown for Admin Dashboard management options */}
            <NavDropdown title="Dashboard" id="admin-dashboard-dropdown">
              <NavDropdown.Item href="/admin">Dashboard</NavDropdown.Item> {/* Links to the main admin dashboard */}
              <NavDropdown.Item href="/manageusers">Manage Users</NavDropdown.Item> {/* Navigation to user management */}
              <NavDropdown.Item href="/sellerqueries">Seller Queries</NavDropdown.Item> {/* Links to seller query page */}
            </NavDropdown>

            {/* Dropdown for Product-related actions */}
            <NavDropdown title="Products" id="product-management-dropdown">
              <NavDropdown.Item href="/manageproduct">Manage Products</NavDropdown.Item> {/* Redirects to the product management page */}
              <NavDropdown.Item href="/addproduct">Add Product</NavDropdown.Item> {/* Allows admins to add new products */}
              <NavDropdown.Item href="/mylistings">My Listings</NavDropdown.Item> {/* Displays the admin's product listings */}
            </NavDropdown>

            {/* Links for orders and categories */}
            <Nav.Link href="/orders">Orders</Nav.Link> {/* Shows order details */}
            <NavDropdown title="Category" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Allproducts">All Products</NavDropdown.Item> {/* List all available products */}
              <NavDropdown.Item href="/Furnitures">Furnitures</NavDropdown.Item> {/* Specific category for furniture */}
              <NavDropdown.Item href="/Homewares">Homewares</NavDropdown.Item> {/* Category: homewares */}
              <NavDropdown.Item href="/Electricalgoods">Electrical Goods</NavDropdown.Item> {/* Electrical goods category */}
              <NavDropdown.Item href="/Otherproducts">Other Products</NavDropdown.Item> {/* Miscellaneous products */}
            </NavDropdown>

            {/* Other direct links for admin activities */}
            <Nav.Link href="/customer-orders">Purchase Orders</Nav.Link> {/* Lists purchase orders */}
            <Nav.Link href="/cart">Cart</Nav.Link> {/* Access shopping cart */}
            <Nav.Link href="/Wishlist">Wishlist</Nav.Link> {/* Navigate to wishlist */}

            {/* Logout button to end user session */}
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button> {/* Logs the admin out when clicked */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminHeader;
