import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const fetchAllReviews = async () => {
    try {
      const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
      const allReviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(allReviews);
      return allReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  
  useEffect(() => {
    fetchAllReviews();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, fetchAllReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
