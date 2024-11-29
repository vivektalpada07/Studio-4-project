import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useProductcontext } from "../context/Productcontext";
import AdminHeader from "./Adminheader";
import Footer from "./Footer";
import LoadingPage from "./Loadingpage";

const ManageProducts = () => {
  // Extracting product-related functions and data from context
  const { products, deleteProduct, updateProduct } = useProductcontext();
  const [productList, setProductList] = useState([]); // State to store products for display
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentProduct, setCurrentProduct] = useState(null); // State for the product being edited
  const [categories] = useState(["Electronics", "Fashion", "Books", "Home"]); // Example categories for selection
  const [loading, setLoading] = useState(true); // State to manage loading

  // Update local state when products from context change
  useEffect(() => {
    if (products.length > 0) {
      setProductList(products);
    }
    setLoading(false); // Set loading to false once data is fetched
  }, [products]);

  // Function to handle product deletion
  const handleDelete = (productId) => {
    deleteProduct(productId); // Call delete function from context
    setProductList(productList.filter((product) => product.id !== productId));
  };

  // Function to handle editing a product
  const handleEdit = (product) => {
    setCurrentProduct(product); // Set the product to be edited
    setShowModal(true); // Show the modal for editing
  };

  // Function to save changes to the product
  const handleSave = () => {
    updateProduct(currentProduct.id, currentProduct); // Update the product with new values
    setProductList(
      productList.map((product) =>
        product.id === currentProduct.id ? currentProduct : product
      )
    );
    setShowModal(false); // Close the modal after saving
  };

  // Function to handle changes in the edit form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value }); // Update the product state with form changes
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="main-content" style={{ marginTop: -70 }}>
      <AdminHeader /> {/* Display the admin header */}
      <h2>Manage Products</h2> {/* Page heading */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Seller</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render each product in the table */}
          {productList.map((product) => (
            <tr key={product.id}>
              <td>{product.productName}</td>
              <td>${product.productPrice.toFixed(2)}</td>
              <td>{product.productDescription}</td>
              <td>{product.sellerUsername}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(product)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal for editing a product */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Show the form if a product is selected for editing */}
          {currentProduct && (
            <Form>
              <Form.Group controlId="formProductName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  value={currentProduct.productName}
                  onChange={handleChange} // Update product name on change
                />
              </Form.Group>
              <Form.Group controlId="formProductPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="productPrice"
                  value={currentProduct.productPrice}
                  onChange={handleChange} // Update product price on change
                />
              </Form.Group>
              <Form.Group controlId="formProductDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="productDescription"
                  value={currentProduct.productDescription}
                  onChange={handleChange} // Update product description on change
                />
              </Form.Group>
              <Form.Group controlId="formProductCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={currentProduct.category}
                  onChange={handleChange} // Update product category on change
                >
                  {/* Render category options */}
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer /> {/* Display the footer */}
    </div>
  );
};

export default ManageProducts;
