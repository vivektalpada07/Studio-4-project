import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import Header from "./Header";
import Footer from "./Footer";
import FBDataService from "../context/FBService"; // Service to fetch user data from Firebase
import '../css/Login.css'; // Custom CSS for login page
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const [image, setImage] = useState(""); // State for storing the login image URL
  const { logIn, googleSignIn } = useUserAuth(); // Destructure login functions from context
  const navigate = useNavigate(); // Hook for navigation

  // Initialize Firebase Storage to get images
  const storage = getStorage();

  useEffect(() => {
    // Function to fetch the login image from Firebase Storage
    const fetchImage = async () => {
      try {
        // Reference to the login image file in Firebase Storage
        const imageRef = ref(storage, "images/login.png"); 

        // Get the download URL for the image
        const url = await getDownloadURL(imageRef);

        // Set the image URL to the state for rendering
        setImage(url);
      } catch (error) {
        console.error("Error fetching image:", error); // Log errors if the image fetch fails
      }
    };

    fetchImage(); // Call the function to fetch the image on component mount
  }, [storage]);

  // Handle role-based navigation after login
  const handleRoleBasedRedirect = async (uid) => {
    try {
      const userDoc = await FBDataService.getData(uid); // Fetch user data based on UID
      if (userDoc.exists) {
        const userRole = userDoc.data().role;
        // Redirect based on user role
        if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "seller") {
          navigate("/seller");
        } else if (userRole === "customer") {
          navigate("/customer");
        } else {
          setError("Role not recognized."); // Handle unknown roles
        }
      } else {
        setError("User data not found."); // Handle missing user data
      }
    } catch (error) {
      setError("Error fetching user data."); // Handle errors during user data fetch
    }
  };

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any existing error messages
    try {
      const userCredential = await logIn(email, password); // Attempt to log in with provided credentials
      await handleRoleBasedRedirect(userCredential.user.uid); // Redirect based on user role
    } catch (err) {
      setError(err.message); // Display error message if login fails
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const userCredential = await googleSignIn(); // Attempt Google sign-in
      await handleRoleBasedRedirect(userCredential.user.uid); // Redirect based on user role
    } catch (error) {
      setError(error.message); // Display error message if Google sign-in fails
    }
  };

  return (
    <>
      <Header /> {/* Display the page header */}
      <div className="main-content" style={{marginTop: -70}}>
        <h2>Login</h2> {/* Page heading */}
        <div className="login-container">
          <div className="image-section">
            {/* Display the fetched image or a loading message */}
            {image ? (
              <img src={image} alt="Login" className="login-image" />
            ) : (
              <p>Loading Image...</p>
            )}
          </div>
          <div className="form-section">
            <div className="p-4 box">
              {error && <Alert variant="danger">{error}</Alert>} {/* Show error alert if there's any */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)} // Update email state on change
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} // Update password state on change
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    Log In
                  </Button>
                </div>
              </Form>
              <hr />
              <div>
                <GoogleButton
                  className="g-btn"
                  type="dark"
                  onClick={handleGoogleSignIn} // Handle Google sign-in
                />
              </div>
              <div className="p-4 box mt-3 text-center">
                Don't have an account? <Link to="/signup">Sign up</Link> {/* Link to sign-up page */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
