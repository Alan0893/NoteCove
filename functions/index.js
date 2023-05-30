const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

// Todos Functions
const {
  getAllTodos,
  getOneTodo,
  postOneTodo,
  deleteTodo,
  editTodo
} = require("./APIs/todos");

// Todo API
app.get("/todos", auth, getAllTodos);
app.get("/todo/:todoId", auth, getOneTodo);
app.post("/todo", auth, postOneTodo);
app.delete("/todo:todoId", auth, deleteTodo);
app.put("/todo:todoId", auth, editTodo);

exports.api = functions.https.onRequest(app);
