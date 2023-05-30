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