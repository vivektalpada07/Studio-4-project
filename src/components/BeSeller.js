import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase"; // Import Firebase database and storage configuration
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserAuth } from "../context/UserAuthContext"; // Import custom hook to access user authentication context
import Footer from "./Footer"; // Import Footer component
import HeaderSwitcher from "./HeaderSwitcher"; // Import HeaderSwitcher to display dynamic header based on user role
import LoadingPage from "./Loadingpage"; // Import LoadingPage to show a loading spinner while data is fetched

const BeSeller = () => {
  // State variables for handling form inputs
  const [reason, setReason] = useState("");  // Reason for wanting to be a seller
  const [image, setImage] = useState(null);  // Selected image file
  const { user } = useUserAuth();  // Access current authenticated user from the context
  const [loading, setLoading] = useState(true); // State to track loading status

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
        imageUrl = await getDownloadURL(imageRef);  // Get the image URL after uploading
      }

      // Create a new document with seller query data
      const sellerQuery = {
        reason, // Reason the user wants to become a seller
        userId: user.uid, // User ID from the authenticated user
        userName: user.email, // User's email as username
        submittedAt: new Date(),  // Current date and time of submission
        imageUrl,  // URL of the uploaded image (if any)
      };

      // Add the seller query document to the Firestore collection
      await addDoc(collection(db, "sellerQueries"), sellerQuery);
      setReason("");  // Clear the reason input field after successful submission
      setImage(null);  // Clear the image file input after successful submission
      alert("Your request has been submitted.");  // Notify user of successful submission
    } catch (error) {
      console.error("Error submitting request:", error);  // Log any errors encountered during submission
    }
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;  // Display loading spinner if page is still loading
  }

  return (
    <div className="main-content" style={{ marginTop: -70 }}>
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
            onChange={(e) => setReason(e.target.value)} // Update the reason state on user input
            required  // Ensure this field is filled out
          />
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Upload ID Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
          {/* Allow only image files to be uploaded */}
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
