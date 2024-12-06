//this is for the supplier can add product and thier functions........
import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Firebase configuration and authentication imports
import { collection, addDoc } from 'firebase/firestore'; // Firestore for database interactions
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions
import '../css/Header.css'; // CSS for header styling
import LoadingPage from './Loadingpage'; // Loading page component
import '../css/Addproduct.css'; // CSS for Add Product page styling
import HeaderSwitcher from './HeaderSwitcher'; // Dynamic header component

function Addproducts() {
  // States for managing form fields, image uploads, and UI feedback
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productDetailedDescription, setProductDetailedDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [category, setCategory] = useState('furniture');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [progress, setProgress] = useState(0); // Progress for image upload
  const [successMessage, setSuccessMessage] = useState(''); // Success message display
  const [loading, setLoading] = useState(false); // Loading state during operations
  const storage = getStorage(); // Initialize Firebase Storage

  // Handle file selection for image upload
  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages([...e.target.files]);
    }
  };

  // Function to upload images to Firebase Storage
  const handleImageUpload = () => {
    if (images.length === 0) {
      alert('Please select images to upload.'); // Validation for no image selected
      return;
    }

    setLoading(true); // Start loading during image upload

    const uploadPromises = images.map((image) => {
      const storageRef = ref(storage, `images/${productName}/${image.name}`); // Generate unique path for each image
      const uploadTask = uploadBytesResumable(storageRef, image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100); // Calculate upload progress
            setProgress(progress);
          },
          (error) => {
            console.error('Upload failed: ', error); // Log errors during upload
            reject(error);
          },
          () => {
            // On successful upload, get the image download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUrls((prev) => [...prev, downloadURL]); // Store image URLs in state
              resolve(downloadURL);
            });
          }
        );
      });
    });

    Promise.all(uploadPromises)
      .then(() => {
        alert('Images uploaded successfully!'); // Notify successful upload
      })
      .catch((error) => {
        console.error('Error uploading images: ', error); // Log any errors
        alert('Failed to upload images. Please try again.');
      })
      .finally(() => {
        setLoading(false); // End loading after upload completes
      });
  };

  // Function to handle product form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      setLoading(true); // Start loading during form submission

      const user = auth.currentUser; // Fetch the currently logged-in user
      if (!user) {
        throw new Error('User not authenticated'); // Check for authentication
      }

      // Add product data to Firestore
      await addDoc(collection(db, 'products'), {
        productName,
        productDescription,
        productDetailedDescription,
        productPrice: Number(productPrice), // Convert price to a number
        category,
        imageUrls, // Store uploaded image URLs
        sellerId: user.uid, // User ID of the seller
        sellerUsername: user.displayName || user.email.split('@')[0], // Use displayName or email prefix
        sellerEmail: user.email, // Seller's email
      });

      setSuccessMessage('Product added successfully!'); // Notify successful product addition
      // Reset form fields and states
      setProductName('');
      setProductDescription('');
      setProductDetailedDescription('');
      setProductPrice('');
      setCategory('furniture');
      setImages([]);
      setImageUrls([]);
      setProgress(0);

      setTimeout(() => {
        setSuccessMessage(''); // Clear success message after 3 seconds
      }, 3000);
    } catch (e) {
      console.error('Error adding document: ', e); // Log any errors during form submission
    } finally {
      setLoading(false); // End loading after form submission
    }
  };

  // Render loading page if the loading state is active
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className='main-content' style={{ marginTop: -70 }}>
      <HeaderSwitcher /> {/* Dynamic header component */}
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
          <progress value={progress} max='100' /> {/* Progress bar for image upload */}
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
        <button type='submit'>Add Product</button> {/* Submit button for form */}
      </form>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Success message */}
    </div>
  );
}

export default Addproducts; // Exporting Addproducts component for use
