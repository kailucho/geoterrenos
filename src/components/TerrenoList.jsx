import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app } from "../services/firebaseConfig";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Stack,
  Button,
} from "@mui/material";
import {
  Delete,
  Edit,
  House,
  Apartment,
  LocationOn,
} from "@mui/icons-material";

const TerrenoList = ({
  setSelectedProperty,
  fetchProperties,
  properties,
  setProperties,
}) => {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [district, setDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const db = getFirestore(app);

  useEffect(() => {
    let filtered = properties;
    if (district) {
      filtered = filtered.filter((property) => property.district === district);
    }
    if (propertyType) {
      filtered = filtered.filter((property) => property.type === propertyType);
    }
    setFilteredProperties(filtered);
  }, [district, propertyType, properties]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "properties", id));
      setProperties(properties.filter((property) => property.id !== id));
    } catch (e) {
      console.error("Error al eliminar la propiedad: ", e);
    }
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
  };

  const getPropertyIcon = (propertyType) => {
    switch (propertyType) {
      case "Casa":
        return <House />;
      case "Departamento":
        return <Apartment />;
      case "Terreno":
        return <LocationOn />;
      default:
        return <House />;
    }
  };

  return (
    <Container>
      <Typography variant='h4' color='secondary' gutterBottom>
        Lista de Propiedades
      </Typography>

      {/* Filtros */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={4}
        justifyContent='space-between'
      >
        <FormControl variant='outlined' fullWidth>
          <InputLabel>Filtro por distrito</InputLabel>
          <Select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            label='Filtro por distrito'
          >
            <MenuItem value=''>
              <em>Todos</em>
            </MenuItem>
            {properties
              .map((property) => property.district)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((district, index) => (
                <MenuItem key={index} value={district}>
                  {district}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl variant='outlined' fullWidth>
          <InputLabel>Filtro por tipo de propiedad</InputLabel>
          <Select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            label='Filtro por tipo de propiedad'
          >
            <MenuItem value=''>
              <em>Todos</em>
            </MenuItem>
            {properties
              .map((property) => property.type)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Lista de Propiedades */}
      <Box display='flex' flexWrap='wrap' justifyContent='space-around' gap={3}>
        {filteredProperties.length ? (
          filteredProperties.map((property) => (
            <Card
              key={property.id}
              sx={{
                width: 300,
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
              }}
            >
              {property.photos && property.photos.length > 0 && (
                <CardMedia
                  component='img'
                  height='180'
                  image={property.photos[0]}
                  alt={property.name}
                />
              )}
              <CardContent sx={{ bgcolor: "primary.light", color: "white" }}>
                <Box display='flex' alignItems='center' mb={1}>
                  {getPropertyIcon(property.type)}
                  <Typography variant='h6' component='div' sx={{ ml: 1 }}>
                    {property.name}
                  </Typography>
                </Box>
                <Typography variant='body2'>
                  Distrito: {property.district}
                </Typography>
                <Typography variant='body2'>
                  Precio: ${property.pricePerM2}/m²
                </Typography>
              </CardContent>
              <CardContent
                sx={{ display: "flex", justifyContent: "space-around" }}
              >
                <Button
                  variant='contained'
                  color='secondary'
                  size='small'
                  startIcon={<Edit />}
                  onClick={() => handleEdit(property)}
                >
                  Editar
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  startIcon={<Delete />}
                  onClick={() => handleDelete(property.id)}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant='h6' color='textSecondary' textAlign='center'>
            No se encontraron propiedades.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default TerrenoList;
