import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';  
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Modal, Button, Carousel } from 'react-bootstrap';
import ReactImageMagnify from 'react-image-magnify';
import HeaderSwitcher from './HeaderSwitcher';
import Footer from './Footer';
import { useCartContext } from '../context/Cartcontext';  
import { useWishlistContext } from '../context/Wishlistcontext';
import '../css/Electricalgoods.css';
import LoadingPage from './Loadingpage'; // Import LoadingPage component

function Electricalgoods() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [show, setShow] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); // For sorting
  const [loading, setLoading] = useState(true); // State for managing loading screen
  const { cartItems, addToCart } = useCartContext();
  const { addToWishlist } = useWishlistContext();
  const currentUser = auth.currentUser;

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const q = query(collection(db, "products"), where("category", "==", "electricalgoods"));
        const querySnapshot = await getDocs(q);
        const productsArray = querySnapshot.docs.map(doc => ({
          productId: doc.id,
          ...doc.data()
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);

  // Sort products when sortOrder changes
  useEffect(() => {
    const sortProducts = (products) => {
      return [...products].sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.productPrice - b.productPrice 
          : b.productPrice - a.productPrice;
      });
    };
    setFilteredProducts(sortProducts(filteredProducts));
  }, [sortOrder]);

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

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Show LoadingPage while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="wrapper">
      <HeaderSwitcher />
      <div className="main-content" style={{marginTop: -50}}>
        <h2 className="text-center">Our Electrical Goods Collection</h2>

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
        <div className="sort-dropdown text-center mb-4">
          <select 
            value={sortOrder}
            onChange={handleSortChange}
            className="form-control"
            style={{ maxWidth: '200px', margin: '0 auto' }}
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="row justify-content-center">
            {filteredProducts.map((product) => (
              <div className="col-md-4" key={product.productId}>
                <div className="card text-center">
                  <div className="card-body">
                    {product.imageUrls && product.imageUrls[0] && (
                      <img src={product.imageUrls[0]} alt={product.productName} style={{ width: '100%', height: 'auto' }} />
                    )}
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="card-text">{product.productDescription}</p>
                    <p className="card-text"><strong>Price: ${product.productPrice}</strong></p>
                    <p className="card-text">Seller Username: {product.sellerUsername || "Unknown"}</p>
                    <button 
                      className="btn add-to-cart mb-2" 
                      onClick={() => handleAddToCart(product)}
                    >
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
          <p>No electrical goods products found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Electricalgoods;
