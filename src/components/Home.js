import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Header from "./Header";
import Footer from "./Footer";
import { useProductcontext } from "../context/Productcontext";
import LoadingPage from "./Loadingpage"; // Ensure the path is correct

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Home.css";

function Home() {
  const { products } = useProductcontext();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setTrendingProducts(shuffled.slice(0, 3));
      setLoading(false); // Data is loaded
    }
  }, [products]);

  const handleShow = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="wrapper">
      <Header />
      <Container className="Home">
        <Row className="align-items-center mt-5">
          <Col md={12} className="d-flex align-items-center justify-content-center">
            <h3 className="text-center">
              If you're ever in the market for any furniture,
              <br />
              homewares, electrical goods, and more,
              <br />
              make the Eco Shop your first-stop shop!
            </h3>
          </Col>
        </Row>
        <br />
        <Row>
          <h4 className="trending-title">Trending Products</h4>
          {trendingProducts.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <div className="card text-center product-card">
                <Slider {...sliderSettings}>
                  {product.imageUrls &&
                    product.imageUrls.map((url, index) => (
                      <div key={index}>
                        <img
                          src={url}
                          alt={product.productName}
                          className="card-img-top"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    ))}
                </Slider>
                <div className="card-body">
                  <h5 className="card-title mt-3">{product.productName}</h5>
                  <p className="card-text">
                    <strong>Price: ${product.productPrice}</strong>
                  </p>
                  <p className="card-text">{product.productDescription}</p>
                  <Button
                    variant="warning"
                    onClick={() => handleShow(product)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />

      {selectedProduct && (
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                {selectedProduct.imageUrls &&
                  selectedProduct.imageUrls.length > 0 && (
                    <Carousel>
                      {selectedProduct.imageUrls.map((url, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100"
                            src={url}
                            alt={`Product ${index + 1}`}
                            style={{
                              height: "300px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}
              </Col>
              <Col md={6}>
                <p>{selectedProduct.productDescription}</p>
                <p className="product-price">
                  <strong>Price:</strong> ${selectedProduct.productPrice}
                </p>
                <p className="product-description">
                  {selectedProduct.productDetailedDescription}
                </p>
                <p className="product-seller-username">
                  <strong>Seller Username:</strong>{" "}
                  {selectedProduct.sellerUsername || "Unknown"}
                </p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="warning"
              onClick={() => console.log("Add to Wishlist clicked!")}
            >
              Add to Wishlist
            </Button>
            <Button
              variant="primary"
              onClick={() => console.log("Add to Cart clicked!")}
            >
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Home;
