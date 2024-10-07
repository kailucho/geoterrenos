import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -16.409047, // Centro de Lima por defecto
  lng: -71.537451,
};

const Map = ({ setPropertyLocation, properties }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

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
  };

  return isLoaded ? (
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

      {/* Mostrar ventana de información al hacer clic en un marcador */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.location}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <Card sx={{ maxWidth: 300, boxShadow: 3, borderRadius: 2 }}>
            {selectedMarker.photos && selectedMarker.photos.length > 0 && (
              <CardMedia
                component='img'
                height='140'
                image={selectedMarker.photos[0]}
                alt={selectedMarker.name}
              />
            )}
            <CardContent>
              <Box mb={2}>
                <Typography variant='h5' component='div' gutterBottom>
                  {selectedMarker.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Tipo: {selectedMarker.type}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Distrito: {selectedMarker.district}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Precio: ${selectedMarker.price}/m²
                </Typography>
              </Box>

              {/* Mostrar imágenes adicionales con Stack */}
              <Stack direction='row' spacing={1}>
                {selectedMarker.photos &&
                  selectedMarker.photos.slice(1).map((url, idx) => (
                    <Box
                      key={idx}
                      component='img'
                      src={url}
                      alt={`Propiedad ${idx}`}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    />
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <Box textAlign='center' mt={2}>
      Cargando mapa...
    </Box>
  );
};

export default React.memo(Map);
