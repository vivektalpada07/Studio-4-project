import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import LoadingPage from './Loadingpage'; // Adjust the path if necessary

import { collection, getDocs, query, where } from "firebase/firestore";
import { Modal, Button, Carousel } from "react-bootstrap";
import HeaderSwitcher from "./HeaderSwitcher";
import Footer from "./Footer";
import { useCartContext } from "../context/Cartcontext";
import { useWishlistContext } from "../context/Wishlistcontext";
import "../css/Furnitures.css";


function Furnitures() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart } = useCartContext();
  const { wishlist, addToWishlist } = useWishlistContext();
  const currentUser = auth.currentUser;
  

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "products"), where("category", "==", "furniture"));
        const querySnapshot = await getDocs(q);
        const productsArray = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let sortedProducts = [...filteredProducts];

    if (sortOption === "priceLowToHigh") {
      sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOption === "priceHighToLow") {
      sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
    }

    setFilteredProducts(sortedProducts);
  }, [sortOption]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(value) ||
      product.productDescription.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setPriceRange({ ...priceRange, [name]: parseInt(value, 10) });
  };

  const filterByPrice = () => {
    const filtered = products.filter((product) =>
      product.productPrice >= priceRange.min && product.productPrice <= priceRange.max
    );
    setFilteredProducts(filtered);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const handleShow = (product) => {
    setSelectedProduct(product);
    setShow(true);
    fetchSimilarProducts(product.category);
    fetchReviews(product.productId);
  };

  const handleClose = () => setShow(false);

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert("Please log in to add items to the cart.");
      return;
    }

    addToCart({ ...product, quantity });
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
      const productsArray = querySnapshot.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setSimilarProducts(productsArray);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const q = query(collection(db, "reviews"), where("productId", "==", productId));
      const querySnapshot = await getDocs(q);
      const reviewsArray = querySnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsArray);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  // Show loading page while data is being fetched
if (loading) {
  return <LoadingPage />;
}

  return (
    
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="main-content" style={{ marginTop: -50 }}>
        <h2 className="text-center">Our Furniture Collection</h2>

        {/* Search Bar */}
        <div className="search-bar text-center mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            style={{ maxWidth: "400px", margin: "0 auto" }}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="sort-options text-center mb-4">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="form-control"
            style={{ maxWidth: "200px", margin: "0 auto" }}
          >
            <option value="default">Sort by Price</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="price-filter text-center mb-4">
          <label>Min Price: </label>
          <input
            type="number"
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
            style={{ width: "80px", marginRight: "10px" }}
          />
          <label>Max Price: </label>
          <input
            type="number"
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
            style={{ width: "80px", marginRight: "10px" }}
          />
          <button className="btn btn-primary" onClick={filterByPrice}>
            Apply
          </button>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="row justify-content-center">
            {filteredProducts.map((product, index) => (
              <div className="col-md-4" key={index}>
                <div className="card text-center">
                  <div className="card-body">
                    {product.imageUrls && product.imageUrls[0] && (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.productName}
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="card-text">
                      <strong>Price: ${product.productPrice}</strong>
                    </p>
                    <button
                      className="btn btn-primary"
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
          <p className="text-center">No furniture products found.</p>
        )}
      </div>
      <Footer />

      {/* Modal */}
      {selectedProduct && (
        <Modal show={show} onHide={handleClose} scrollable={true}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Product Images */}
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 && (
              <Carousel>
                {selectedProduct.imageUrls.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={url}
                      alt={selectedProduct.productName}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            {/* Product Details */}
            <p>Price: ${selectedProduct.productPrice}</p>
            <p>{selectedProduct.productDescription}</p>
            <p className="product-description">{selectedProduct.productDetailedDescription}</p>

            {/* Quantity Selector */}
            <div className="quantity-selector mb-3">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
                style={{ width: "60px", marginLeft: "10px" }}
              />
            </div>

            {/* Reviews */}
            <div className="product-reviews">
              <h5>Customer Reviews</h5>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index}>
                    <p>
                      <strong>{review.username}:</strong> {review.comment}
                    </p>
                    <p>Rating: {review.rating}/5</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>

            {/* Similar Products */}
            <div className="similar-products">
              <h5>Similar Products</h5>
              <div className="row">
                {similarProducts.map((product, index) => (
                  <div className="col-4" key={index}>
                    <div className="card text-center">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.productName}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="card-body">
                        <h6>{product.productName}</h6>
                        <p>Price: ${product.productPrice}</p>
                        <button
                          className="btn btn-primary"
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
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleAddToCart(selectedProduct)}>
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Furnitures;
