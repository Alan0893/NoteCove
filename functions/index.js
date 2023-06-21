const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");
const cors = require("cors");

app.use(cors());

// Notes Functions
const {
  getAllNotes,
  getOneNote,
  postOneNote,
  deleteNote,
  editNote,
} = require("./APIs/notes");

// User Functions
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
  resetPassword
} = require("./APIs/users");

// Note API
app.get("/notes", auth, getAllNotes);
app.get("/note/:noteId", auth, getOneNote);
app.post("/notes", auth, postOneNote);
app.delete("/note/:noteId", auth, deleteNote);
app.put("/note/:noteId", auth, editNote);

// User API
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth ,uploadProfilePhoto);
app.post("/user", auth ,updateUserDetails);
app.get("/user", auth, getUserDetail);
app.post("/reset", resetPassword);

exports.api = functions.https.onRequest(app);
