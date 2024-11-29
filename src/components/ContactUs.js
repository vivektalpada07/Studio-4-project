import React, { useState } from "react";
import { Form, Alert, InputGroup, Button } from "react-bootstrap";
import Contactusservice from "../context/Contactusservice"; // Service to handle contact form submissions
import Footer from "./Footer";
import HeaderSwitcher from "./HeaderSwitcher";
import LoadingPage from "./Loadingpage";
function ContactUs() {
  // State variables to manage form inputs and feedback messages
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ error: false, msg: "" });
  const [loading, setLoading] = useState(true); // New state


  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: false, msg: "" });

    // Check if all fields are filled
    if (name === "" || email === "" || subject === "" || message === "") {
      setFeedback({ error: true, msg: "Please fill out all fields!" });
      return;
    }

    // Create contact data object
    const contactData = {
      name,
      email,
      subject,
      message
    };

    try {
      // Send contact data to the server
      await Contactusservice.addContact(contactData);
      setFeedback({ error: false, msg: "Your message has been sent successfully!" });
    } catch (err) {
      console.error("Error sending message:", err); // Log error for debugging
      setFeedback({ error: true, msg: "Failed to send message. Please try again later." });
    }

    // Clear form fields after submission
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };
// Show loading page while data is being fetched
if (loading) {
  return <LoadingPage />;
}
  return (
    <div className="main-content" style={{marginTop: -110}}>
      <HeaderSwitcher />
      <div className="p-4 box">
        {/* Display feedback message if any */}
        {feedback.msg && (
          <Alert
            variant={feedback.error ? "danger" : "success"}
            dismissible
            onClose={() => setFeedback({ error: false, msg: "" })}
          >
            {feedback.msg}
          </Alert>
        )}
        <h2>Contact Us</h2>
        <Form onSubmit={handleSubmit}>
          {/* Form field for name */}
          <Form.Group className="mb-3" controlId="formContactName">
            <InputGroup>
              <InputGroup.Text id="formContactName">Name</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {/* Form field for email */}
          <Form.Group className="mb-3" controlId="formContactEmail">
            <InputGroup>
              <InputGroup.Text id="formContactEmail">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {/* Form field for subject */}
          <Form.Group className="mb-3" controlId="formContactSubject">
            <InputGroup>
              <InputGroup.Text id="formContactSubject">Subject</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {/* Form field for message */}
          <Form.Group className="mb-3" controlId="formContactMessage">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>

          {/* Submit button */}
          <div className="d-grid gap-2">
            <Button variant="success" type="submit">
              Send Message
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ContactUs;
