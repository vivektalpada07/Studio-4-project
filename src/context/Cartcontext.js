import React from 'react';

import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user: currentUser } = useUserAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser) return;


      
      try {
        const docRef = doc(db, "cart", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCartItems(docSnap.data().items || []);
        } else {
          console.log("No cart items found");
        }
      } catch (e) {
        console.error("Error fetching cart items:", e);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  async function addToCart(product) {
    if (!currentUser) {
      alert("You need to log in to add items to the cart.");
      return;
    }

    const userName = currentUser.displayName || currentUser.email;
    const newCartItem = { ...product, userName };

    try {
      const docRef = doc(db, "cart", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingItems = docSnap.data().items || [];
        const isAlreadyInCart = existingItems.some(item => item.productId === product.productId);

        if (isAlreadyInCart) {
          alert("This product is already in your cart.");
          return;
        }

        const updatedItems = [...existingItems, newCartItem];

        await setDoc(docRef, { userId: currentUser.uid, userName, items: updatedItems });
        setCartItems(updatedItems);
      } else {
        await setDoc(docRef, { userId: currentUser.uid, userName, items: [newCartItem] });
        setCartItems([newCartItem]);
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  }

  async function removeFromCart(productId) {
    try {
      const docRef = doc(db, "cart", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingItems = docSnap.data().items || [];
        const updatedItems = existingItems.filter(item => item.productId !== productId);

        await setDoc(docRef, { ...docSnap.data(), items: updatedItems });
        setCartItems(updatedItems);
      }
    } catch (e) {
      console.error("Error removing from cart:", e);
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}

export default CartContextProvider;
