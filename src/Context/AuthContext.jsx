import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  GoogleAuthProvider,
  signInWithPopup,
} from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setRole(userDoc.exists() ? userDoc.data().role || "user" : "user");
        setUser(currentUser);
      } else {
        setUser(null);
        setRole("user");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("New user created in Auth:", res.user.uid);

      await setDoc(doc(db, "users", res.user.uid), {
        role: "user",
        email: email,
        created_at: serverTimestamp(),
      });
      console.log("Firestore user doc created for UID:", res.user.uid);

      await signOut(auth);
      console.log("Logged out after registration");

      return res.user;
    } catch (error) {
      console.error("Registration failed:", error.code, error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", currentUser.uid), {
          role: "user",
          email: currentUser.email,
          displayName: currentUser.displayName || null,
          photoURL: currentUser.photoURL || null,
          created_at: serverTimestamp(),
        });
        console.log(
          "Firestore user doc created for Google user:",
          currentUser.uid
        );
      }

      return currentUser;
    } catch (error) {
      console.error("Google login failed:", error.code, error.message);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
