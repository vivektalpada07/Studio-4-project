import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";

const collectionName = "users";

class FBDataService {
  addData = (newData) => {
    return addDoc(collection(db, collectionName), newData);
  };

  setData = (newData) => {
    return setDoc(doc(db, collectionName, newData.id), newData);
  };

  updateData = (id, newData) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, newData);
  };
  
  deleteData = (id) => {
    const docRef = doc(db, collectionName, id);
    return deleteDoc(docRef);
  };

  getAllData = async () => {
    const usersCollection = collection(db, collectionName);
    return await getDocs(usersCollection);
  };

  getData = (id) => {
    const docRef = doc(db, collectionName, id);
    return getDoc(docRef);
  };
}

export default new FBDataService();
