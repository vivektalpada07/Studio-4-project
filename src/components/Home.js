import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';  // Import Carousel for product image slides
import Header from './Header';  
import Footer from './Footer';  
import { useProductcontext } from '../context/Productcontext'; // Import the ProductContext to access product data
import Slider from 'react-slick'; // Import Slick Carousel for product image slides
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/Home.css';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

function Home() {
  const { products } = useProductcontext(); // Retrieve all products from the ProductContext
  const [trendingProducts, setTrendingProducts] = useState([]); // State to store trending products
  const [selectedProduct, setSelectedProduct] = useState(null); // State to manage the currently selected product for modal
  const [show, setShow] = useState(false); // State to control the visibility of the modal
  const [image, setImage] = useState(""); // State to store the URL of the banner image

  // Initialize Firebase Storage
  const storage = getStorage();

  useEffect(() => {
    // Shuffle and select the top 3 products as trending
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setTrendingProducts(shuffled.slice(0, 3));
    }
  }, [products]);

  useEffect(() => {
    // Fetch the banner image URL from Firebase Storage
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, "images/EcoShop.png"); // Path to the banner image
        const url = await getDownloadURL(imageRef); // Get the image URL
        setImage(url); // Set the URL to state
      } catch (error) {
        console.error("Error fetching image:", error); // Handle any errors
      }
    };

    fetchImage();
  }, []);

  const handleShow = (product) => {
    setSelectedProduct(product); // Set the selected product for the modal
    setShow(true); // Show the modal
  };

  const handleClose = () => setShow(false); // Hide the modal

  const sliderSettings = {
    dots: true, // Show navigation dots
    infinite: true, // Enable infinite scrolling
    speed: 100, // Speed of transition
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay interval
  };

  return (
    <div className="wrapper">
      <Header /> {/* Render the header component */}
      <Container className='Home'>
        <Row className="align-items-center mt-5">
          <div className="image-section">
            {/* Display the fetched banner image */}
            {image ? (
              <img src={image} alt="EcoShop" className="image" />
            ): (
              <p>Loading Image...</p> // Show a loading message if image is not yet available
            )}
          </div>
          <Col md={8} className='d-flex align-items-center justify-content-center'>
            <h3 className="text-end">
              If you're ever in the market for any furniture, 
              <br />
              homewares, electrical goods, and more,
              <br />
              make the Eco Shop your first-stop shop!!!!!
            </h3>
          </Col>
        </Row>
        <br/>
        <Row>
          <h4>Trending Products</h4>
          {trendingProducts.map(product => (
            <Col key={product.id} md={4} className="mb-4">
              <div className="card text-center">
                <Slider {...sliderSettings}>
                  {product.imageUrls && product.imageUrls.map((url, index) => (
                    <div key={index}>
                      <img 
                        src={url} 
                        alt={product.productName} 
                        className="card-img-top" 
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                  ))}
                </Slider>
                <div className="card-body">
                <p className="card-text"><strong>Price: ${product.productPrice}</strong></p>
                  <h5 className="card-title mt-3">{product.productName}</h5>
                 <p className="card-text">{product.productDescription}</p>
                 
                  <Button 
                    variant="warning"
                    onClick={() => handleShow(product)} // Show the product details modal
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer /> {/* Render the footer component */}

      {/* Modal for displaying product details */}
      {selectedProduct && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 && (
              <Carousel>
                {selectedProduct.imageUrls.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img 
                      className="d-block w-100"
                      src={url} 
                      alt={`Product ${index + 1}`} 
                      style={{
                        height: '300px', 
                        objectFit: 'cover', 
                        borderRadius: '5px' 
                      }} 
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            <p>{selectedProduct.productDescription}</p>
            <p className="product-price">Price: ${selectedProduct.productPrice}</p>
            <p className="product-description">{selectedProduct.productDetailedDescription}</p>
            <p className="product-seller-username">Seller Username: {selectedProduct.sellerUsername || "Unknown"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="warning" onClick={() => console.log("Add to Wishlist clicked!")}>
              Add to Wishlist
            </Button>
            <Button variant="primary" onClick={() => console.log("Add to Cart clicked!")}>
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Home;
