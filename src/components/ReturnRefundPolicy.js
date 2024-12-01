import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import '../css/ReturnRefundPolicy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import LoadingPage from './Loadingpage';

function ReturnAndRefundPolicy() {
  const [policyImage, setPolicyImage] = useState(""); // State to store image URL
  const [loading, setLoading] = useState(true); // State to manage loading
  const storage = getStorage();

  useEffect(() => {
    // Fetch image URL from Firebase Storage
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, "images/r&rpolicy.png");
        const url = await getDownloadURL(imageRef);
        setPolicyImage(url); // Set the fetched image URL to state
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false); // Ensure loading state is set to false
      }
    };

    fetchImage();
  }, [storage]);

  // Show the loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="main-content">
        <Container className="RRPolicy">
          <Row className="Title">
            <h3>Return & Refund Policy</h3>
          </Row>
          <Row>
            <p>
              Thank you for shopping at Eco Shop. In case you are not satisfied with your
              <br />
              purchase, you can follow the return and refund process as mentioned below.
            </p>
          </Row>
          <br />
          <Row className="Return">
            <h5>Returns</h5>
          </Row>
          <Row className="Description">
            <p>
              You have 30 days to return a product from the date you received it. To be
              eligible for a return, your product must be unused and you need to provide proof 
              of purchase.
            </p>
          </Row>
          <Row className="Refund">
            <h5>Refunds</h5>
          </Row>
          <Row className="Description">
            <p>
              Once we receive your product, we will notify you that we have received it.
              If your product is approved, we will issue a refund to the payment method of your choice.
            </p>
          </Row>
          {/* Display the fetched image */}
          {policyImage ? (
            <img src={policyImage} alt="R&RPolicy" className="policy-image" />
          ) : (
            <p>Unable to load the image. Please try again later.</p>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default ReturnAndRefundPolicy;
