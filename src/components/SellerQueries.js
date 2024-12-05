import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AdminHeader from "./Adminheader";
import Footer from "./Footer";
import LoadingPage from "./Loadingpage";

const SellerQueries = () => {
  const [queries, setQueries] = useState([]); // State to store seller queries
  const [loading, setLoading] = useState(true); // State to track loading

  // Fetch seller queries from Firestore
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sellerQueries"));
        const queriesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueries(queriesArray); // Store fetched queries in state
      } catch (e) {
        console.error("Error fetching queries:", e);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchQueries();
  }, []);

  // Handle approving a seller query
  const handleApprove = async (query) => {
    try {
      // Update user's role to 'seller' in the users collection
      const userRef = doc(db, "users", query.userId);
      await updateDoc(userRef, { role: "seller" });

      // Remove the query from the 'sellerQueries' collection after approval
      await deleteDoc(doc(db, "sellerQueries", query.id));

      // Update the UI by removing the approved query
      setQueries((prevQueries) => prevQueries.filter((q) => q.id !== query.id));
      alert("User approved as seller.");
    } catch (e) {
      console.error("Error approving seller:", e);
    }
  };

  // Handle declining a seller query
  const handleDecline = async (queryId) => {
    try {
      // Remove the query from the 'sellerQueries' collection
      await deleteDoc(doc(db, "sellerQueries", queryId));

      // Update the UI by removing the declined query
      setQueries((prevQueries) => prevQueries.filter((q) => q.id !== queryId));
      alert("Seller query declined.");
    } catch (e) {
      console.error("Error declining seller:", e);
    }
  };

  // Show the loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="main-content" style={{ marginTop: -70 }}>
      <AdminHeader />
      <h2>Seller Queries</h2>
      {queries.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Query ID</th>
              <th>User Name</th>
              <th>Reason</th>
              <th>Submitted At</th>
              <th>ID Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query.id}>
                <td>{query.id}</td>
                <td>{query.userName}</td>
                <td>{query.reason}</td>
                <td>{new Date(query.submittedAt.seconds * 1000).toLocaleString()}</td>
                <td>
                  {query.imageUrl ? (
                    <img
                      src={query.imageUrl}
                      alt="User ID"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <Button variant="success" onClick={() => handleApprove(query)}>
                    Approve
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDecline(query.id)}>
                    Decline
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No seller queries found.</p>
      )}
      <Footer />
    </div>
  );
};

export default SellerQueries;
