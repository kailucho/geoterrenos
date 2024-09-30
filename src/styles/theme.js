import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B30D15", // Rojo vibrante para elementos principales
      dark: "#91161B", // Rojo oscuro para estados activos y hover
      light: "#C5463B", // Rojo cálido para detalles
    },
    secondary: {
      main: "#000000", // Negro para la barra de navegación
    },
    background: {
      default: "#F4F4F4", // Fondo general para la aplicación
      paper: "#FFFFFF", // Fondo de los contenedores
    },
    text: {
      primary: "#000000", // Texto principal en negro
      secondary: "#91161B", // Texto de encabezados y etiquetas
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontSize: "1.8rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.4rem",
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
