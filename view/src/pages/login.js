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
	CircularProgress
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styled from "@mui/system/styled";

import axios from "axios";
import { useNavigate } from "react-router-dom";

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
const CustomError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.8rem",
  marginTop: 10,
}));
const Progress = styled(CircularProgress)({
  position: "absolute",
});

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	
	const history = useNavigate();

	const handleChange = (evt) => {
		const { name, value } = evt.target;
		if(name === "email") setEmail(value)
		if(name === "password") setPassword(value);
	};
	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setLoading(true);
		const userData = { email, password };

		try {
			const res = await axios.post("https://us-central1-todo-83183.cloudfunctions.net/api/login", userData);
			localStorage.setItem("AuthToken", `Bearer ${res.data.token}`);
			setLoading(false);
			history("/");
		} catch (err) {
			if (err.response) {
				setErrors(err.response.data);
			} else {
				console.error(err);
			}
			setLoading(false);
		}
	};

	const isEmail = (email) => {
		const emailRegEx =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (email.match(emailRegEx)) return true;
		else return false;
	}; 
	const validPassword = (password) => {
		if (password.length < 8) return false;
		else return true;
	}
	
	return (
		<Container component="main" maxWidth="xs">
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
						<Grid item>
							<Link href="signup" variant="body2">
								{"Don't have an account? Sign Up!"}
							</Link>
						</Grid>
					</Grid>
					{errors.general && (
						<CustomError variant="body2">{errors.general}</CustomError>
					)}
				</Form>
			</Paper>
		</Container>
	)
}

export default Login;