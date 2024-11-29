import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useWishlistContext } from '../context/Wishlistcontext';  
import { useCartContext } from '../context/Cartcontext'; 
import { useUserAuth } from '../context/UserAuthContext'; 
import Footer from './Footer';
import '../css/Wishlist.css';
import { useNavigate } from 'react-router-dom';
import HeaderSwitcher from './HeaderSwitcher';
import LoadingPage from './Loadingpage';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlistContext();
  const { cartItems, addToCart } = useCartContext(); 
  const { user: currentUser } = useUserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading

  // Simulating data fetch
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false); // Simulate data loading completion
    }, 2000); // Simulated delay of 2 seconds

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  // Calculate total price of items in the wishlist
  const totalPrice = wishlist.reduce((total, item) => total + item.productPrice, 0);

  // Handle adding product to the cart
  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const isAlreadyInCart = cartItems.some(item => item.productId === product.productId);

    if (isAlreadyInCart) {
      alert("This product is already in your cart.");
    } else {
      addToCart({ ...product });
    }
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  if (!currentUser) {
    return (
      <div className="wrapper">
        <HeaderSwitcher />
        <div className="content">
          <Container>
            <p className="text-center">You need to log in to view your wishlist.</p>
            <div className="text-center">
              <Button variant="primary" onClick={() => navigate('/login')} style={{ width: '150px' }}>Log In</Button>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="main-content" style={{ marginTop: -50 }}>
        <Container>
          <h2 className="text-center mb-4">Your Wishlist</h2>
          <Row className="justify-content-center">
            {wishlist.map((product, index) => (
              <Col md={4} key={product.productId}>
                <Card className="mb-4 product-card">
                  {product.imageUrls && product.imageUrls.length > 0 && (
                    <Card.Img variant="top" src={product.imageUrls[0]} alt={product.productName} />
                  )}
                  <Card.Body className="product-card-body">
                    <Card.Title>{product.productName}</Card.Title>
                    <Card.Text>{product.productDescription}</Card.Text>
                    <Card.Text><strong>Price: ${product.productPrice.toFixed(2)}</strong></Card.Text>
                    <Card.Text>Seller: {product.sellerUsername}</Card.Text>
                    <Button 
                      variant="danger" 
                      onClick={() => removeFromWishlist(product.productId)}
                    >
                      Remove from Wishlist
                    </Button>
                    <button 
                      className="btn add-to-cart mb-2 mt-2" 
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <h3 className="text-center mt-4">Total Price: ${totalPrice.toFixed(2)}</h3>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;
