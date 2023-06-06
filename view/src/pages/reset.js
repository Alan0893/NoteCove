import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styled from "@mui/system/styled";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled Components
const Paper = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));
const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));
const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));
const Progress = styled(CircularProgress)({
  position: "absolute",
});

// Reset function
const Reset = () => {
  // States of function components
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Provide navigation to redirect to pages
  const navigate = useNavigate();

  // Update email as user inputs the value
  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  // Handle when user submits the request
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Send a POST request to the reset password API endpoint with the user data
      await axios.post(
        "https://us-central1-todo-83183.cloudfunctions.net/api/reset",
        { email }
      );
      setResetSent(true); // Set the resetSent state to true
      setError("");
    } catch (err) {
      if (err.response) {
        // Set the error state with the error data from the response
        setError(err.response.data);
      } else {  // Unexpected Error
        console.error(err);
      }
    } finally {
      // Set the loading state to false regardless
      setLoading(false);
    }
  };

  //  Check if provided email is valid
  const isEmail = (email) => {
    const emailRegEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
  };

  // Navigate back to login page
  const handleBackToLogin = () => {
    navigate("/login");
  };

  //  Render the reset password page
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper>
        <StyledAvatar>
          <LockOutlinedIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {!resetSent ? (
          <Form noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={error ? true : false}
              helperText={error}
              onChange={handleChange}
            />
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !isEmail(email)}
            >
              Reset Password
              {loading && <Progress size={30} />}
            </SubmitButton>
          </Form>
        ) : (
          <>
            <Typography variant="body2" mt={2} mb={2} textAlign="center">
              Password reset email sent to {email}. Please check your email to
              proceed.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleBackToLogin}
            >
              Go Back to Login
            </Button>
          </>
        )}
        {!resetSent && (
          <Grid container>
            <Grid>
              <Link href="signup" variant="body2" style={{ display: "block" }}>
                {"Create account!"}
              </Link>
              <Link href="login" variant="body2" style={{ display: "block" }}>
                {"Back to Login"}
              </Link>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

export default Reset;
