import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import FBDataService from "../context/FBService";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(""); 
  const [loading, setLoading] = useState(true);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth).then(() => {
      setRole(null);
      setUser(null);
    });
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userDoc = await FBDataService.getData(currentUser.uid);
          if (userDoc.exists()) {
            setRole(userDoc.data().role || "");
          } else {
            console.error("User document does not exist");
            setRole(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
          setUser(null);
        }
      } else {
        setRole(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <userAuthContext.Provider value={{ user, role, logIn, signUp, logOut, googleSignIn }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
