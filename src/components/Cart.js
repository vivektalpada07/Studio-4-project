import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingPage from './Loadingpage'; // Import Loading page to display when content is loading
import { useCartContext } from '../context/Cartcontext'; // Custom context for cart data
import { useUserAuth } from '../context/UserAuthContext'; // Custom hook to access authentication context
import Footer from './Footer'; // Footer component
import '../css/Cart.css'; // Import CSS for cart page styling
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import HeaderSwitcher from './HeaderSwitcher'; // Switches header based on user role or status

function Cart() {
  // Accessing cart items and removeFromCart function from Cartcontext
  const { cartItems, removeFromCart } = useCartContext();
  // Accessing current user information from UserAuthContext
  const { user: currentUser } = useUserAuth();
  // State to keep track of selected product IDs and total price
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  // Hook to navigate programmatically
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to track if content is still loading

  useEffect(() => {
    // Calculate total price of selected products whenever the selectedProductIds or cartItems change
    const selectedProducts = cartItems.filter(p => selectedProductIds.includes(p.productId));
    const total = selectedProducts.reduce((sum, product) => sum + product.productPrice, 0);
    setTotalPrice(total); // Update the total price
  }, [selectedProductIds, cartItems]); // Effect depends on selected products and cart items

  // Handle adding/removing products to/from the selected products for checkout
  const handleBuyNow = (productId) => {
    setSelectedProductIds(prevSelected => 
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId) // Remove product if already selected
        : [...prevSelected, productId] // Add product if not selected
    );
  };

  // Handle checkout process
  const handleCheckout = () => {
    if (!currentUser) {
      alert("You need to log in to proceed to checkout.");
      return; // Stop further execution if the user is not logged in
    }
    if (selectedProductIds.length === 0) {
      alert("Please select at least one product to proceed.");
      return; // Stop checkout if no product is selected
    }
  
    // Prepare selected products for checkout
    const selectedProducts = cartItems
      .filter(item => selectedProductIds.includes(item.productId))
      .map(product => ({
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        productDescription: product.productDescription,
        sellerUsername: product.sellerUsername,
        sellerId: product.sellerId,
        imageUrls: product.imageUrls,  // Ensure image URLs are included for checkout
      }));
  
    // Navigate to checkout page with the selected products
    navigate('/checkout', { state: { selectedProducts } });
  };

  // If user is not logged in, show a prompt to log in
  if (!currentUser) {
    return (
      <div className="wrapper">
        <HeaderSwitcher />
        <div className="content">
          <Container>
            <p className="text-center">You need to log in to view your cart.</p>
            <div className="text-center">
              <Button variant="primary" onClick={() => navigate('/login')} style={{ width: '150px' }}>Log In</Button>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading page while data is being fetched or processed
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="content">
        <Container>
          <h2 className="text-center mb-4">Your Cart</h2>
          {cartItems.length > 0 ? (
            <>
              <Row className="justify-content-center">
                {/* Map through cart items and display them as cards */}
                {cartItems.map((product) => (
                  <Col md={4} key={product.productId}>
                    <Card className="mb-4 product-card">
                      {/* Display product image if available */}
                      {product.imageUrls && product.imageUrls.length > 0 && (
                        <Card.Img variant="top" src={product.imageUrls[0]} alt={product.productName} />
                      )}
                      <Card.Body className="product-card-body">
                        <Card.Title>{product.productName}</Card.Title>
                        <Card.Text>{product.productDescription}</Card.Text>
                        <Card.Text><strong>Price: ${product.productPrice.toFixed(2)}</strong></Card.Text>
                        <Card.Text>Seller: {product.sellerUsername}</Card.Text>
                        {/* Buy Now button toggles between selected and unselected states */}
                        <Button 
                          variant={selectedProductIds.includes(product.productId) ? "success" : "primary"}
                          onClick={() => handleBuyNow(product.productId)}
                          className={`buy-now-button ${selectedProductIds.includes(product.productId) ? 'selected' : ''}`}
                        >
                          {selectedProductIds.includes(product.productId) ? '✓ Selected' : 'Buy Now'}
                        </Button>
                        {/* Button to remove product from cart */}
                        <Button 
                          variant="danger" 
                          onClick={() => removeFromCart(product.productId)}
                          className="remove-cart-button"
                        >
                          Remove from Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {/* Display total price for selected products */}
              {totalPrice > 0 && (
                <div className="text-center mt-3">
                  <h3>Total Price for Selected Products: ${totalPrice.toFixed(2)}</h3>
                </div>
              )}
              {/* Button to proceed to checkout */}
              <div className="text-center mt-3">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={selectedProductIds.length === 0} // Disable button if no products are selected
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center">Your cart is empty.</p> // If cart is empty, show message
          )}
        </Container>
      </div>
    </div>
  );
}

export default Cart;
