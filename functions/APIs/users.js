const { admin, db, storage } = require("../util/admin");
const config = require("../util/config");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");
const { initializeApp } = require("firebase/app");
const app = initializeApp(config);
const auth = getAuth(app);
const { validateLoginData, validateSignUpData } = require("../util/validators");

exports.loginUser = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  signInWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {
      return userCredential.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((error) => {
      console.error(error);
      return response.status(403).json({
        general: "Wrong credentials. Try again.",
      });
    });
};