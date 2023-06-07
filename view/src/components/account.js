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
import config from "../util/config";

// Styled Components
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

// Account functionn
const Account = (props) => {
  // States of function components
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

  // Provide navigation to redirect to pages
  const navigate = useNavigate();

  // After render
  useEffect(() => {
    authMiddleWare(props.history); // Middleware to check if the user is authenticated
    const authToken = localStorage.getItem("AuthToken");  // Retrieve the authentication token from local storage
    axios.defaults.headers.common = { Authorization: `${authToken}` }; // Set the authorization header for the axios request
    axios
      .get(`${config.API_URL}/user`)  // Make a GET request
      .then((response) => {
        // Handle successful response
        setState((prevState) => ({
          ...prevState,
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username,
          email: response.data.userCredentials.email,
          uiLoading: false  // Set uiLoading to false once the data is loaded
        }));
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login"); // If the user is not authenticated, navigate to login page
        }
        //Set the errorMessage state
        setState((prevState) => ({
          ...prevState,
          errorMsg: "Error in retrieving the data"
        }));
      });
  }, [props.history, navigate]);

  // Update value of states
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  // Update state of image
  const handleImageChange = (event) => {
    setState({
      ...state,
      image: event.target.files[0],
    });
  };
  // Handler function for updating profile picture
  const profilePictureHandler = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setState((prevState) => ({
      ...prevState,
      uiLoading: true,
    }));  // Set the loading state to true
    authMiddleWare(props.history);  // Validate authentication middleware
    const authToken = localStorage.getItem("AuthToken");  // Get the authentication token from local storage

    // Create a new form data object and append the image and content data
    let form_data = new FormData();
    form_data.append("image", state.image);
    form_data.append("content", state.content);

    // Set the authentication token in the request header
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post(`${config.API_URL}/user/image`, form_data, {
        headers: {
          "content-type": "multipart/form-data",  // Sending files
        },
      })
      .then(() => {
        //  Reload the page after successfully updating the profile picture
        window.location.reload();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login"); // Redirect to the login page if the authentication fails
        }
        //  Set the error message if there is an error in posting the data
        setState((prevState) => ({
          ...prevState,
          uiLoading: false,
          imageError: "Error in posting the data",
        }));
      });
  };
  // Handler function for updating form values
  const updateFormValues = (evt) => {
    evt.preventDefault(); // Prevent default form submission behavior
    setState((prevState) => ({
      ...prevState,
      buttonLoading: true,  // Set the loading state to true
    }));
    authMiddleWare(props.history);  // Validate authentication middleware
    const authToken = localStorage.getItem("AuthToken");  // Get the authentication token from local storage

    // Set the authentication token in the request header
    axios.defaults.headers.common = { Authorization: `${authToken}` };

    const formRequest = {
      firstName: state.firstName,
      lastName: state.lastName,
      country: state.country,
    };
    axios
      .post(`${config.API_URL}/user`, formRequest)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          buttonLoading: false
        }));  // Set button loading state to false
        window.location.reload(); // Reload the page after successfully updating the form values
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login"); // Redirect to the login page if the authentication failed
        }
        setState((prevState) => ({
          ...prevState,
          buttonLoading: false,
        }));  // Set button loading state to false
      });
  };

  if (state.uiLoading) {  // The UI is still loading
    // Show the loading spinner while the UI is loading
    return ( 
      <Content>
        <Toolbar />
        {state.uiLoading && (
          <UiProgress />
        )}
      </Content>
    );
  } else {  // Render the component on the page once the UI is loaded 
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
