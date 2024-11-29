import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Modal, Button, Carousel } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';
import Footer from './Footer';
import LoadingPage from './Loadingpage';
import { useCartContext } from '../context/Cartcontext';
import { useWishlistContext } from '../context/Wishlistcontext';
import '../css/Furnitures.css';

function OtherProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [show, setShow] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const { cartItems, addToCart } = useCartContext();
  const { addToWishlist } = useWishlistContext();
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('category', '==', 'other'));
        const querySnapshot = await getDocs(q);
        const productsArray = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Sort products based on the selected sort option
    const sortProducts = (products) => {
      if (sortOption === 'priceLowToHigh') {
        return [...products].sort((a, b) => a.productPrice - b.productPrice);
      } else if (sortOption === 'priceHighToLow') {
        return [...products].sort((a, b) => b.productPrice - a.productPrice);
      }
      return products; // Default sorting (no change)
    };

    setFilteredProducts(sortProducts(products));
  }, [sortOption, products]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(value) ||
      product.productDescription.toLowerCase().includes(value) ||
      product.sellerUsername?.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleShow = (product) => {
    setSelectedProduct(product);
    setShow(true);
    fetchSimilarProducts(product.category);
  };

  const handleClose = () => setShow(false);

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert('Please log in to add items to the cart.');
      return;
    }

    const isAlreadyInCart = cartItems.some((item) => item.productId === product.productId);

    if (isAlreadyInCart) {
      alert('This product is already in your cart.');
    } else {
      addToCart({ ...product });
    }
  };

  const handleAddToWishlist = () => {
    if (!currentUser) {
      alert('Please log in to add items to your wishlist.');
      return;
    }

    if (selectedProduct) {
      addToWishlist({ ...selectedProduct });
      handleClose();
    } else {
      console.error('No product selected or product data is incomplete.');
    }
  };

  const fetchSimilarProducts = async (category) => {
    try {
      const q = query(collection(db, 'products'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const productsArray = querySnapshot.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setSimilarProducts(productsArray);
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="main-content" style={{ marginTop: -70 }}>
        <h2 className="text-center">Other Products</h2>

        {/* Search Bar */}
        <div className="search-bar text-center mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            onChange={handleSearch}
            className="form-control"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          />
        </div>

        {/* Sort Options */}
        <div className="sort-options text-center mb-4">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="form-control"
            style={{ maxWidth: '200px', margin: '0 auto' }}
          >
            <option value="default">Sort by Price</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="row justify-content-center">
            {filteredProducts.map((product, index) => (
              <div className="col-md-4" key={index}>
                <div className="card text-center">
                  <div className="card-body">
                    {product.imageUrls && product.imageUrls[0] && (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.productName}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    )}
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="card-text">
                      <strong>Price: ${product.productPrice}</strong>
                    </p>
                    <p className="card-text">{product.productDescription}</p>
                    <p className="card-text">Seller Username: {product.sellerUsername || 'Unknown'}</p>
                    <button className="btn add-to-cart mb-2" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button
                      className="btn view-details"
                      style={{ backgroundColor: '#ff8c00' }}
                      onClick={() => handleShow(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
      <Footer />

      {/* Modal for Product Details */}
      {selectedProduct && (
        <Modal show={show} onHide={handleClose} scrollable={true}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 && (
              <Carousel>
                {selectedProduct.imageUrls.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={url}
                      alt={selectedProduct.productName}
                      style={{ height: '300px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            <div className="product-details">
              <p className="product-price">Price: ${selectedProduct.productPrice}</p>
              <p>{selectedProduct.productDescription}</p>
              <p className="product-description">{selectedProduct.productDetailedDescription}</p>
              <p className="product-seller-username">Seller Username: {selectedProduct.sellerUsername || 'Unknown'}</p>
            </div>

            <div className="product-buttons">
              <Button variant="warning" className="mb-3" onClick={handleAddToWishlist}>
                Add to Wishlist
              </Button>
              <Button variant="primary" className="mb-3" onClick={() => handleAddToCart(selectedProduct)}>
                Add to Cart
              </Button>
              <Button variant="secondary" className="mb-3" onClick={handleClose}>
                Close
              </Button>
            </div>

            {/* Similar Products */}
            <div className="similar-products">
              <h5>Similar Products</h5>
              <div className="row">
                {similarProducts.map((product, index) => (
                  <div className="col-4" key={index}>
                    <div className="card text-center">
                      {product.imageUrls && product.imageUrls[0] && (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.productName}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                      <div className="card-body">
                        <h6>{product.productName}</h6>
                        <p>Price: ${product.productPrice}</p>
                        <button
                          className="btn view-details"
                          style={{ backgroundColor: '#ff8c00', color: 'white', width: '100%', marginTop: '10px' }}
                          onClick={() => handleShow(product)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default OtherProducts;
