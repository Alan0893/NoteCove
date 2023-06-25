import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Reset from "./pages/reset";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { lighten, darken } from "@mui/material/styles"

function getContrastText(color) {
  const hex = color.substring(1);
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const col = (r*229 + g*587 + b*114) / 1000;
  return col >= 128 ? "#000" : "#fff";
}

const mainColor = "#4c8bf5";
const lightShade = lighten(mainColor, 0.2);
const darkShade = darken(mainColor, 0.2);
const contrastText = getContrastText(mainColor);

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: lightShade,
      main: mainColor,
      dark: darkShade,
      contrastText: contrastText,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: lightShade,
      main: mainColor,
      dark: darkShade,
      contrastText: getContrastText(mainColor),
      contrastThreshold: 10
    },
  },
});

function App() {
  const systemThemePreference =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [themeMode, setThemeMode] = useState(systemThemePreference);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        light: lightShade,
        main: mainColor,
        dark: darkShade,
        contrastText: getContrastText(mainColor),
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home toggleTheme={toggleTheme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset" element={<Reset />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
