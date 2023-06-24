import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Drawer,
	AppBar as MuiAppBar,
	CssBaseline,
	Toolbar,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
	Avatar,
	CircularProgress,
	IconButton,
} from "@mui/material";
import { 
	AccountCircle,
	Star,
	Delete,
	LibraryBooks, 
	ExitToApp,
	Menu,
	ChevronLeft,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Account from "../components/account";
import Note from "../components/note";
import Starred from "../components/starred";
import Trash from "../components/trash";
import { authMiddleWare } from "../util/auth";
import config from "../util/config";

const drawerWidth = 200;

// Styled Components
const Root = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({
	theme, open
}) => ({
	flexGrow: 1,
	padding: theme.spacing(2.5),
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
const CustomAvatar = styled(Avatar)(( { theme }) => ({
	height: 110,
	width: 110,
	flexShrink: 0,
	flexGrow: 0,
	marginTop: 0,
	border: `2px solid ${theme.palette.primary.main}`
}));
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
	const [open, setOpen] = useState(false);

  	// Function to handle opening/closing the drawer
	const toggleDrawer = (open) => (event) => {
	if (
		event &&
		event.type === 'keydown' &&
		(event.key === 'Tab' || event.key === 'Shift')
	) {
		return;
	}
		setOpen(open);
	};

	// States of function components
  	const [state, setState] = useState({
		firstName: "",
		lastName: "",
		profilePicture: "",
		uiLoading: true,
		imageLoading: false,
		render: "notes",
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

	// Setting the render states
	const loadAccountPage = () => {
		setState((prevState) => ({ ...prevState, render: "account" }));
	};
	const loadNotePage = () => {
		setState((prevState) => ({ ...prevState, render: "notes" }));
	};
	const loadStarredPage = () => {
		setState((prevState) => ({ ...prevState, render: "starred" }));
	};
	const loadTrashPage = () => {
		setState((prevState) => ({ ...prevState, render: "trash" }));
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
							onClick={toggleDrawer(true)}
							edge="start"
							sx={{ mr: 2, ...(open && { display: "none" }) }}
						>
							<Menu />
						</IconButton>
						<Typography 
							variant="h6"  
							component="div"
              				noWrap
							sx={{
								textAlign: "center",
								flexGrow: 1
							}}
						>
							NoteCove
						</Typography>
						<IconButton
							color="inherit"
							aria-label="account"
							onClick={loadAccountPage}
							sx={{ ml: "auto" }}
						>
							<AccountCircle />
						</IconButton>
						<IconButton
							color="inherit"
							aria-label="logout"
							onClick={logoutHandler}
							sx={{ ml: "auto" }}
						>
							<ExitToApp />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Drawer
					anchor="left"
					open={open}
					onClose={toggleDrawer(false)}
					onOpen={toggleDrawer(true)}
					sx={{
						width: drawerWidth,
					}}
					variant="persistent"
				>
					<Box
						sx={{
							width: drawerWidth
						}}
						role="presentation"
						onClick={toggleDrawer(false)}
						onKeyDown={toggleDrawer(false)}
					>
						<DrawerHeader>
							<IconButton onClick={toggleDrawer(false)}>
								<ChevronLeft/>
							</IconButton>
						</DrawerHeader>
						<center>
							<CustomAvatar 
								src={state.profilePicture} 

							/>
							<p>
								{" "}
								{state.firstName} {state.lastName}
							</p>
						</center>
						<Divider />
						<List>
							<ListItemButton onClick={loadNotePage}>
								<ListItemIcon>
									<LibraryBooks />
								</ListItemIcon>
								<ListItemText primary="All Notes" />
							</ListItemButton>

							<ListItemButton onClick={loadStarredPage}>
								<ListItemIcon>
									<Star />
								</ListItemIcon>
								<ListItemText primary="Starred" />
							</ListItemButton>
							
							<ListItemButton onClick={loadTrashPage}>
								<ListItemIcon>
									<Delete />
								</ListItemIcon>
								<ListItemText primary="Trash" />
							</ListItemButton>
						</List>
					</Box>
				</Drawer>
				<Root open={open}>
					<ToolbarSpacing />
					<div>{
						state.render === "account" ? <Account /> :
						state.render === "notes" ? <Note /> :
						state.render === "starred" ? <Starred /> :
						state.render === "trash" ? <Trash /> :
						null
					}</div>
				</Root>
			</Box>
		)
	}
}

export default Home;