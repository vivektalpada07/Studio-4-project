import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Ensure Firebase Auth is imported
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../css/Header.css';
import '../css/Addproduct.css';
import HeaderSwitcher from './HeaderSwitcher';

function Addproducts() {
  // States for managing form inputs
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productDetailedDescription, setProductDetailedDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [category, setCategory] = useState('furniture'); // Default category is set to 'furniture'
  const [images, setImages] = useState([]); // To store selected images for upload
  const [imageUrls, setImageUrls] = useState([]); // To store URLs of uploaded images
  const [progress, setProgress] = useState(0); // To track upload progress
  const [successMessage, setSuccessMessage] = useState(''); // Success message after adding product

  const storage = getStorage(); // Initialize Firebase Storage

  // Handle image selection from file input
  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages([...e.target.files]); // Allow multiple image selection
    }
  };

  // Handle image uploads to Firebase Storage
  const handleImageUpload = () => {
    if (images.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    // Map through the selected images and upload each
    const uploadPromises = images.map((image) => {
      const storageRef = ref(storage, `images/${productName}/${image.name}`); // Save images in a sub-folder under the product name
      const uploadTask = uploadBytesResumable(storageRef, image); // Upload image

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculate and update the upload progress for each image
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
          },
          (error) => {
            // Handle upload errors
            console.error("Upload failed: ", error);
            reject(error);
          },
          () => {
            // Once upload completes, get the download URL of the image
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUrls((prev) => [...prev, downloadURL]); // Store the download URL in state
              resolve(downloadURL); // Resolve the promise after successful upload
            });
          }
        );
      });
    });

    // Wait for all image uploads to complete
    Promise.all(uploadPromises)
      .then((urls) => {
        console.log('All images uploaded:', urls);
        alert('Images uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading images: ', error);
        alert('Failed to upload images. Please try again.');
      });
  };

  // Handle form submission and product data storage
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (!user) {
        throw new Error("User not authenticated"); // Ensure user is logged in
      }

      // Add product information to Firestore, including image URLs and seller details
      const docRef = await addDoc(collection(db, "products"), {
        productName,
        productDescription,
        productDetailedDescription,
        productPrice: Number(productPrice), // Convert price to number format
        category,
        imageUrls, // Store the uploaded image URLs
        sellerId: user.uid, // Save the seller's unique ID
        sellerUsername: user.displayName || user.email.split('@')[0], // Use the seller's display name or email as username
        sellerEmail: user.email, // Save the seller's email address
      });

      console.log("Document written with ID: ", docRef.id);

      // Display success message and reset the form fields
      setSuccessMessage('Product added successfully!');
      setProductName('');
      setProductDescription('');
      setProductDetailedDescription('');
      setProductPrice('');
      setCategory('furniture');
      setImages([]);
      setImageUrls([]);
      setProgress(0);

      // Remove success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (e) {
      console.error("Error adding document: ", e); // Log any errors during submission
    }
  };

  return (
    <div className='main-content' style={{marginTop: -70}}>
      {/* Dynamic header switching based on the user type */}
      <HeaderSwitcher/>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Description:</label>
          <input
            type="text"
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
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="furniture">Furnitures</option>
            <option value="electricalgoods">Electrical Goods</option>
            <option value="homewares">Homewares</option>
            <option value="other">Other Products</option> {/* Option for uncategorized products */}
          </select>
        </div>
        <div>
          <label>Upload Images:</label>
          <input type="file" onChange={handleImageChange} multiple />
          <button type="button" onClick={handleImageUpload}>Upload Images</button>
          <progress value={progress} max="100" />
          {imageUrls.length > 0 && imageUrls.map((url, index) => (
            <img key={index} src={url} alt="Uploaded" style={{ width: '100px', marginTop: '10px' }} />
          ))}
        </div>
        <button type="submit">Add Product</button>
      </form>

      {/* Success message after product submission */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default Addproducts;
