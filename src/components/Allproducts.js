// dispaly the product to the user interface 
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Modal, Button, Carousel } from 'react-bootstrap';
import ReactImageMagnify from 'react-image-magnify';
import ReactImageZoom from 'react-image-zoom';
import HeaderSwitcher from './HeaderSwitcher';
import Footer from './Footer';
import LoadingPage from './Loadingpage';
import { useCartContext } from '../context/Cartcontext';
import { useWishlistContext } from '../context/Wishlistcontext';
import '../css/Furnitures.css';  // Reusing the same CSS for consistent styling

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [show, setShow] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const { cartItems, addToCart } = useCartContext();
  const { addToWishlist } = useWishlistContext();
  const currentUser = auth.currentUser;
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map(doc => ({
          productId: doc.id,
          ...doc.data()
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let sortedProducts = [...filteredProducts];

    if (sortOption === 'priceLowToHigh') {
      sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOption === 'priceHighToLow') {
      sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
    }

    setFilteredProducts(sortedProducts);
  }, [sortOption]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter(product =>
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

  const handleAddToWishlist = () => {
    if (!currentUser) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    if (selectedProduct) {
      addToWishlist({ ...selectedProduct });
      handleClose();
    } else {
      console.error("No product selected or product data is incomplete.");
    }
  };

  const fetchSimilarProducts = async (category) => {
    try {
      const q = query(collection(db, "products"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      const productsArray = querySnapshot.docs.map(doc => ({
        productId: doc.id,
        ...doc.data()
      }));
      setSimilarProducts(productsArray);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };
  // Show loading page while data is being fetched
  const [loading, setLoading] = useState(true); // New state

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="main-content" style={{marginTop: -70}}>
        <h2 className="text-center">All Products</h2>

        {/* Search Bar */}
        <div className="search-bar text-center mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="sort-options text-center mb-4">
          <select value={sortOption} onChange={handleSortChange} className="form-control" style={{ maxWidth: '200px', margin: '0 auto' }}>
            <option value="default">Price</option>
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
                      <img src={product.imageUrls[0]} alt={product.productName} style={{ width: '100%', height: 'auto' }} />
                    )}
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="card-text"><strong>Price: ${product.productPrice}</strong></p>
                    <p className="card-text">{product.productDescription}</p>
                    <p className="card-text">Seller Username: {product.sellerUsername || "Unknown"}</p>
                    <button className="btn add-to-cart mb-2" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button className="btn view-details" style={{ backgroundColor: '#ff8c00' }} onClick={() => handleShow(product)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
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
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: selectedProduct.productName,
                          isFluidWidth: true,
                          src: url
                        },
                        largeImage: {
                          src: url,
                          width: 1200,
                          height: 1200
                        },
                        enlargedImagePosition: "beside",
                        isHintEnabled: true
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            <div className="product-details">
              <p className="product-price">Price: ${selectedProduct.productPrice}</p>
              <p>{selectedProduct.productDescription}</p>
              <p className="product-description">{selectedProduct.productDetailedDescription}</p>
              <p className="product-seller-username">Seller Username: {selectedProduct.sellerUsername || "Unknown"}</p>
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

            <div className="similar-products">
              <h5>Similar Products</h5>
              <div className="row">
                {similarProducts.map((product, index) => (
                  <div className="col-4" key={index}>
                    <div className="card text-center">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.productName}
                        style={{ width: '100%', height: 'auto' }}
                      />
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

export default AllProducts;

