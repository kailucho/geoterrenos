import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../services/firebaseConfig";
import Form from "../components/Form";
import TerrenoList from "../components/TerrenoList";
import Map from "../components/Map";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  IconButton,
  Fab,
  Box,
  useMediaQuery,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import PropertyIcon from "@mui/icons-material/LocationCity";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [propertyLocation, setPropertyLocation] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);

  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const db = getFirestore(app);

  const fetchProperties = async () => {
    const propertiesCollection = collection(db, "properties");
    const propertySnapshot = await getDocs(propertiesCollection);
    const propertyList = propertySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProperties(propertyList);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <>
      <Navbar />

      <Container maxWidth='xl' sx={{ mt: 4, mb: 4 }}>
        {isSmallScreen ? (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            gap={2}
          >
            {/* Mapa */}
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                height: "300px",
                position: "relative",
              }}
            >
              <Map
                setPropertyLocation={setPropertyLocation}
                properties={properties}
              />
            </Paper>

            {/* Formulario */}
            <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
              <Form
                propertyLocation={propertyLocation}
                selectedProperty={selectedProperty}
                setSelectedProperty={setSelectedProperty}
                fetchProperties={fetchProperties}
              />
            </Paper>

            {/* Listado de Propiedades */}
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                p: 2,
              }}
            >
              <TerrenoList
                setSelectedProperty={setSelectedProperty}
                properties={properties}
                fetchProperties={fetchProperties}
                setProperties={setProperties}
              />
            </Paper>
          </Box>
        ) : (
          <Box display='flex' flexDirection='column' gap={2}>
            {/* Sección Principal */}
            <Box display='flex' gap={2}>
              {/* Mapa */}
              <Paper
                elevation={3}
                sx={{
                  flex: 1,
                  position: "relative",
                }}
              >
                <Map
                  setPropertyLocation={setPropertyLocation}
                  properties={properties}
                />
              </Paper>

              {/* Formulario */}
              <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
                <Form
                  propertyLocation={propertyLocation}
                  selectedProperty={selectedProperty}
                  setSelectedProperty={setSelectedProperty}
                  fetchProperties={fetchProperties}
                />
              </Paper>
            </Box>

            {/* Listado de Propiedades */}
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: "auto",
              }}
            >
              <TerrenoList
                setSelectedProperty={setSelectedProperty}
                properties={properties}
                fetchProperties={fetchProperties}
                setProperties={setProperties}
              />
            </Paper>
          </Box>
        )}
      </Container>
    </>
  );
};

export default HomePage;
