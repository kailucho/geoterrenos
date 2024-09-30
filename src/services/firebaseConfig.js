// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAU79hhkQyXR1yoxV0CHAZ-iP_Rf_BpPrY",
  authDomain: "landing-map-70309.firebaseapp.com",
  projectId: "landing-map-70309",
  storageBucket: "landing-map-70309.appspot.com",
  messagingSenderId: "608132779744",
  appId: "1:608132779744:web:eae50f8d4caa920f204a85",
  measurementId: "G-0K35MWVZWH",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, app };
