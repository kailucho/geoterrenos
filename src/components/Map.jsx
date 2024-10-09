import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Chip,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importar estilos del carousel

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -16.409047,
  lng: -71.537451,
};

const Map = ({ setPropertyLocation, properties }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const onMapClick = useCallback(
    (e) => {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(position);
      setPropertyLocation(position);
    },
    [setPropertyLocation]
  );

  const handleMarkerClick = (property) => {
    setSelectedMarker(property);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMarker(null);
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={onMapClick}
      >
        {/* Mostrar marcador de la posición actual seleccionada */}
        {markerPosition && <Marker position={markerPosition} />}

        {/* Mostrar todos los marcadores de las propiedades */}
        {properties.map((property, index) => (
          <Marker
            key={index}
            position={property.location}
            onClick={() => handleMarkerClick(property)}
          />
        ))}
      </GoogleMap>

      {/* Ventana de confirmación con toda la información */}
      {selectedMarker && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='md'
          fullWidth
        >
          <DialogTitle>Detalles de la Propiedad</DialogTitle>
          <DialogContent>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              {/* Mostrar carousel si hay imágenes */}
              {selectedMarker.photos && selectedMarker.photos.length > 0 ? (
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  autoPlay
                  dynamicHeight
                  showStatus={false}
                  emulateTouch
                >
                  {selectedMarker.photos.map((url, idx) => (
                    <div key={idx}>
                      <img src={url} alt={`Propiedad ${idx}`} />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <Typography
                  variant='body2'
                  color='textSecondary'
                  textAlign='center'
                  p={2}
                >
                  No hay imágenes disponibles
                </Typography>
              )}

              <CardContent>
                <Box mb={2}>
                  <Typography variant='h5' component='div' gutterBottom>
                    {selectedMarker.name || "Sin nombre"}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box mb={2}>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Tipo:</strong> {selectedMarker.type}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Distrito:</strong> {selectedMarker.district}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Dirección:</strong> {selectedMarker.address}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Precio:</strong> {selectedMarker.currency}{" "}
                      {new Intl.NumberFormat("en-US").format(
                        selectedMarker.pricePerM2Raw
                      )}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Área Total:</strong> {selectedMarker.totalArea} m²
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Zonificación:</strong> {selectedMarker.zoning}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <strong>Servicios:</strong>{" "}
                      {selectedMarker.services || "No especificado"}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='body1' gutterBottom>
                    <strong>Descripción:</strong>
                  </Typography>
                  <Typography variant='body2' color='textSecondary' paragraph>
                    {selectedMarker.description || "Sin descripción"}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {selectedMarker.features &&
                    selectedMarker.features.length > 0 && (
                      <Box mt={2}>
                        <Typography variant='body1' gutterBottom>
                          <strong>Características:</strong>
                        </Typography>
                        <Box>
                          {selectedMarker.features.map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              variant='outlined'
                              color='primary'
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                </Box>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color='primary'>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  ) : (
    <Box textAlign='center' mt={2}>
      Cargando mapa...
    </Box>
  );
};

export default React.memo(Map);
