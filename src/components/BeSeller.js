import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase"; // Import Firebase database and storage configuration
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserAuth } from "../context/UserAuthContext";
import Footer from "./Footer";
import HeaderSwitcher from "./HeaderSwitcher";
import LoadingPage from "./Loadingpage";
const BeSeller = () => {
  // State variables for handling form inputs
  const [reason, setReason] = useState("");  // Reason for wanting to be a seller
  const [image, setImage] = useState(null);  // Selected image file
  const { user } = useUserAuth();  // Access current authenticated user
  const [loading, setLoading] = useState(true); // New state


  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);  // Set the selected image file
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    try {
      let imageUrl = "";  // Initialize image URL

      // Upload the image to Firebase Storage and get its URL
      if (image) {
        const imageRef = ref(storage, `sellerImages/${user.uid}_${image.name}`);
        await uploadBytes(imageRef, image);  // Upload the image
        imageUrl = await getDownloadURL(imageRef);  // Get the image URL
      }

      // Create a new document with seller query data
      const sellerQuery = {
        reason,
        userId: user.uid,
        userName: user.email,
        submittedAt: new Date(),  // Current date and time
        imageUrl,  // URL of the uploaded image
      };

      await addDoc(collection(db, "sellerQueries"), sellerQuery);  // Add document to Firestore
      setReason("");  // Clear the reason input field
      setImage(null);  // Clear the image file
      alert("Your request has been submitted.");  // Notify user of successful submission
    } catch (error) {
      console.error("Error submitting request:", error);  // Log any errors
    }
  };

  // Show loading page while data is being fetched
if (loading) {
  return <LoadingPage />;
}
  return (
    <div className="main-content" style={{marginTop: -70}}>
      <HeaderSwitcher />  {/* Header component that switches based on user role */}
      <h2>Become a Seller</h2>
      <Form onSubmit={handleSubmit}>
        {/* Form for submitting a seller request */}
        <Form.Group controlId="reason">
          <Form.Label>Why do you want to be a seller?</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required  // Ensure this field is filled out
          />
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Upload ID Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
        </Form.Group>
        <Button variant="success" type="submit">
          Submit
        </Button>
      </Form>
      <Footer />  {/* Footer component */}
    </div>
  );
};

export default BeSeller;
