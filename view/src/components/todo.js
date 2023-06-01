import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@mui/system/styled";
import {
  Typography,
  Button,
  Dialog,
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
  DialogTitle,
  DialogContent,
  Paper,
} from "@mui/material";
import { AddCircle, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";
import { useNavigate } from "react-router-dom";

const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
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
  position: "absolute",
  top: 14,
  right: 10,
});
const FloatingButton = styled(IconButton)({
  position: "fixed",
  bottom: 0,
  right: 0,
});
const Form = styled("form")(({ theme }) => ({
  width: "98%",
  marginLeft: 13,
  marginTop: theme.spacing(3),
}));
const CustomToolbar = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const RootDialog = styled(DialogTitle)({
  minWidth: 470,
});
const RootCard = styled(Card)({
  minWidth: 470,
});
const Pos = styled(Typography)({
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
const ViewRoot = styled(DialogContent)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
}));
const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Todo = (props) => {
  const [state, setState] = useState({
    todos: "",
    title: "",
    body: "",
    todoId: "",
    errors: [],
    open: false,
    uiLoading: true,
    buttonType: "",
    viewOpen: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    authMiddleWare(props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("https://us-central1-todo-83183.cloudfunctions.net/api/todos")
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          todos: response.data,
          uiLoading: false,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.history]);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const deleteTodoHandler = (data) => {
    authMiddleWare(props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let todoId = data.todo.todoId;
    axios
      .delete(`https://us-central1-todo-83183.cloudfunctions.net/api/todo/${todoId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditClickOpen = (data) => {
    setState((prevState) => ({
      ...prevState,
      title: data.todo.title,
      body: data.todo.body,
      todoId: data.todo.todoId,
      buttonType: "Edit",
      open: true,
    }));
  };
  const handleViewOpen = (data) => {
    setState((prevState) => ({
      ...prevState,
      title: data.todo.title,
      body: data.todo.body,
      viewOpen: true,
    }));
  };

  const CustomDialogTitle = (props) => {
    const { children, onClose } = props;
    return (
      <RootDialog disableTypography>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <CloseButton
            aria-label="close"
            onClick={onClose}
          >
            <Close />
          </CloseButton>
        ) : null}
      </RootDialog>
    );
  };

  const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2)
  }))

  dayjs.extend(relativeTime);
  const { open, errors, viewOpen } = state;

  const handleClickOpen = () => {
    setState((prevState) => ({
      ...prevState,
      todoId: "",
      title: "",
      body: "",
      buttonType: "",
      open: true,
    }));
  };
  const handleSubmit = (event) => {
    authMiddleWare(props.history);
    event.preventDefault();
    const userTodo = {
      title: state.title,
      body: state.body,
    };
    let options = {};
    if (state.buttonType === "Edit") {
      options = {
        url: `https://us-central1-todo-83183.cloudfunctions.net/api/todo/${state.todoId}`,
        method: "put",
        data: userTodo,
      };
    } else {
      options = {
        url: "https://us-central1-todo-83183.cloudfunctions.net/api/todo",
        method: "post",
        data: userTodo,
      };
    }
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios(options)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          open: false,
        }));
        window.location.reload();
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          open: true,
          errors: error.response.data,
        }));
      });
  };
  const handleViewClose = () => {
    setState((prevState) => ({
      ...prevState,
      viewOpen: false,
    }));
  };
  const handleClose = (evemt) => {
    setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  if (state.uiLoading) {
    return (
      <Content>
        <CustomToolbar>
          {state.uiLoading && <UiProgress size={150} />}
        </CustomToolbar>
      </Content>
    );
  } else {
    return (
      <Content>
        <CustomToolbar />
        <FloatingButton
          color="primary"
          aria-label="Add Todo"
          onClick={handleClickOpen}
        >
          <AddCircle style={{ fontSize: 60 }} />
        </FloatingButton>
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
                {state.buttonType === "Edit" ? "Edit Todo" : "Create new Todo"}
              </Title>
              <SubmitButton 
                autoFocus 
                color="inherit" 
                onClick={handleSubmit}
              >
                {state.buttonType === "Edit" ? "Save" : "Submit"}
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
                  id="todoTitle"
                  label="Todo Title"
                  name="title"
                  autoComplete="todoTitle"
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
                  id="todoDetails"
                  label="Todo Details"
                  name="body"
                  autoComplete="todoDetails"
                  multiline
                  rows={25}
                  rowsmax={25}
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
          {state.todos.map((todo) => (
            <Grid item xs={12} sm={6} key={todo.todoId}>
              <RootCard variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {todo.title}
                  </Typography>
                  <Pos color="textSecondary">
                    {dayjs(todo.createdAt).fromNow()}
                  </Pos>
                  <Typography variant="body2" component="p">
                    {`${todo.body.substring(0, 65)}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewOpen({ todo })}
                  >
                    {" "}
                    View{" "}
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditClickOpen({ todo })}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => deleteTodoHandler({ todo })}
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
            <TextField
              fullWidth
              id="todoDetails"
              name="body"
              multiline
              readOnly
              rows={10}
              rowsmax={25}
              value={state.body}
              InputProps={{
                disableunderline: true,
              }}
            />
          </CustomDialogContent>
        </Dialog>
      </Content>
    );
  }
}

export default Todo;