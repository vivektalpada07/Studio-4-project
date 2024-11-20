import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import FBDataService from "../context/FBService";
import { Button, Form, Modal, Alert } from "react-bootstrap";

const UserProfile = () => {
  const { user } = useUserAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [error, setError] = useState("");

  // Fetch the current user's profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setError("No current user logged in");
        setLoading(false);
        return;
      }

      try {
        const userDoc = await FBDataService.getData(user.uid);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle opening the edit profile modal
  const handleEdit = () => {
    setUpdatedProfile(userProfile);
    setShowModal(true);
  };

  // Update profile data as the user edits fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  // Save updated profile data to Firestore
  const handleSave = async () => {
    try {
      await FBDataService.updateData(user.uid, updatedProfile);
      setUserProfile(updatedProfile); // Update UI with new profile data
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {userProfile ? (
        <div>
          <h2><strong>User Profile</strong></h2>
          <p>Name: {userProfile.name}</p>
          <p>Email: {userProfile.email}</p>
          <p>Mobile: {userProfile.mobile}</p>
          <p>Username: {userProfile.username}</p>
          <Button variant="success" onClick={handleEdit} style={{ width: '150px' }}>
            Edit Profile
          </Button>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formUserName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={updatedProfile.name || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formUserMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={updatedProfile.mobile || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formUserUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={updatedProfile.username || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <div>User not found.</div>
      )}
    </div>
  );
};

export default UserProfile;
