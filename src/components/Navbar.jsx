import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const logout = () => {
    console.log("Logging out...");
    auth.signOut();
    navigate("/");
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Property App
        </Typography>
        {user ? (
          <Box display='flex' alignItems='center'>
            <Avatar
              alt={user.displayName || user.email}
              src={user.photoURL || ""}
              sx={{ marginRight: 2 }}
            />
            <Typography variant='body1' sx={{ marginRight: 2 }}>
              {user.displayName || user.email}
            </Typography>
            <Button color='inherit' onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color='inherit' onClick={() => navigate("/")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
