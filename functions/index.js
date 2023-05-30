const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

// Todos Functions
const {
  getAllTodos,
  getOneTodo,
  postOneTodo,
  deleteTodo,
  editTodo,
} = require("./APIs/todos");

// User Functions
const {
  loginUser,
  signUpUser
} = require("./APIs/users");

// Todo API
app.get("/todos", auth, getAllTodos);
app.get("/todo/:todoId", auth, getOneTodo);
app.post("/todo", auth, postOneTodo);
app.delete("/todo/:todoId", auth, deleteTodo);
app.put("/todo/:todoId", auth, editTodo);

// User API
app.post("/login", loginUser);
app.post("signup", signUpUser);

exports.api = functions.https.onRequest(app);
