import React from 'react';
import Footer from './Footer';
import '../css/AboutUs.css';
import { Container, Row } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';
import LoadingPage from './Loadingpage';

function AboutUs() {
  return (
    <div className="wrapper">
      {/* HeaderSwitcher for dynamic headers */}
      <HeaderSwitcher />

      <div className="main-content">
        {/* Main container for "About Us" page content */}
        <Container className="AboutUs">
          <Row className="Title">
            <h3>About Us</h3>
          </Row>

          <br />

          <Row>
            <h5>Discover our Eco Shop</h5>
          </Row>

          <Row>
            <p>
              The Eco Shop is a second-hand deal platform where customers can buy and sell their products.
              <br />
              Sellers can list their products for sale, and customers can browse through various categories,
              <br />
              including furniture, homewares, and electrical goods.
              <br />
              <br />
              Our mission is to offer affordable deals that make it easy for customers to purchase products at low prices.
              <br />
              We aim to provide a user-friendly experience, ensuring both customers and sellers can efficiently navigate
              <br />
              to search for, display, and manage their products with ease.
            </p>
          </Row>
        </Container>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default AboutUs;
