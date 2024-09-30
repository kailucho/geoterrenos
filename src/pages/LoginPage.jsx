import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../services/firebaseConfig";

const LoginPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Error logging in with Google: ", error);
    }
  };

  if (user) {
    navigate("/home");
  }

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
