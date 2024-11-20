import React, { useEffect, useState } from "react";
import FBDataService from "../context/FBService";
import { Table, Form, InputGroup, FormControl, Button } from "react-bootstrap";
import AdminHeader from "./Adminheader";
import Footer from "./Footer";

const ManageUsers = () => {
  // State to hold lists of customers and sellers, and the search query
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from Firebase and separate them into customers and sellers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await FBDataService.getAllData();
        const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Update state with customers and sellers
        setCustomers(users.filter((user) => user.role === "customer"));
        setSellers(users.filter((user) => user.role === "seller"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Function to change a user's role and update the state
  const handleRoleChange = async (id, newRole) => {
    try {
      const userToUpdate = [...customers, ...sellers].find(user => user.id === id);
      if (userToUpdate) {
        await FBDataService.updateData(id, { ...userToUpdate, role: newRole });

        // Update local state to reflect the role change
        if (newRole === "customer") {
          setCustomers(prevCustomers => [...prevCustomers, { ...userToUpdate, role: newRole }]);
          setSellers(prevSellers => prevSellers.filter(user => user.id !== id));
        } else if (newRole === "seller") {
          setSellers(prevSellers => [...prevSellers, { ...userToUpdate, role: newRole }]);
          setCustomers(prevCustomers => prevCustomers.filter(user => user.id !== id));
        }
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // Function to delete a user and update the state
  const handleDeleteUser = async (id) => {
    try {
      await FBDataService.deleteData(id);

      // Remove the user from both customers and sellers lists
      setCustomers(prevCustomers => prevCustomers.filter(user => user.id !== id));
      setSellers(prevSellers => prevSellers.filter(user => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Filter customers and sellers based on the search query
  const filteredCustomers = customers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSellers = sellers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-content" style={{marginTop: -70}}>
      <AdminHeader /> {/* Render the admin header */}
      <h2>Manage Users</h2>

      {/* Search input for filtering users */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </InputGroup>

      <h3>Customers</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render customer rows */}
          {filteredCustomers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)} // Handle role change
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Sellers</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render seller rows */}
          {filteredSellers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)} // Handle role change
                >
                  <option value="seller">Seller</option>
                  <option value="customer">Customer</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageUsers;
