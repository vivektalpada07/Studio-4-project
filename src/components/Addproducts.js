import React, { useState } from 'react';
import axios from 'axios';
import '../css/Header.css';
import LoadingPage from './Loadingpage';
import '../css/Addproduct.css';
import HeaderSwitcher from './HeaderSwitcher';

function Addproducts() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productDetailedDescription, setProductDetailedDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [category, setCategory] = useState('furniture');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages([...e.target.files]);
    }
  };

  const handleImageUpload = async () => {
    if (images.length === 0) {
      alert('Please select images to upload.');
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    setLoading(true); // Set loading state to true during image upload

    try {
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImageUrls(response.data.fileUrls);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images: ', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setLoading(false); // Set loading state back to false after upload completes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true during product submission

      const productData = {
        productName,
        productDescription,
        productDetailedDescription,
        productPrice: Number(productPrice),
        category,
        imageUrls,
      };

      // Submit product data to your backend (or database)
      console.log('Product submitted:', productData);

      setSuccessMessage('Product added successfully!');
      setProductName('');
      setProductDescription('');
      setProductDetailedDescription('');
      setProductPrice('');
      setCategory('furniture');
      setImages([]);
      setImageUrls([]);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding product: ', error);
    } finally {
      setLoading(false); // Set loading state back to false after product submission completes
    }
  };

  // Show loading page while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className='main-content' style={{ marginTop: -70 }}>
      <HeaderSwitcher />
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type='text'
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Description:</label>
          <input
            type='text'
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Detailed Description:</label>
          <textarea
            value={productDetailedDescription}
            onChange={(e) => setProductDetailedDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type='number'
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value='furniture'>Furnitures</option>
            <option value='electricalgoods'>Electrical Goods</option>
            <option value='homewares'>Homewares</option>
            <option value='other'>Other Products</option>
          </select>
        </div>
        <div>
          <label>Upload Images:</label>
          <input type='file' onChange={handleImageChange} multiple />
          <button type='button' onClick={handleImageUpload}>
            Upload Images
          </button>
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt='Uploaded'
                style={{ width: '100px', marginTop: '10px' }}
              />
            ))}
        </div>
        <button type='submit'>Add Product</button>
      </form>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default Addproducts;
