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
	Box
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styled from "@mui/system/styled";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../util/config";

// Styled Components
const Paper = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(0),
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
const CustomError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.8rem",
  marginTop: 10,
}));
const Progress = styled(CircularProgress)({
  position: "absolute",
});

// Login function
const Login = () => {
	// States of function components
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	
	// Provide navigation to redirect to pages
	const navigate = useNavigate();

	// Update value as user is inputting value
	const handleChange = (event) => {
		const { name, value } = event.target;
		if(name === "email") setEmail(value)
		if(name === "password") setPassword(value);
	};
	// Handle when user submits request
	const handleSubmit = async (event) => {
		event.preventDefault();	// Prevent the default form submission behavior
		setLoading(true);	// Set loading state to true

		const userData = { email, password };	// Prepare the user data for login

		try {
			// Send a POST request to the login API endpoint with the user data
			const res = await axios.post(`${config.API_URL}/login`, userData);
			// Store the received authentication token in local storage
			localStorage.setItem("AuthToken", `Bearer ${res.data.token}`);
			setLoading(false);	// Set loading state to false
			navigate("/");	// Redirect to the home page
		} catch (err) {
			if (err.response) {
				// Set the error state with the error data from the response
				setErrors(err.response.data);
			} else {	// Unexpected Error
				console.error(err);
			}
			// Set loading state to false
			setLoading(false);
		}
	};

	// Check if the inputted email is valid
	const isEmail = (email) => {
		const emailRegEx =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (email.match(emailRegEx)) return true;
		else return false;
	}; 
	// Check if the inputted password is valid
	const validPassword = (password) => {
		if (password.length < 6) return false;
		else return true;
	}
	
	// Render the login page
	return (
		<Container 
			component="main" 
			maxWidth="xs"
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh"
			}}
		>
			<Box
				sx={{
					boxShadow: 4,
					borderRadius: 2,
					px: 4,
					py: 6,
					marginTop: 4,
					marginBottom: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<CssBaseline />
				<Paper>
					<StyledAvatar>
						<LockOutlinedIcon />
					</StyledAvatar>
					<Typography component="h1" variant="h5">
						Login
					</Typography>
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
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={handleChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={errors.password}
							error={errors.password ? true : false}
							onChange={handleChange}
						/>
						<SubmitButton 
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							onClick={handleSubmit}
							disabled={loading || !isEmail(email) || !validPassword(password)}
						>
							Sign In
							{loading && <Progress size={30} />}
						</SubmitButton>
						<Grid container>
							<Grid>
								<Link href="signup" variant="body2" style={{ display: 'block' }}>
									{"Create account!"}
								</Link>
								<Link href="reset" variant="body2" style={{ display: 'block' }}>
									{"Forgot password?"}
								</Link>
							</Grid>
						</Grid>
						{errors.general && (
							<CustomError variant="body2">{errors.general}</CustomError>
						)}
					</Form>
				</Paper>
			</Box>
		</Container>
	)
}

export default Login;