import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { lighten, darken } from "@mui/material/styles"
import { light } from "@mui/material/styles/createPalette";

const mainColor = "#4c8bf5";
const lightShade = lighten(mainColor, 0.2);
const darkShade = darken(mainColor, 0.2);

const theme = createTheme({
  palette: {
    primary: {
      light: lightShade,
      main: mainColor,
      dark: darkShade,
      contrastText: "#fff",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
