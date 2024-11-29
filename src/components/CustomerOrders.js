import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useProductcontext } from "../context/Productcontext";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Import Firestore methods
import CustomerHeader from "./Customerheader"; // Import header component for customer
import HeaderSwitcher from "./HeaderSwitcher"; // Import component to switch headers
import LoadingPage from "./Loadingpage";

const CustomerOrders = () => {
  // Access the orders and user data from context
  const { orders } = useProductcontext(); // Get orders from the product context
  const { user } = useUserAuth(); // Get authenticated user from context
  
  // State to hold customer orders and review data
  const [customerOrders, setCustomerOrders] = useState([]); // Holds fetched orders for the customer
  const [selectedProductForReview, setSelectedProductForReview] = useState(null); // Selected product to review
  const [showReviewModal, setShowReviewModal] = useState(false); // Control visibility of review modal
  const [reviewContent, setReviewContent] = useState(""); // Content of the review
  const [loading, setLoading] = useState(true); // New state


  // Fetch orders from Firestore when the component mounts or user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.uid) {
        try {
          console.log("Fetching orders for user:", user.uid); // Log the UID for debugging
          
          // Query Firestore for orders belonging to the logged-in user
          const ordersQuery = query(
            collection(db, "checkout"),
            where("userId", "==", user.uid) // Filter by the user's UID
          );
          const querySnapshot = await getDocs(ordersQuery);
          
          // Map the fetched documents to a more manageable format
          const userOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched Orders:", userOrders); // Log fetched orders for debugging

          setCustomerOrders(userOrders); // Save orders to state
        } catch (error) {
          console.error("Error fetching orders:", error); // Log any errors during fetch
        }
      }
    };
    
    fetchOrders(); // Call the fetch function when component mounts or user changes
  }, [user]);

  // Handle the review submission
  const handleSubmitReview = async () => {
    if (reviewContent.trim()) {
      try {
        // Ensure that a product name is available
        if (!selectedProductForReview || !selectedProductForReview.productName) {
          console.error("Product name is missing from the item:", selectedProductForReview);
          alert("Cannot submit review: Product name is missing.");
          return; // Exit if product name is missing
        }

        // Add the review to the Firestore collection
        await addDoc(collection(db, "reviews"), {
          productName: selectedProductForReview.productName, // Include product name in review
          userId: user.uid, // Include user ID to track who wrote the review
          content: reviewContent, // The actual review content
          customerName: user.displayName || user.email, // Get the user's name or email
          createdAt: new Date(), // Timestamp of the review
        });
        alert("Review submitted successfully!"); // Notify user of success
        setReviewContent(""); // Clear review input field
        setShowReviewModal(false); // Close the modal
      } catch (error) {
        console.error("Error submitting review:", error); // Log errors during review submission
      }
    }
  };

  // Set the product to be reviewed and show the review modal
  const handleLeaveReview = (item) => {
    console.log("Selected item for review:", item); // Log the selected item for debugging
    if (!item.productName) {
      console.error("Product name is missing from the item:", item);
      alert("Cannot leave a review for this product: Product name is missing.");
      return; // Exit if product name is missing
    }

    setSelectedProductForReview(item); // Set the product for review
    setShowReviewModal(true); // Show the review modal
  };
  // Show loading page while data is being fetched
if (loading) {
  return <LoadingPage />;
}

  return (
    <div className="main-content" style={{ marginTop: -70}}>
      <HeaderSwitcher /> {/* Switch header based on user context */}
      <h2>My Orders</h2>
      <div className="table-container">
        {/* Display orders in a table format */}
        {customerOrders.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customerOrders.map((order, orderIndex) =>
                order.items.map((item, itemIndex) => (
                  <tr key={`${order.id}-${item.productName || itemIndex}`}> {/* Key for each row */}
                    <td>{order.id}</td>
                    <td>{item.productName}</td>
                    <td>{item.productPrice.toFixed(2)}</td>
                    <td>{order.status}</td>
                    
                    <td>
                      {/* Show 'Leave Review' button if the order is complete */}
                      {order.status === "complete" && (
                        <Button onClick={() => handleLeaveReview(item)}>
                          Leave Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        ) : (
          <p>No orders found.</p> // Message if no orders are available
        )}
      </div>

      {/* Modal for submitting a review */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review for {selectedProductForReview ? selectedProductForReview.productName : "Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reviewContent">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Write your review here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerOrders;
