import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { AccountBox, Notes, ExitToApp } from "@mui/icons-material";
import styled from "@mui/system/styled";
import { useNavigate } from "react-router-dom";
import Account from "../components/account";
import Todo from "../components/todo";
import { authMiddleWare } from "../util/auth";
import config from "../util/config";

const drawerWidth = 240;

// Styled Components
const Root = styled("div")({
  display: "flex",
});
const CustomAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));
const CustomDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
});
const Content = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));
const CustomAvatar = styled(Avatar)({
  height: 110,
  width: 110,
  flexShrink: 0,
  flexGrow: 0,
  marginTop: 20,
});
const UiProgress = styled(CircularProgress)(({
  position: "fixed",
  zIndex: "1000",
  height: "31px",
  width: "31px",
  left: "45%",
  top: "35%",
}));
const ToolbarSpacing = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// Home function 
const Home = (props) => {
  // States of function components
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    profilePicture: "",
    uiLoading: true,
    imageLoading: false,
    render: false,
  });

  // Provide navigation to redirect to pages
  const navigate = useNavigate();

  // After render
  useEffect(() => {
    // Validate user authentication and retrieve user data 
    authMiddleWare(navigate); // Middleware to check if the user is authenticated
    const authToken = localStorage.getItem("AuthToken");  // Retrieve the authentication token from local storage
    axios.defaults.headers.common = { Authorization: `${authToken}` };  // Set the authorization header for axios request
    axios
      .get(`${config.API_URL}/user`)  // Make a GET request
      .then((response) => { 
        // Handle successful response
        setState((prevState) => ({
          ...prevState,
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          email: response.data.userCredentials.email,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username,
          uiLoading: false, // Set uiLoading to false once the data is loaded
          profilePicture: response.data.userCredentials.imageUrl,
        }));
      })
      .catch((error) => {
        // Handle error response
        if (error.response.status === 403) {
          navigate("/login"); // If the user is not authenticated, navigate to the login page
        }
        // Set the errorMessage state
        setState((prevState) => ({
          ...prevState,
          errorMsg: "Error in retrieving the data",
        }));
      });
  }, [props.history, navigate]);

  // Setting the render state to true
  const loadAccountPage = () => {
    setState((prevState) => ({ ...prevState, render: true }));
  };
  // Setting the render state to false
  const loadTodoPage = () => {
    setState((prevState) => ({ ...prevState, render: false }));
  };
  // Handling when the user logs out
  const logoutHandler = () => {
    // Removing the Authorization Token from the local storage
    localStorage.removeItem("AuthToken");
    // Redirecting to login page
    navigate("/login");
  };

  if (state.uiLoading) {  // The UI is still loading
    // Show the loading spinner while the UI is loading
    return (
      <Root>
        <UiProgress size={150}/>
      </Root>
    );
  } else {  // Render the home page once the UI is loaded
    return (
      <Root>
        <CssBaseline />
        <CustomAppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap>
              TodoApp
            </Typography>
          </Toolbar>
        </CustomAppBar>
        <CustomDrawer
          variant="permanent"
          PaperProps={{
            elevation: 1,
          }}
        >
          <ToolbarSpacing />
          <Divider />
          <center>
            <CustomAvatar src={state.profilePicture} />
            <p>
              {" "}
              {state.firstName} {state.lastName}
            </p>
          </center>
          <Divider />
          <List>
            <ListItemButton onClick={loadTodoPage}>
              <ListItemIcon>
                {" "}
                <Notes />{" "}
              </ListItemIcon>
              <ListItemText primary="Todo" />
            </ListItemButton>

            <ListItemButton onClick={loadAccountPage}>
              <ListItemIcon>
                {" "}
                <AccountBox />{" "}
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItemButton>

            <ListItemButton onClick={logoutHandler}>
              <ListItemIcon>
                {" "}
                <ExitToApp />{" "}
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </CustomDrawer>
        
        <Content>
          <ToolbarSpacing />
          <div>{state.render ? <Account /> : <Todo />}</div>
        </Content>
      </Root>
    );
  }
};

export default Home;
