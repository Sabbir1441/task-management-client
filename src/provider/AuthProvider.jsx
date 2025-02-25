import { createContext, useEffect, useState } from 'react';

import { auth } from './../firebase/firebase.init';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

export const authContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutUser = () => {
    return signOut(auth);
  };
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  const updateProfileUser = (data) => {
    return updateProfile(auth.currentUser, data);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log('state captured', user?.email);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <authContext.Provider
      value={{
        user,
        loading,
        logoutUser,
        googleLogin,
        setUser,
        updateProfileUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;