const { db } = require("../util/admin");

// Get all notes belonging to a specific user
exports.getAllNotes = async (request, response) => {
  try {
    // Retrieve all notes from the 'notes' collection 
    // where the username matches the user making the request
    const snapshot = await db
      .collection("notes")
      .where("username", "==", request.user.username)
      .orderBy("createdAt", "desc")
      .get();

    let notes = [];
    // Iterate through each document in the snapshot collection
    snapshot.forEach((doc) => {
      // Extract relevant data from the document and add it to the 'notes' array
      notes.push({
        noteId: doc.id,
        title: doc.data().title,
        username: doc.data().username,
        body: doc.data().body,
        createdAt:  doc.data().createdAt,
        folders: doc.data().folders
      });
    });

    // Return the 'notes' array as a JSON response
    return response.json(notes);
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    return response.status(500).json({ error: err.code });
  }
};

// Get a single note by its ID
exports.getOneNote = async (request, response) => {
  try {
    // Retrieve the document from the 'notes' collection based on the provided noteID
    const doc = await db.doc(`/notes/${request.params.noteId}`).get();

    // Check if the document exists
    if (!doc.exists) {
      return response.status(404).json({ error: "Note not found" });
    }
    // Check if the username of the document matches 
    // the username of the user making the request
    if (doc.data().username !== request.user.username) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    // Extract the note data from the document and add the noteId field
    const noteData = doc.data();
    noteData.noteId = doc.id;

    // Return the note data as a JSON response
    return response.json(noteData);
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    return response.status(500).json({ error: err.code });
  }
};

// Creates a new note
exports.postOneNote = async (request, response) => {
  try {
    // Check if the request body's 'body' field is empty
    if (request.body.body.trim() === "") {
      return response.status(400).json({ body: "Must not be empty" });
    }
    // Check if the request body's 'title' field is empty
    if (request.body.title.trim() === "") {
      return response.status(400).json({ title: "Must not be empty" });
    } 

    // Create a new note item object with the provided fields
    const newNoteItem = {
      title: request.body.title,
      username: request.user.username,
      body: request.body.body,
      createdAt: new Date().toISOString(),
      folders: ["default"]
    };

    // Add the new note item to the 'notes' collection and retrieve the document reference
    const doc = await db.collection("notes").add(newNoteItem);

    // Add the noteId field to the new note item object
    const responseNoteItem = newNoteItem;
    responseNoteItem.noteId = doc.id;

    // Return the new note item as a JSON response
    return response.json(responseNoteItem);
  } catch (err) {
    console.error(err);
    // Return an error response if an error occurs during the process
    response.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a note by its ID
exports.deleteNote = async (request, response) => {
  try {
    //  Get the document reference for the provided noteId
    const document = db.doc(`/notes/${request.params.noteId}`);
    const doc = await document.get();

    // Check if the document exists
    if (!doc.exists) {
      return response.status(404).json({ error: "Note not found" });
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

// Edit a note by its ID
exports.editNote = async (request, response) => {
  try { 
    // Check if the request body contains 'noteId' or 'createdAt' fields
    if (request.body.noteId || request.body.createdAt) {
      return response.status(403).json({ message: "Not allowed to edit" });
    }

    // Get the document reference for the provided noteId
    const doc = db.collection("notes").doc(`${request.params.noteId}`);
    const note = await doc.get();

    // Check if the document exists
    if (!note.exists) {
      return response.status(404).json({ message: "Not found" });
    }

    // Check if the username of the document matches the username of the user making the request
    if (note.data().username !==  request.user.username) {
      return response.status(403).json({ error: "Unauthorized" });
    }

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
