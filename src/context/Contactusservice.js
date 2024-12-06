import { db } from "../firebase"; // Adjust the import based on your project structure

import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";



const collectionName = "contacts";
const contactCollectionRef = collection(db, collectionName);

class ContactusService {
  addContact = (newContact) => {
    return addDoc(contactCollectionRef, newContact);
  };

  getAllContacts = () => {
    return getDocs(contactCollectionRef);
  };

  getContact = (id) => {
    const contactDoc = doc(db, collectionName, id);
    return getDoc(contactDoc);
  };
}

export default new ContactusService();
