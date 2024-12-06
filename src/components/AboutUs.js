//about us page for the website in which it includes short descerption of website .........
import React from 'react';
import Footer from './Footer';
import '../css/AboutUs.css';
import { Container, Row } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';
import LoadingPage from './Loadingpage'; // Component for loading state (not used here)

/**
 * AboutUs Component
 * Displays information about the Eco Shop platform.
 */
function AboutUs() {
  return (
    <div className="wrapper">
      {/* Wrapper div for the entire About Us page */}

      {/* HeaderSwitcher for dynamic headers based on user type */}
      <HeaderSwitcher />

      <div className="main-content">
        {/* Main content area for About Us details */}
        <Container className="AboutUs">
          <Row className="Title">
            {/* Page title */}
            <h3>About Us</h3>
          </Row>

          <br /> {/* Adding space between the title and content */}

          <Row>
            {/* Subtitle for the page */}
            <h5>Discover our Eco Shop</h5>
          </Row>

          <Row>
            {/* Description of the Eco Shop platform */}
            <p>
              {/* Brief introduction of the platform */}
              The Eco Shop is a second-hand deal platform where customers can buy and sell their products.
              <br />
              {/* Explanation of seller and customer functionalities */}
              Sellers can list their products for sale, and customers can browse through various categories,
              <br />
              including furniture, homewares, and electrical goods.
              <br />
              <br />
              {/* Mission statement of the Eco Shop */}
              Our mission is to offer affordable deals that make it easy for customers to purchase products at low prices.
              <br />
              {/* Highlighting the user-friendly experience */}
              We aim to provide a user-friendly experience, ensuring both customers and sellers can efficiently navigate
              <br />
              to search for, display, and manage their products with ease.
            </p>
          </Row>
        </Container>
      </div>

      {/* Footer section of the page */}
      <Footer />
    </div>
  );
}

export default AboutUs; // Exporting AboutUs component for use in the application
