import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';
import React from 'react';

const WishlistContext = createContext();

export function WishlistContextProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user: currentUser } = useUserAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "wishlist", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWishlist(docSnap.data().items || []);
        } else {
          console.log("No wishlist items found");
        }
      } catch (e) {
        console.error("Error fetching wishlist items:", e);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  async function addToWishlist(product) {
    if (!currentUser) {
      alert("You need to log in to add items to your wishlist.");
      return;
    }

    const userName = currentUser.displayName || currentUser.email;
    const newWishlistItem = { ...product, userName };

    try {
      const docRef = doc(db, "wishlist", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingItems = docSnap.data().items || [];
        const isAlreadyInWishlist = existingItems.some(item => item.productId === product.productId);

        if (isAlreadyInWishlist) {
          alert("This product is already in your wishlist.");
        } else {
          const updatedItems = [...existingItems, newWishlistItem];
          await setDoc(docRef, { userId: currentUser.uid, userName, items: updatedItems });
          setWishlist(updatedItems);
        }
      } else {
        await setDoc(docRef, { userId: currentUser.uid, userName, items: [newWishlistItem] });
        setWishlist([newWishlistItem]);
      }
    } catch (e) {
      console.error("Error adding to wishlist:", e);
    }
  }

  async function removeFromWishlist(productId) {
    try {
      const docRef = doc(db, "wishlist", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingItems = docSnap.data().items || [];
        const updatedItems = existingItems.filter(item => item.productId !== productId);

        await setDoc(docRef, { ...docSnap.data(), items: updatedItems });
        setWishlist(updatedItems);
      }
    } catch (e) {
      console.error("Error removing from wishlist:", e);
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  return useContext(WishlistContext);
}
