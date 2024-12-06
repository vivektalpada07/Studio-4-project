import React, { useEffect, useState } from "react";
import FBDataService from "../context/FBService";
import { Table, Form, InputGroup, FormControl, Button } from "react-bootstrap";
import AdminHeader from "./Adminheader";
import Footer from "./Footer";
import LoadingPage from "./Loadingpage";



const ManageUsers = () => {
  const [customers, setCustomers] = useState([]); // List of customers
  const [sellers, setSellers] = useState([]); // List of sellers
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await FBDataService.getAllData();
        const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Separate users into customers and sellers
        setCustomers(users.filter((user) => user.role === "customer"));
        setSellers(users.filter((user) => user.role === "seller"));
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const userToUpdate = [...customers, ...sellers].find((user) => user.id === id);
      if (userToUpdate) {
        await FBDataService.updateData(id, { ...userToUpdate, role: newRole });

        if (newRole === "customer") {
          setCustomers((prev) => [...prev, { ...userToUpdate, role: newRole }]);
          setSellers((prev) => prev.filter((user) => user.id !== id));
        } else if (newRole === "seller") {
          setSellers((prev) => [...prev, { ...userToUpdate, role: newRole }]);
          setCustomers((prev) => prev.filter((user) => user.id !== id));
        }
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await FBDataService.deleteData(id);

      setCustomers((prev) => prev.filter((user) => user.id !== id));
      setSellers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filteredCustomers = customers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSellers = sellers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="main-content" style={{ marginTop: -70 }}>
      <AdminHeader />
      <h2>Manage Users</h2>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          {filteredCustomers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
          {filteredSellers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
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

      <Footer />
    </div>
  );
};

export default ManageUsers;
