import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useProductcontext } from "../context/Productcontext";
import { useUserAuth } from "../context/UserAuthContext";
import SellerHeader from "./SellerHeader";
import AdminHeader from "./Adminheader";
import Footer from "./Footer";
import FBDataService from "../context/FBService";
import LoadingPage from "./Loadingpage";

const MyListings = () => {
  // Accessing products and deleteProduct function from Product context
  const { products, deleteProduct } = useProductcontext();
  // Accessing current user and their role from UserAuth context
  const { user, role } = useUserAuth();
  
  // State to hold products listed by the current seller
  const [sellerProducts, setSellerProducts] = useState([]);
  
  // State to manage the visibility of the edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State to manage the visibility of the details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // State to keep track of the product currently being edited or viewed
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true); // New state


  // Fetch and filter products when user or products change
  useEffect(() => {
    if (user && products.length > 0) {
      const filteredProducts = products.filter(
        (product) => product.sellerId === user.uid
      );
      setSellerProducts(filteredProducts);
    }
  }, [products, user]);

  // Show the edit modal with the selected product's data
  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Handle deleting a product
  const handleDeleteClick = async (productId) => {
    try {
      await deleteProduct(productId); // Delete product using context function
      setSellerProducts(sellerProducts.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Save changes made in the edit modal
  const handleSaveChanges = async () => {
    try {
      await FBDataService.updateData(currentProduct.id, currentProduct); // Update product in the database
      setSellerProducts(sellerProducts.map((product) =>
        product.id === currentProduct.id ? currentProduct : product
      ));
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Handle changes in the edit form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  // Show the details modal with the selected product's information
  const handleProductDetailsClick = (product) => {
    setCurrentProduct(product);
    setShowDetailsModal(true);
  };
  // Show loading page while data is being fetched
if (loading) {
  return <LoadingPage />;
}

  return (
    <div className="main-content" style={{marginTop: -70}}>
      {/* Render header based on the user's role */}
      {role === "admin" && <AdminHeader />}
      {role === "seller" && <SellerHeader />}

      <h2>My Listings</h2>
      {sellerProducts.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Display products in a table */}
            {sellerProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <Button
                    variant="link"
                    onClick={() => handleProductDetailsClick(product)}
                  >
                    {product.productName}
                  </Button>
                </td>
                <td>{product.productPrice}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No products found for this seller.</p>
      )}

      {/* Modal for editing a product */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct && (
            <Form>
              <Form.Group controlId="formProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  value={currentProduct.productName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  name="productPrice"
                  value={currentProduct.productPrice}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="productDescription"
                  value={currentProduct.productDescription}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSellerUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="sellerUsername"
                  value={currentProduct.sellerUsername}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for displaying product details */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct ? (
            <>
              <p><strong>Name:</strong> {currentProduct.productName}</p>
              <p><strong>Price:</strong> {currentProduct.productPrice}</p>
              <p><strong>Description:</strong> {currentProduct.productDescription}</p>
              <p><strong>Category:</strong> {currentProduct.category}</p>
              <p><strong>Username:</strong> {currentProduct.sellerUsername}</p>
            </>
          ) : (
            <p>No product details available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyListings;
