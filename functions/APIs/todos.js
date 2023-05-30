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