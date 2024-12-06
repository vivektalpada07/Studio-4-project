import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

const collectionName = "checkout";
const checkoutCollectionRef = collection(db, collectionName);




class CheckoutService {
  addCheckout = async (newCheckout, userId) => {
    try {
      console.log("userId passed to checkout: ", userId);
      const docRef = await addDoc(checkoutCollectionRef, {
        ...newCheckout,
        userId,
      });
  
      await updateDoc(docRef, { paymentId: docRef.id });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding checkout: ", error);
    }
  };


  getAllCheckouts = () => {
    return getDocs(checkoutCollectionRef);
  };

  getCheckout = (id) => {
    const checkoutDoc = doc(db, collectionName, id);
    return getDoc(checkoutDoc);
  };
}

export default new CheckoutService();
