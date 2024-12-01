import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import Header from "./Header";
import Footer from "./Footer";
import FBDataService from "../context/FBService"; // Service to fetch user data from Firebase
import "../css/Login.css"; // Custom CSS for login page
import LoadingPage from "./Loadingpage";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const { logIn, googleSignIn } = useUserAuth(); // Destructure login functions from context
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(false); // State for loading status

  // Handle role-based navigation after login
  const handleRoleBasedRedirect = async (uid) => {
    try {
      const userDoc = await FBDataService.getData(uid); // Fetch user data by UID
      if (userDoc.exists()) {
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
    setError(""); // Clear previous errors
    try {
      const userCredential = await logIn(email, password); // Attempt login
      await handleRoleBasedRedirect(userCredential.user.uid); // Redirect after login
    } catch (err) {
      setError(err.message); // Show error message
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async (e) => {
    e.preventDefault(); // Prevent default behavior
    try {
      const userCredential = await googleSignIn(); // Attempt Google sign-in
      await handleRoleBasedRedirect(userCredential.user.uid); // Redirect after login
    } catch (error) {
      setError(error.message); // Show error message
    }
  };

  // Show loading page if still loading
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Header /> {/* Header for the login page */}
      <div className="main-content" style={{ marginTop: -70 }}>
        <h2>Login</h2> {/* Page Title */}
        <div className="login-container">
          <div className="form-section">
            <div className="p-4 box">
              {error && <Alert variant="danger">{error}</Alert>} {/* Error Message */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)} // Set email input
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} // Set password input
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
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Footer for the login page */}
    </>
  );
};

export default Login;
