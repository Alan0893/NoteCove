const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

// Todos Functions
const {
  getAllTodos,
} = require("./APIs/todos");

// Todo API
app.get("/todos", auth, getAllTodos);

exports.api = functions.https.onRequest(app);
