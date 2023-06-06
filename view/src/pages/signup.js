import React, { useState } from "react";
import axios from "axios";
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
	Select,
	MenuItem,
	InputLabel,
	FormControl
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styled from "@mui/system/styled";
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
	marginTop: theme.spacing(3),
}));
const SubmitButton = styled(Button)(({ theme }) => ({
  	margin: theme.spacing(3, 0, 2),
}));
const Progress = styled(CircularProgress)({
  	position: "absolute",
});

// Array of available countries
const countries = [
	"United States",
	"Canada",
];

// Signup function
const Signup = () => {
	// States of function components
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [country, setCountry] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	// Provide navigation to redirect to pages
	const navigate = useNavigate();

	// Updating states as user updates the input
	const handleChange = (event) => {
		const { name, value } = event.target;

		if (name === "firstName") setFirstName(value);
		if (name === "lastName") setLastName(value);
		if (name === "phoneNumber") setPhoneNumber(value);
		if (name === "country") setCountry(value);
		if (name === "username") setUsername(value);
		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);
		if (name === "confirmPassword") setConfirmPassword(value);
	};

	// Handle when the user submits the data
	const handleSubmit = async (evt) => {
		// Prevent the default form submission behavior
		evt.preventDefault();
		setLoading(true);	// Setting the loading state to true
		const newUserData = {
			firstName,
			lastName,
			phoneNumber,
			country,
			username,
			email,
			password,
			confirmPassword,
		};	// Prepare the new user data for signup

		try {
			// Send a POST request to the signup API endpoint with the new user data
			const res = await axios.post(
				"https://us-central1-todo-83183.cloudfunctions.net/api/signup",
				newUserData
			);
			// Store the received authentication token
			localStorage.setItem("AuthToken", res.data.token);
			setLoading(false);	// Set loading state to false
			navigate("/");	// Navigate to the home page
		} catch (err) {
			if (err.response) {
				// Set the error state with the error data from the response
				setErrors(err.response.data);
			} else {	// Unexpected error
				console.error(err);
			}
			// Set loading state to false
			setLoading(false);
		}
  	};

	// Render the signup page
	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Paper>
				<StyledAvatar>
					<LockOutlinedIcon />
				</StyledAvatar>
				<Typography component="h1" variant="h5">
					Sign Up
				</Typography>
				<Form noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								name="firstName"
								autoComplete="firstname"
								helperText={errors.firstName}
								error={errors.firstName ? true : false}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lastName"
								helperText={errors.lastName}
								error={errors.lastName ? true : false}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="username"
								label="User Name"
								name="username"
								autoComplete="username"
								helperText={errors.username}
								error={errors.username ? true : false}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="phoneNumber"
								label="Phone Number"
								name="phoneNumber"
								autoComplete="phoneNumber"
								pattern="[7-9]{1}[0-9]{9}"
								helperText={errors.phoneNumber}
								error={errors.phoneNumber ? true : false}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								helperText={errors.email}
								error={errors.email ? true : false}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl variant="outlined" fullWidth required>
								<InputLabel id="country-label">Country</InputLabel>
								<Select
									labelId="country-label"
									id="country"
									label="Country"
									name="country"
									value={country}
									onChange={handleChange}
								>
									{countries.map((country) => (
										<MenuItem key={country} value={country}>
										{country}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="password"
								label="Password"
								type="password"
								name="password"
								autoComplete="current-password"
								helperText={errors.password}
								error={errors.password ? true : false}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								type="password"
								id="confirmPassword"
								label="Confirm Password"
								name="confirmPassword"
								autoComplete="current-password"
								helperText={errors.confirmPassword}
								error={errors.confirmPassword ? true : false}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<SubmitButton
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						disabled={
						loading ||
						!email ||
						!password ||
						!firstName ||
						!lastName ||
						!country ||
						!username ||
						!phoneNumber
						}
					>
						Sign Up
						{loading && <Progress size={30} />}
					</SubmitButton>
					<Grid container justify="flex-end">
						<Grid item>
							<Link href="login" variant="body2">
								Already have an account? Login!
							</Link>
						</Grid>
					</Grid>
				</Form>
			</Paper>
		</Container>
  	);
}

export default Signup;
