const { db } = require("../util/admin");

// Get all todos belonging to a specific user
exports.getAllTodos = async (request, response) => {
  try {
    // Retrieve all todos from the 'todos' collection 
    // where the username matches the user making the request
    const snapshot = await db
      .collection("todos")
      .where("username", "==", request.user.username)
      .orderBy("createdAt", "desc")
      .get();

    let todos = [];
    // Iterate through each document in the snapshot collection
    snapshot.forEach((doc) => {
      // Extract relevant data from the document and add it to the 'todos' array
      todos.push({
        todoId: doc.id,
        title: doc.data().title,
        username: doc.data().username,
        body: doc.data().body,
        createdAt:  doc.data().createdAt
      });
    });

    // Return the 'todos' array as a JSON response
    return response.json(todos);
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    return response.status(500).json({ error: err.code });
  }
};

// Get a single todo by its ID
exports.getOneTodo = async (request, response) => {
  try {
    // Retrieve the document from the 'todos' collection based on the provided todoID
    const doc = await db.doc(`/todos/${request.params.todoId}`).get();

    // Check if the document exists
    if (!doc.exists) {
      return response.status(404).json({ error: "Todo not found" });
    }
    // Check if the username of the document matches 
    // the username of the user making the request
    if (doc.data().username !== request.user.username) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    // Extract the todo data from the document and add the todoId field
    const todoData = doc.data();
    todoData.todoId = doc.id;

    // Return the todo data as a JSON response
    return response.json(todoData);
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    return response.status(500).json({ error: err.code });
  }
};

// Creates a new todo
exports.postOneTodo = async (request, response) => {
  try {
    // Check if the request body's 'body' field is empty
    if (request.body.body.trim() === "") {
      return response.status(400).json({ body: "Must not be empty" });
    }
    // Check if the request body's 'title' field is empty
    if (request.body.title.trim() === "") {
      return response.status(400).json({ title: "Must not be empty" });
    } 

    // Create a new todo item object with the provided fields
    const newTodoItem = {
      title: request.body.title,
      username: request.user.username,
      body: request.body.body,
      createdAt: new Date().toISOString()
    };

    // Add the new todo item to the 'todos' collection and retrieve the document reference
    const doc = await db.collection("todos").add(newTodoItem);

    // Add the todoId field to the new todo item object
    const responseTodoItem = newTodoItem;
    responseTodoItem.todoId = doc.id

    // Return the new todo item as a JSON response
    return response.json(responseTodoItem);
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    response.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a todo by its ID
exports.deleteTodo = async (request, response) => {
  try {
    //  Get the document reference for the provided todoId
    const document = db.doc(`/todos/${request.params.todoId}`);
    const doc = await document.get();

    // Check if the document exists
    if (!doc.exists) {
      return response.status(404).json({ error: "Todo not found" });
    }
    // Check if the username of the document matches 
    // the username of the user making the request
    if(doc.data().username !== request.user.username) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    // Delete the document
    await document.delete();

    // Return a success message as a JSON response
    return response.json({ message: "Delete successful" });
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    return response.status(500).json({ error: err.code })
  }
};

// Edit a todo by its ID
exports.editTodo = async (request, response) => {
  try { 
    // Check if the request body contains 'todoId' or 'createdAt' fields
    if (request.body.todoId || request.body.createdAt) {
      return response.status(403).json({ message: "Not allowed to edit" });
    }

    // Get the document reference for the provided todoId
    const doc = db.collection("todos").doc(`${request.params.todoId}`);
    // Update the document with the field provided in the request body
    await doc.update(request.body);

    // Return a success message as a JSON response
    return response.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);

    // Check if the error code indicates a document not found error
    if(err.code === 5) {
      return response.status(404).json({ message: "Not found" });
    }
    // Return an error response if an error occurs during the process
    return response.status(500).json({ error: err.code });
  }
};
