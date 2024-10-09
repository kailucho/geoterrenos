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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Container,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Stack,
  Button,
  Typography,
  Divider,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
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
    setOpenConfirmDialog(false);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
  };

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
  };

  const confirmDelete = (property) => {
    setPropertyToDelete(property);
    setOpenConfirmDialog(true);
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
      <Typography
        variant='h4'
        color='primary'
        gutterBottom
        textAlign='center'
        mb={4}
      >
        Lista de Propiedades
      </Typography>

      {/* Filtros */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
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
      </Paper>

      {/* Lista de Propiedades */}
      {filteredProperties.length ? (
        <Box display='flex' flexDirection='column' gap={3}>
          {filteredProperties.map((property) => (
            <Paper
              elevation={4}
              key={property.id}
              sx={{ padding: 3, borderRadius: 2, cursor: "pointer" }}
              onClick={() => handleSelectProperty(property)}
            >
              <Box display='flex' alignItems='center' gap={4} mb={2}>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  {getPropertyIcon(property.type)}
                </Avatar>
                <Box flex='1'>
                  <Typography variant='h5' component='div' fontWeight='bold'>
                    {property.name || "Sin nombre"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {property.district}
                  </Typography>
                </Box>
                <Box>
                  {console.log({ property })}
                  <Typography variant='body2' color='textSecondary'>
                    <strong>Área total:</strong> {property.totalArea} m²
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    <strong>Precio:</strong> {property.currency}{" "}
                    {new Intl.NumberFormat("en-US").format(
                      property.pricePerM2Raw
                    )}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ marginBottom: 2 }} />
              <Box display='flex' alignItems='center' gap={4} mb={2}>
                <Typography variant='body2'>
                  <strong>Descripción:</strong>{" "}
                  {property.description || "Sin descripción"}
                </Typography>
                <Typography variant='body2'>
                  <strong>Tipo:</strong> {property.type}
                </Typography>
                <Typography variant='body2'>
                  <strong>Zonificación:</strong>{" "}
                  {property.zoning || "Sin zonificación"}
                </Typography>
                <Typography variant='body2'>
                  <strong>Servicios:</strong>{" "}
                  {property.services || "Sin servicios"}
                </Typography>
                <Typography variant='body2'>
                  <strong>Dirección:</strong>{" "}
                  {property.address || "Sin dirección"}
                </Typography>
              </Box>
              <Divider sx={{ marginBottom: 2 }} />
              <Box display='flex' justifyContent='flex-end' gap={2}>
                <Button
                  variant='outlined'
                  color='primary'
                  startIcon={<Edit />}
                  onClick={() => handleEdit(property)}
                >
                  Editar
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  startIcon={<Delete />}
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(property);
                  }}
                >
                  Eliminar
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography variant='h6' color='textSecondary' textAlign='center'>
          No se encontraron propiedades.
        </Typography>
      )}

      {/* Confirmación de Eliminación */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la propiedad "
            {propertyToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color='primary'>
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(propertyToDelete.id)}
            color='error'
            variant='contained'
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TerrenoList;
