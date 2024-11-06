import Footer from './Footer';
import '../css/AboutUs.css';
import { Container, Row } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

function AboutUs() {
  const [image, setImage] = useState("");

  // Initialize Firebase Storage for storing and retrieving images
  const storage = getStorage();

  useEffect(() => {
    // Function to fetch the image URL from Firebase Storage
    const fetchImage = async () => {
      try {
        // Reference to the image file in Firebase Storage
        const imageRef = ref(storage, "images/about us.jpg"); 

        // Get the download URL of the image
        const url = await getDownloadURL(imageRef);

        // Set the image URL in the component's state to display
        setImage(url);
      } catch (error) {
        // Log any errors encountered while fetching the image
        console.error("Error fetching image:", error);
      }
    };

    fetchImage(); // Call the function to fetch the image when the component loads
  }, []);

  return (
    <div className='wrapper'>
      {/* HeaderSwitcher to dynamically switch between different headers */}
      <HeaderSwitcher/>

      <div className='main-content'>
        {/* Main container for About Us page content */}
        <Container className='AboutUs'>
          <Row className='Title'>
            <h3>About Us</h3>
          </Row>

          <br/>

          <Row>
            <h5>Discover our Eco Shop</h5>
          </Row>
      
          <Row>
            {/* Description of the Eco Shop and its purpose */}
            <p>
              The Eco Shop is a second-hand deal platform where customers can buy as well as sell their products.
              <br></br> Sellers can list their products for sale, and customers can browse through various categories, 
              <br></br> including furniture, homeware, and electrical goods.
              <br></br><br></br>
              Our mission is to offer affordable deals that make it easy for customers to purchase products at low prices.
              <br></br> We aim to provide a user-friendly experience, ensuring both customers and sellers can navigate 
              <br></br> efficiently to search for, display, and manage their products with ease.
            </p>
          </Row>

          {/* Conditionally render the image fetched from Firebase Storage */}
          {image ? (
            <img src={image} alt="About Us" className="aboutus-image" />
          ) : (
            <p>Loading Image...</p>
          )}
        </Container>
      </div>

      {/* Footer component to appear at the bottom of the page */}
      <Footer />
    </div>
  );
}

export default AboutUs;
