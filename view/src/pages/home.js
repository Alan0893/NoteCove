import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
	Drawer,
	AppBar as MuiAppBar,
	CssBaseline,
	Toolbar,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
	Avatar,
	CircularProgress,
	IconButton
} from "@mui/material";
import { 
	AccountBox, 
	Notes, 
	ExitToApp,
	Menu,
	ChevronLeft,
	ChevronRight
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Account from "../components/account";
import Todo from "../components/todo";
import { authMiddleWare } from "../util/auth";
import config from "../util/config";

const drawerWidth = 200;

// Styled Components
const Root = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({
	theme, open
}) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	marginLeft: `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: 0
	})
}));
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));
const DrawerHeader = styled('div')(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: 'flex-end'
}));
const CustomAvatar = styled(Avatar)({
	height: 110,
	width: 110,
	flexShrink: 0,
	flexGrow: 0,
	marginTop: 20
});
const ToolbarSpacing = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const UiProgress = styled(CircularProgress)(({
  position: "fixed",
  zIndex: "1000",
  height: "31px",
  width: "31px",
  left: "45%",
  top: "35%",
}));

const Home = (props) => {
  // Response Drawer function components
	const theme = useTheme();
	const [open, setOpen] = useState(false);
  // Function to handle opening the drawer
	const handleDrawerOpen = () => {
		setOpen(true);
	};
  // Function to handle closing the drawer
	const handleDrawerClose = () => {
		setOpen(false);
	};

  // Hovering over <ListItemButton> Components function components
  const [accountHover, setAccountHover] = useState(false);
  const [todoHover, setTodoHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

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

	if (state.uiLoading) {
		return (
			<Root>
				<UiProgress size={150} />
			</Root>
		);
	} else {
		return (
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar position="fixed" open={open}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							sx={{ mr: 2, ...(open && { display: "none" }) }}
						>
							<Menu />
						</IconButton>
						<Typography 
							variant="h6"  
							component="div"
              				noWrap
						>
							TaskEase
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box'
						}
					}}
					variant="persistent"
					anchor="left"
					open={open}
				>
					<DrawerHeader>
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
						</IconButton>
					</DrawerHeader>
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
						<ListItem disablePadding>
							<ListItemButton onClick={loadTodoPage}
								sx={{
								backgroundColor: todoHover ? "#f0f0f0" : "transparent",
								"&:hover": {
									backgroundColor: "#f0f0f0",
								},
								}}
								onMouseEnter={() => setTodoHover(true)}
								onMouseLeave={() => setTodoHover(false)}
              				>
								<ListItemIcon>
									<Notes />
								</ListItemIcon>
								<ListItemText primary="Tasks" />
							</ListItemButton>
						</ListItem>

						<ListItem disablePadding>
							<ListItemButton onClick={loadAccountPage}
								sx={{
								backgroundColor: accountHover ? "#f0f0f0" : "transparent",
								"&:hover": {
									backgroundColor: "#f0f0f0",
								},
								}}
								onMouseEnter={() => setAccountHover(true)}
								onMouseLeave={() => setAccountHover(false)}
							>
								<ListItemIcon>
									<AccountBox />
								</ListItemIcon>
								<ListItemText primary="Account" />
							</ListItemButton>
						</ListItem>

						<ListItem disablePadding>
							<ListItemButton onClick={logoutHandler}
								sx={{
								backgroundColor: logoutHover ? "#f0f0f0" : "transparent",
								"&:hover": {
									backgroundColor: "#f0f0f0",
								},
								}}
								onMouseEnter={() => setLogoutHover(true)}
								onMouseLeave={() => setLogoutHover(false)}
							>
								<ListItemIcon>
									<ExitToApp />
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</ListItem>
					</List>
				</Drawer>
				<Root open={open}>
					<ToolbarSpacing />
					<div>{state.render ? <Account /> : <Todo />}</div>
				</Root>
			</Box>
		)
	}
}

export default Home;