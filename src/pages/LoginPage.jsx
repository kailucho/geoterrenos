import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import "./LoginPage.css"; // Asegúrate de crear un archivo CSS para los estilos

const LoginPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión con Google: ", error);
    }
  };

  if (user) {
    navigate("/home");
  }

  return (
    <div className='login-page'>
      <div className='login-banner'>
        <img src={"/assets/portada.jpg"} alt='Paisaje Urbano' />
      </div>
      <div className='login-content'>
        <h1>Bienvenidos a SALMER</h1>
        <p>La plataforma para gestionar tus datos de ubicación</p>
        <h2>Iniciar sesión en Gestión de Terrenos</h2>
        <button className='google-button' onClick={loginWithGoogle}>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
