const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

// Todos Functions
const {
  getAllTodos,
  getOneTodo
} = require("./APIs/todos");

// Todo API
app.get("/todos", auth, getAllTodos);
app.get("/todo/:todoId", auth, getOneTodo);

exports.api = functions.https.onRequest(app);
