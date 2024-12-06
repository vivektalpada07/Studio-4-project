import React from 'react';
import Footer from './Footer';
import '../css/ReturnRefundPolicy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';

function ReturnAndRefundPolicy() {
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
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default ReturnAndRefundPolicy;
