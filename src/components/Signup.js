import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FBDataService from "../context/FBService";
import '../css/Signup.css';
import LoadingPage from "./Loadingpage";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // New state for loading

  const [role] = useState("customer"); // Role is set to 'customer' by default

  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  // Simulate a loading delay (e.g., fetching data or pre-loading resources)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate 2 seconds of loading

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Sign up the user
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      const createdAt = new Date().toISOString(); // Capture the current time as ISO string
      const newData = {
        id: user.uid,
        name,
        email,
        mobile,
        username,
        role,
        createdAt,
      };

      // Save user profile to Firestore
      await FBDataService.setData(newData);
      console.log("User profile created successfully");

      // Navigate to login page after successfully saving data
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // Show loading page while loading
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="main-content" style={{ marginTop: -130 }}>
      <Header />
      <div className="p-4 box">
        <h2 className="mb-3">Signup</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Control
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMobile">
            <Form.Control
              type="text"
              placeholder="Mobile Number"
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>
        <div className="p-4 box mt-3 text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
