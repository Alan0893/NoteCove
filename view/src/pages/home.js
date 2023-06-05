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

const drawerWidth = 240;

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

const Home = (props) => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    profilePicture: "",
    uiLoading: true,
    imageLoading: false,
    render: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("https://us-central1-todo-83183.cloudfunctions.net/api/user")
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          email: response.data.userCredentials.email,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username,
          uiLoading: false,
          profilePicture: response.data.userCredentials.imageUrl,
        }));
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login");
        }
        setState((prevState) => ({
          ...prevState,
          errorMsg: "Error in retrieving the data",
        }));
      });
  }, [props.history, navigate]);

  const loadAccountPage = () => {
    setState((prevState) => ({ ...prevState, render: true }));
  };

  const loadTodoPage = () => {
    setState((prevState) => ({ ...prevState, render: false }));
  };

  const logoutHandler = () => {
    localStorage.removeItem("AuthToken");
    navigate("/login");
  };

  if (state.uiLoading) {
    return (
      <Root>
        <UiProgress size={150}/>
      </Root>
    );
  } else {
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
