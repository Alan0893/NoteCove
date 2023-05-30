const { db } = require("../util/admin");

exports.getAllTodos = async (request, response) => {
  try {
    const snapshot = await db
      .collection("todos")
      .where("username", "==", request.user.username)
      .orderBy("createdAt", "desc")
      .get();

    let todos = [];
    snapshot.forEach((doc) => {
      todos.push({
        todoId: doc.id,
        title: doc.data().title,
        username: doc.data().username,
        body: doc.data().body,
        createdAt:  doc.data().createdAt
      });
    });

    return response.json(todos);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.code });
  }
};

exports.getOneTodo = async (request, response) => {
  try {
    const doc = await db.doc(`/todos/${request.params.todoId}`).get();

    if (!doc.exists) {
      return response.status(404).json({ error: "Todo not found" });
    }
 
    if (doc.data().username !== request.user.username) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const todoData = doc.data();
    todoData.todoId = doc.id;

    return response.json(todoData);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.code });
  }
};

exports.postOneTodo = async (request, response) => {
  try {
    if (request.body.body.trim() === "") {
      return response.status(400).json({ body: "Must not be empty" });
    }

    if (request.body.title.trim() === "") {
      return response.status(400).json({ title: "Must not be empty" });
    }

    const newTodoItem = {
      title: request.body.title,
      username: request.user.username,
      body: request.body.body,
      createdAt: new Date().toISOString()
    };

    const doc = await db.collection("todos").add(newTodoItem);

    const responseTodoItem = newTodoItem;
    responseTodoItem.todoId = doc.id

    return response.json(responseTodoItem);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Something went wrong" });
  }
};

exports.deleteTodo = async (request, response) => {
  try {
    const document = db.doc(`/todos/${request.params.todoId}`);
    const doc = await document.get();

    if (!doc.exists) {
      return response.status(404).json({ error: "Todo not found" });
    }

    if(doc.data().username !== request.user.username) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    await document.delete();

    return response.json({ message: "Delete successful" });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.code })
  }
};

exports.editTodo = async (request, response) => {
  try { 
    if (request.body.todoId || request.body.createdAt) {
      return response.status(403).json({ message: "Not allowed to edit" });
    }

    const doc = db.collection("todos").doc(`${request.params.todoId}`);
    await doc.update(request.body);

    return response.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);

    if(err.code === 5) {
      return response.status(404).json({ message: "Not found" });
    }
    return response.status(500).json({ error: err.code });
  }
};
