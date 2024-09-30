import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className='navbar'>
      <h2>Property App</h2>
      {user ? (
        <>
          <span>Welcome, {user.displayName || user.email}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => navigate("/")}>Login</button>
      )}
    </div>
  );
};

export default Navbar;
