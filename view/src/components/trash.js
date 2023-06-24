import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@mui/system/styled";
import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  TextField,
  Grid,
  Card,
  CardActions,
  CircularProgress,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { 
  Close,  
  Star,
  StarBorder
} from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";
import config from "../util/config";

// Styled Components
const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
}));
const Appbar = styled(AppBar)({
  position: "relative",
});
const Title = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flex: 1,
}));
const SubmitButton = styled(Button)({
  display: "block",
  color: "white",
  textAlign: "center",
  position: "fixed",
  top: 14,
  right: 30,
});
const Form = styled("form")(({ theme }) => ({
  width: "95%",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: theme.spacing(3),
}));
const CustomToolbar = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const RootDialog = styled(DialogTitle)({
  minWidth: 470,
  textAlign: "center"
});
const RootCard = styled(Card)({
  minWidth: 470,
});
const Created = styled(Typography)({
  marginBottom: 12,
});
const UiProgress = styled(CircularProgress)({
  position: "fixed",
  zIndex: "1000",
  height: "31px",
  width: "31px",
  left: "50%",
  top: "35%",
});

// Creating a transition for props to slide up
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Trash function
const Trash = (props) => {
  // States of function components
  const [state, setState] = useState({
    notes: "",
    title: "",
    body: "",
    noteId: "",
    errors: [],
    open: false,
    uiLoading: true,
    buttonType: "",
    viewOpen: false,
    col: window.innerWidth >= 1035 ? 6 : 12
  });

  // After render
  useEffect(() => {
    authMiddleWare(props.history);  // Middleware to check if the user is authenticated
    const authToken = localStorage.getItem("AuthToken");  // Retrieve the authentication token from local storage
    axios.defaults.headers.common = { Authorization: `${authToken}` };  // Set the authorization header for the axios request
    axios
      .get(`${config.API_URL}/notes`) // Make a GET request
      .then((response) => {
        // Filter notes to include only those with the "starred" folder
        const starredNotes = response.data.filter((note) =>
          note.folders.includes("trash")
        );

        // Handle successful response
        setState((prevState) => ({
          ...prevState,
          notes: starredNotes,
          uiLoading: false,
        }));  // Set uiLoading to false once the data is loaded
      })
      .catch((error) => {
        console.log(error);
      });

      // Add event listener for screen resize
      window.addEventListener("resize", handleScreenResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleScreenResize);
      }
  }, [props.history]);

  // Handler to handle screen resize
  const handleScreenResize = () => {
    // Get screen width
    const screenWidth = window.innerWidth;

    // Update the number of notes per row based on screen width
    if (screenWidth >= 1035) {
      setState((prevState) => ({
        ...prevState,
        col: 6
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        col: 12
      }))
    }
  }

  // Update value of states
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  // Handler to move note item to trash
  const deleteNoteHandler = (data) => {
    authMiddleWare(props.history);  // Validate authentication middleware
    const authToken = localStorage.getItem("AuthToken");  // Get the authentication token from local storage
    axios.defaults.headers.common = { Authorization: `${authToken}` }; // Set the authentication token in the request header
    let noteId = data.note.noteId;
    axios
      // Deleting the note item from the database collection
      .delete(`${config.API_URL}/note/${noteId}`)
      .then(() => {
        // Fetch updated notes from the server
        axios.get(`${config.API_URL}/notes`)
        .then((response) => {
          const trashNotes = response.data.filter((note) =>
            note.folders.includes("trash")
          );

          setState((prevState) => ({
            ...prevState,
            notes: trashNotes
          }));
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Handler to restore the note
  const handleRestore = (data) => {
    authMiddleWare(props.history);  // Validate authentication middleware
    const authToken = localStorage.getItem("AuthToken");  // Get the authentication token from local storage
    axios.defaults.headers.common = { Authorization: `${authToken}` }; // Set the authentication token in the request header
    let noteId = data.note.noteId;
    // Check if the user has starred the note
    if (data.note.folders.includes("starred")) { // Already starred
      // Call the 'editNote' API endpoint to remove starred from the folders array
      axios
        .put(`${config.API_URL}/note/${noteId}`, { folders: ["default", "starred"] })
        .then(() => {
          // Update the state to reflect the changes
          setState((prevState) => {
            const updatedNotes = prevState.notes.filter(
              (note) => note.noteId !== noteId
            );

            return {
              ...prevState,
              notes: updatedNotes,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {  // Not starred
      // Call the 'editNote' API endpoint with the 'folders' field set to 'starred'
      axios
        .put(`${config.API_URL}/note/${noteId}`, { folders: ["default"] })
        .then(() => {
          // Update the state to reflect the changes
          setState((prevState) => {
            const updatedNotes = prevState.notes.filter(
              (note) => note.noteId !== noteId
            );

            return {
              ...prevState,
              notes: updatedNotes,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // Handle when user views the note item
  const handleViewOpen = (data) => {
    setState((prevState) => ({
      ...prevState,
      title: data.note.title,
      body: data.note.body,
      viewOpen: true,
    }));
  };

  // Creating a custom dialog for the note item popup
  const CustomDialogTitle = (props) => {
    const { children } = props;
    return (
      <RootDialog disabletypography="true">
        <div>
          <Typography variant="h6">{children}</Typography>
        </div>
      </RootDialog>
    );
  };

  // Styling the dialog popup
  const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2)
  }))

  // Getting the relative time from creation
  dayjs.extend(relativeTime);

  // Getting the states
  const { open, errors, viewOpen } = state;

  // Handler for when user submits the note edit/creation
  const handleSubmit = (event) => {
    authMiddleWare(props.history);  // Validate authentication middleware
    event.preventDefault(); // Prevent default form submission behavior

    // Prepare the new user note item 
    const userNote = {
      title: state.title,
      body: state.body,
    };
    let options = {
      url: `${config.API_URL}/note/${state.noteId}`,
      method: "put",
      data: userNote,
    };

    const authToken = localStorage.getItem("AuthToken");  // Getting the authentication token from local storage
    axios.defaults.headers.common = { Authorization: `${authToken}` };  // Set the authorization header for axios request
    axios(options)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          open: false,
        }));
        // Fetch updated notes from the server
        axios.get(`${config.API_URL}/notes`)
          .then((response) => {

            const starredNotes = response.data.filter((note) =>
              note.folders.includes("starred")
            );

            // Handle successful response
            setState((prevState) => ({
              ...prevState,
              notes: starredNotes,
            }));
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          open: true,
          errors: error.response.data,
        }));
      });
  };
  // Handler for closing the view
  const handleViewClose = () => {
    setState((prevState) => ({
      ...prevState,
      viewOpen: false,
    }));
  };
  // Handler for closing the form
  const handleClose = (event) => {
    setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  // Calculate the number of lines 
  const calculateNumOfLines = (text) => {
    const dummyElement = document.createElement("div");
    dummyElement.innerHTML = text;
    dummyElement.style.position = "fixed";
    dummyElement.style.visibility = "hidden";
    dummyElement.style.height = "auto";
    dummyElement.style.width = "300px"; // Set an appropriate width

    document.body.appendChild(dummyElement);
    const lineCount = Math.ceil(dummyElement.clientHeight / parseFloat(getComputedStyle(dummyElement).lineHeight));
    document.body.removeChild(dummyElement);

    return lineCount;
  }
  const numLines = calculateNumOfLines(state.body)

  if (state.uiLoading) {  // The UI is still loading
    // Show the loading spinner while the UI is loading
    return (
      <Content>
        <CustomToolbar>
          {state.uiLoading && <UiProgress size={150} />}
        </CustomToolbar>
      </Content>
    );
  } else {  // Render the component on the page once the UI is loaded
    return (
      <Content>
        <CustomToolbar />
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom
          style={{
            marginTop: '-50px'
          }}
        >
          Trash
        </Typography>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <Appbar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Title variant="h6">
                {"Edit Note"}
              </Title>
              <SubmitButton 
                autoFocus 
                color="inherit" 
                onClick={handleSubmit}
              >
                {"Save"}
              </SubmitButton>
            </Toolbar>
          </Appbar>

          <Form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="noteTitle"
                  label="Note"
                  name="title"
                  autoComplete="noteTitle"
                  helperText={errors.title}
                  value={state.title}
                  error={errors.title ? true : false}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="noteDetails"
                  label="Note Details"
                  name="body"
                  autoComplete="noteDetails"
                  multiline
                  rows={numLines}
                  rowsmax={numLines}
                  helperText={errors.body}
                  error={errors.body ? true : false}
                  onChange={handleChange}
                  value={state.body}
                />
              </Grid>
            </Grid>
          </Form>
        </Dialog>

        <Grid container spacing={2}>
          {state.notes.map((note) => (
            <Grid item xs={12} sm={state.col} key={note.noteId}>
              <RootCard variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {note.title}
                  </Typography>
                  <Created color="textSecondary">
                    {dayjs(note.createdAt).fromNow()}
                  </Created>
                  <Typography variant="body2" component="p">
                  {note.body.length > 63 ? `${note.body.substring(0, 63)}...` : note.body}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                  >
                    {note.folders.includes("starred")
                      ? <Star style={{ color: '#fbbc05' }} /> 
                      : <StarBorder style={{ color: 'grey' }} />
                    }
                  </IconButton>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewOpen({ note })}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    color="success"
                    onClick={() => handleRestore({ note })}
                  >
                    Restore
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteNoteHandler({ note })}
                  >
                    Delete
                  </Button>
                </CardActions>
              </RootCard>
            </Grid>
          ))}
        </Grid>

        <Dialog
          onClose={handleViewClose}
          aria-labelledby="customized-dialog-title"
          open={viewOpen}
          fullWidth
          classes={{ paperFullWidth: { maxWidth: "100%" } }}
        >
          <CustomDialogTitle id="customized-dialog-title" onClose={handleViewClose}>
            {state.title}
          </CustomDialogTitle>
          <CustomDialogContent dividers>
            <Typography component="div">
            {state.body.split('\n').map((paragraph, index) => (
              <div key={index}>{paragraph}<br /></div>
            ))}
            </Typography>
          </CustomDialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleViewClose}>
              Exit
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
    );
  }
}

export default Trash;