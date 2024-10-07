import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../services/firebaseConfig";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Typography,
  Stack,
  Box,
} from "@mui/material";

const Form = ({
  propertyLocation,
  selectedProperty,
  setSelectedProperty,
  fetchProperties,
}) => {
  const [property, setProperty] = useState({
    name: "",
    description: "",
    type: "Casa",
    pricePerM2: 0,
    totalArea: 0,
    zoning: "",
    services: "",
    district: "",
    address: "",
    photos: [],
    location: propertyLocation,
  });
  const [pricePerM2Formatted, setPricePerM2Formatted] = useState(""); // Estado para mostrar el valor formateado
  const [error, setError] = useState(""); // Estado para el mensaje de error

  const db = getFirestore(app);
  const storage = getStorage(app);

  // Lista de distritos de Arequipa
  const arequipaDistricts = [
    "Cercado",
    "Yanahuara",
    "Cayma",
    "Cerro Colorado",
    "Characato",
    "Sachaca",
    "Miraflores",
    "Paucarpata",
    "Socabaya",
    "Hunter",
    "Mariano Melgar",
    "Jacobo Hunter",
    "José Luis Bustamante y Rivero",
    "Tiabaya",
    "Uchumayo",
  ];

  useEffect(() => {
    if (selectedProperty) {
      setProperty(selectedProperty);
      // Formatear el precio al cargar la propiedad seleccionada
      setPricePerM2Formatted(
        selectedProperty.pricePerM2Raw
          ? new Intl.NumberFormat("en-US").format(
              selectedProperty.pricePerM2Raw
            )
          : ""
      );
    }
  }, [selectedProperty]);

  useEffect(() => {
    setProperty({ ...property, location: propertyLocation });
  }, [propertyLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    // Separar el control del precio para formatearlo correctamente
    if (name === "pricePerM2Raw") {
      const rawValue = value.replace(/[^0-9]/g, ""); // Remover cualquier carácter no numérico
      const formattedValue = rawValue
        ? new Intl.NumberFormat("en-US").format(rawValue)
        : "";
      console.log(rawValue, formattedValue);
      setProperty({ ...property, [name]: rawValue });
      setPricePerM2Formatted(formattedValue);
    } else {
      setProperty({ ...property, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Limitar a 3 archivos
    setProperty({ ...property, photos: files });
  };

  const handleDistrictChange = (e) => {
    setProperty({ ...property, district: e.target.value });
  };

  const uploadPhotos = async (propertyId) => {
    const uploadPromises = property.photos.map(async (file, index) => {
      const storageRef = ref(
        storage,
        `properties/${propertyId}/image_${index + 1}`
      );
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  const saveProperty = async () => {
    // Validación de campos obligatorios
    if (!property.name) {
      setError("Por favor, ingrese el nombre de la propiedad.");
      return;
    }
    if (!property.district) {
      setError("Por favor, seleccione un distrito.");
      return;
    }
    if (
      !property.location ||
      !property.location.lat ||
      !property.location.lng
    ) {
      setError("Por favor, seleccione las coordenadas de la ubicación.");
      return;
    }

    try {
      let propertyDocRef;

      if (selectedProperty && selectedProperty.id) {
        // Actualizar propiedad existente
        propertyDocRef = doc(db, "properties", selectedProperty.id);
        await updateDoc(propertyDocRef, { ...property, photos: [] });
      } else {
        // Crear nueva propiedad
        propertyDocRef = await addDoc(collection(db, "properties"), {
          ...property,
          photos: [],
        });
      }

      const photoUrls = await uploadPhotos(propertyDocRef.id);
      await updateDoc(propertyDocRef, { photos: photoUrls });

      alert(
        selectedProperty
          ? "¡Propiedad actualizada exitosamente!"
          : "¡Propiedad guardada exitosamente!"
      );

      // Resetear estado
      setProperty({
        name: "",
        description: "",
        type: "Casa",
        pricePerM2: 0,
        totalArea: 0,
        zoning: "",
        services: "",
        district: "",
        address: "",
        photos: [],
        location: propertyLocation,
      });
      setPricePerM2Formatted("");
      setSelectedProperty(null);
      setError(""); // Limpiar errores
      fetchProperties();
    } catch (e) {
      console.error("Error al guardar la propiedad: ", e);
      setError("Hubo un error al guardar la propiedad. Inténtelo de nuevo.");
    }
  };

  return (
    <Box
      component='form'
      p={3}
      sx={{ bgcolor: "background.paper", borderRadius: 2 }}
    >
      <Typography variant='h5' component='h2' mb={2}>
        Detalles de la Propiedad
      </Typography>
      {error && (
        <Typography variant='body2' color='error' mb={2}>
          {error}
        </Typography>
      )}
      <Stack spacing={3}>
        <TextField
          label='Nombre'
          name='name'
          value={property.name}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          label='Descripción'
          name='description'
          value={property.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />

        <FormControl component='fieldset'>
          <FormLabel component='legend'>Tipo de Propiedad</FormLabel>
          <RadioGroup
            row
            name='type'
            value={property.type}
            onChange={handleInputChange}
          >
            <FormControlLabel value='Casa' control={<Radio />} label='Casa' />
            <FormControlLabel
              value='Terreno'
              control={<Radio />}
              label='Terreno'
            />
            <FormControlLabel
              value='Apartamento'
              control={<Radio />}
              label='Apartamento'
            />
          </RadioGroup>
        </FormControl>

        <Stack direction='row' spacing={2}>
          <TextField
            label='Precio por m²'
            name='pricePerM2Raw'
            value={pricePerM2Formatted} // Usar valor formateado en el input
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            type='number'
            label='Área Total (m²)'
            name='totalArea'
            value={property.totalArea}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>

        <Stack direction='row' spacing={2}>
          <TextField
            label='Zonificación'
            name='zoning'
            placeholder='e.g. Residencial, Comercial'
            value={property.zoning}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label='Servicios'
            name='services'
            placeholder='e.g. Agua, Electricidad'
            value={property.services}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>

        <Stack direction='row' spacing={2}>
          <FormControl fullWidth>
            <Select
              value={property.district}
              onChange={handleDistrictChange}
              displayEmpty
            >
              <MenuItem value=''>
                <em>Seleccione un distrito</em>
              </MenuItem>
              {arequipaDistricts.map((district, index) => (
                <MenuItem key={index} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label='Dirección'
            name='address'
            value={property.address}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>

        <Button variant='contained' component='label' color='secondary'>
          Subir Fotos (máximo 3)
          <input
            type='file'
            multiple
            accept='image/*'
            hidden
            onChange={handleFileChange}
          />
        </Button>

        <Button variant='contained' color='primary' onClick={saveProperty}>
          {selectedProperty ? "Actualizar Propiedad" : "Guardar Propiedad"}
        </Button>
      </Stack>
    </Box>
  );
};

export default Form;
