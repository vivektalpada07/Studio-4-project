import React from 'react';

import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductContext = createContext();

export function ProductContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched Products:", productsArray);
        setProducts(productsArray);
      } catch (e) {
        console.error("Error fetching products:", e);
      }
    };

    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "checkout"));
        const ordersArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersArray);
      } catch (e) {
        console.error("Error fetching orders:", e);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  async function addProduct(product) {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      const newProduct = {
        id: docRef.id,
        ...product,
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    } catch (e) {
      console.error("Error adding product:", e);
    }
  }

  function updateProduct(productId, updatedProduct) {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, ...updatedProduct } : product
      )
    );
  }

  async function deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, "checkout", orderId);
      await updateDoc(orderRef, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (e) {
      console.error("Error updating order status:", e);
    }
  }

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductcontext() {
  return useContext(ProductContext);
}
