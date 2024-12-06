import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { useProductcontext } from "../context/Productcontext";
import { useUserAuth } from "../context/UserAuthContext";
import HeaderSwitcher from "./HeaderSwitcher";
import CheckoutService from "../context/CheckoutServices"; // Import the CheckoutService
import "../css/Orders.css"; // Import the CSS file
import LoadingPage from "./Loadingpage";

const Orders = () => {
  const { orders, updateOrderStatus } = useProductcontext();
  const { user } = useUserAuth();
  const [sellerOrders, setSellerOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const processOrders = () => {
      if (user && user.uid) {
        const filteredOrders = orders
          .filter((order) => order.status !== "complete..") 
          .map((order) => ({
            ...order,
            items: order.items
              ? order.items.filter((item) => item.sellerId === user.uid)
              : [],
          }))
          .filter((order) => order.items.length > 0);

        setSellerOrders(filteredOrders);
      }
      setLoading(false); 
    };

    processOrders();
  }, [orders, user]);

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status); // Update the order status
  };

  const handleProductClick = async (product) => {
    try {
      const querySnapshot = await CheckoutService.getAllCheckouts();
      const checkouts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchedCheckout = checkouts.find((checkout) =>
        checkout.items.some(
          (item) =>
            item.productName === product.productName && item.sellerId === user.uid
        )
      );

      if (matchedCheckout) {
        const itemDetails = matchedCheckout.items.find(
          (item) => item.productName === product.productName
        );
        const productPrice = itemDetails.productPrice || 0;
        const serverFee = productPrice * 0.15; // Calculate server fee (15% of price)
        const profit = productPrice * 0.85; // Calculate profit (85% of price)

        setSelectedProduct({
          ...itemDetails,
          paymentId: matchedCheckout.paymentId,
          serverFee: serverFee,
          profit: profit,
          address: matchedCheckout.address || "N/A",
          region: matchedCheckout.region || "N/A",
          zipCode: matchedCheckout.zipCode || "N/A",
          city: matchedCheckout.city || "N/A",
          country: matchedCheckout.country || "N/A",
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching checkouts: ", error);
    }
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="main-content" style={{ marginTop: -70 }}>
      <HeaderSwitcher />
      <h2>My Orders</h2>
      <div className="table-container">
        {sellerOrders.length > 0 ? (
          <Table striped bordered hover className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Server Fee</th>
                <th>Profit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sellerOrders.map((order, index) =>
                order.items.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    <td
                      onClick={() => handleProductClick(item)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.productName}
                    </td>
                    <td>{item.productPrice.toFixed(2)}</td>
                    <td>{(item.productPrice * 0.15).toFixed(2)}</td> {/* Server Fee */}
                    <td>{(item.productPrice * 0.85).toFixed(2)}</td> {/* Profit */}
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="not done">Not Done</option>
                        <option value="in progress">In Progress</option>
                        <option value="delivered">Delivered</option>
                        <option value="complete">Complete</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        ) : (
          <p>No orders found for this seller.</p>
        )}
      </div>

      {/* Modal for displaying product details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content">
          {selectedProduct ? (
            <>
              <p>
                <strong>Name:</strong> {selectedProduct.productName || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedProduct.productDescription || "N/A"}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {selectedProduct.productPrice
                  ? selectedProduct.productPrice.toFixed(2)
                  : "N/A"}
              </p>
              <p>
                <strong>Payment ID:</strong> {selectedProduct.paymentId || "N/A"}
              </p>
              <p>
                <strong>Server Fee:</strong>{" "}
                {selectedProduct.serverFee
                  ? selectedProduct.serverFee.toFixed(2)
                  : "N/A"}
              </p>
              <p>
                <strong>Profit:</strong>{" "}
                {selectedProduct.profit
                  ? selectedProduct.profit.toFixed(2)
                  : "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedProduct.address}
              </p>
              <p>
                <strong>Region:</strong> {selectedProduct.region}
              </p>
              <p>
                <strong>Zip Code:</strong> {selectedProduct.zipCode}
              </p>
              <p>
                <strong>City:</strong> {selectedProduct.city}
              </p>
              <p>
                <strong>Country:</strong> {selectedProduct.country}
              </p>
            </>
          ) : (
            <p>No product details available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders;
