import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@mui/system/styled";
import {
  Typography,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  Divider,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useNavigate } from "react-router-dom";
import { authMiddleWare } from "../util/auth";

const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3)
}));
const Toolbar = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar
}));
const Root = styled(Card)(({ theme }) => ({

}));
const Details = styled("div")({
  display: "flex"
});
const LocationText = styled(Typography)({
  paddingLeft: "15px"
});
const UiProgress = styled(CircularProgress)({
  position: "fixed",
  zIndex: "1000",
  height: "31px",
  width: "31px",
  left: "50%",
  top: "35%",
});
const Progress = styled(CircularProgress)({
  position: "absolute",
});
const UploadButton = styled(Button)(({ theme }) => ({
  marginLeft: "8px",
  margin: theme.spacing(1),
}));
const CustomError = styled("div")({
  color: "red",
  fontSize: "0.8rem",
  marginTop: 10,
});
const SubmitButton = styled(Button)({
  marginTop: "10px",
});

const Account = (props) => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    country: "",
    profilePicture: "",
    uiLoading: true,
    buttonLoading: false,
    imageError: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    authMiddleWare(props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("https://us-central1-todo-83183.cloudfunctions.net/api/user")
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username,
          email: response.data.userCredentials.email,
          uiLoading: false
        }));
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login");
        }
        setState((prevState) => ({
          ...prevState,
          errorMsg: "Error in retrieving the data"
        }));
      });
  }, [props.history, navigate]);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const handleImageChange = (evt) => {
    setState({
      ...state,
      image: evt.target.files[0],
    });
  };
  const profilePictureHandler = (evt) => {
    evt.preventDefault();
    setState((prevState) => ({
      ...prevState,
      uiLoading: true,
    }));
    authMiddleWare(props.history);
    const authToken = localStorage.getItem("AuthToken");
    let form_data = new FormData();
    form_data.append("image", state.image);
    form_data.append("content", state.content);
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post("https://us-central1-todo-83183.cloudfunctions.net/api/user/image", form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login");
        }
        setState((prevState) => ({
          ...prevState,
          uiLoading: false,
          imageError: "Error in posting the data",
        }));
      });
  };
  const updateFormValues = (evt) => {
    evt.preventDefault();
    setState((prevState) => ({
      ...prevState,
      buttonLoading: true,
    }));
    authMiddleWare(props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };

    const formRequest = {
      firstName: state.firstName,
      lastName: state.lastName,
      country: state.country,
    };
    axios
      .post("https://us-central1-todo-83183.cloudfunctions.net/api/user", formRequest)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          buttonLoading: false
        }));
        window.location.reload();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login");
        }
        setState((prevState) => ({
          ...prevState,
          buttonLoading: false,
        }));
      });
  };

  if (state.uiLoading === true) {
    return (
      <Content>
        <Toolbar />
        {state.uiLoading && (
          <UiProgress />
        )}
      </Content>
    );
  } else {
    return (
      <Content>
        <Toolbar />
        <Root>
          <CardContent>
            <Details>
              <div>
                <LocationText
                  gutterBottom
                  variant="h4"
                >
                  {state.firstName} {state.lastName}
                </LocationText>
                <UploadButton
                  variant="outlined"
                  color="primary"
                  type="submit"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  onClick={profilePictureHandler}
                >
                  Upload Photo
                </UploadButton>
                <input type="file" onChange={handleImageChange} />

                {state.imageError ? (
                  <CustomError>
                    {" "}
                    Wrong Image Format || Supported Format are PNG and JPG
                  </CustomError>
                ) : (
                  false
                )}
              </div>
            </Details>
          </CardContent>
        </Root>

        <br />
        <Root>
          <form autoComplete="off" noValidate>
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="First name"
                    margin="dense"
                    name="firstName"
                    variant="outlined"
                    value={state.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Last name"
                    margin="dense"
                    name="lastName"
                    variant="outlined"
                    value={state.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="dense"
                    name="email"
                    variant="outlined"
                    disabled={true}
                    value={state.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    margin="dense"
                    name="phone"
                    type="number"
                    variant="outlined"
                    disabled={true}
                    value={state.phoneNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="User Name"
                    margin="dense"
                    name="userHandle"
                    disabled={true}
                    variant="outlined"
                    value={state.username}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    margin="dense"
                    name="country"
                    disabled={true}
                    variant="outlined"
                    value={state.country}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions />
          </form>
        </Root>

        <SubmitButton
          color="primary"
          variant="contained"
          type="submit"
          onClick={updateFormValues}
          disabled={
            state.buttonLoading ||
            !state.firstName ||
            !state.lastName ||
            !state.country
          }
        >
          Save details
          {state.buttonLoading && 
            <Progress size={30} />
          }
        </SubmitButton>
      </Content>
    )
  }
};

export default Account;
