const { db, storage } = require("../util/admin");
const config = require("../util/config");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} = require("firebase/auth");
const { initializeApp } = require("firebase/app");

// Initialize the Firebase app with the provided configuration
const app = initializeApp(config);
// Get the authentication instance from the Firebase app
const auth = getAuth(app);
// Import validation functions from a separate file
const { validateLoginData, validateSignUpData } = require("../util/validators");

// User Login
exports.loginUser = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  // Validate user login data
  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  // Query the 'users' collection to find a user with the provided email
  const userRef = db.collection("users").where("email", "==", user.email).limit(1);
  userRef.get()
    .then((querySnapshot) => {
      if(querySnapshot.empty) {
        // Return an error response if no user is  found with the provided email
        return response.status(403).json({
          general: "Invalid email. User does not exist."
        })
      } else {
        // Sign in the user with the provided email and password
        signInWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {
            // Get the user's  authentication token
            return userCredential.user.getIdToken();
          })
          .then((token) => {
            // Return the authentication token as a JSON response
            return response.json({ token });
          })
          .catch((error) => {
            console.error(error);
            // Return an error response if the provided credentials are incorrect
            return response.status(403).json({
              general: "Wrong credentials. Try again.",
            });
          });
      }
    })
};

//  User Sign Up
exports.signUpUser = (request, response) => {
  const newUser = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    phoneNumber: request.body.phoneNumber,
    country: request.body.country,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    username: request.body.username,
  };

  // Validate a user sign up data
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return response.status(400).json(errors);

  let token, userId;
  // Check if the username is already taken
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ username: "This username is already taken." });
      } else {
        //  Create a new user with the provided email and password
        return createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password
        );
      }
    })
    .then((userCredential) => {
      userId = userCredential.user.uid;
      // Get the user's authentication token
      return userCredential.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      // Create user credentials data to be stored in the 'users' collection
      const userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      // Set the user credentials in the 'users' collection
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      // Return the authentication token as a JSON response
      return response.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        // Return an error response if the provided email is already in use
        return response.status(400).json({ email: "Email already in use." });
      } else {
        // Return an error response for any other errors that ocurrs
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again." });
      }
    });
};

// Function to delete an image
const deleteImage = (imageName) => {
  const bucket = storage.bucket();
  const path = `${imageName}`;
  
  // Delete the image file from the storage bucket
  return bucket
    .file(path)
    .delete()
    .then(() => {
      return;
    })
    .catch((err) => {
      return;
    });
};

// Upload Profile Photo
exports.uploadProfilePhoto = (request, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers, preservePath: true });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      // Return an error message if the file type is not supported
      return response.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${request.user.username}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  // Delete the existing image file before uploading a new one
  deleteImage(imageFileName)
    .then(() => {
      busboy.on("finish", () => {
        // Upload the image file to the storage bucket
        storage
          .bucket()
          .upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          })
          .then(() => {
            // Get the public URL of the uploaded image
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            // Update the user's profile with the image URL
            return db
              .doc(`/users/${request.user.username}`)
              .update({ imageUrl });
          })
          .then(() => {
            // Return a success message as a JSON response
            return response.json({ message: "Image uploaded successfully" });
          })
          .catch((error) => {
            console.error(error);
            // Return an error response if an error occurs during the process
            return response.status(500).json({ error: error.code });
          });
      });
      busboy.end(request.rawBody);
    })
    .catch ((err) => {
      console.error(err);
      // Return an error response if an error occurs during the process
      return response.status(500).json({ error: err.code });
    })
};

// Get User Details
exports.getUserDetail = (request, response) => {
  let userData = {};
  // Retrieve the user's details from the 'users' collection
  db.doc(`/users/${request.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        // Return the user's details as a JSON response
        return response.json(userData);
      } else {
        //  Return an error response if the user is not found
        return response.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      // Return an error response if an error occurs during the process
      return response.status(500).json({ error: error.code });
    });
};

// Update User Details
exports.updateUserDetails = (request, response) => {
  const updatedUser = request.body;
  let document = db.collection("users").doc(`${request.user.username}`);
  
  // Update the user's details in the 'users' collection
  document
    .update(updatedUser)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((error) => {
      console.error(error);
      // Return an error response if an error occurs during the process
      return response.status(500).json({
        message: "Cannot update the user details"
      });
    });
};

// Reset Password
exports.resetPassword = (request, response) => {
  const { email } = request.body;

  // Check if the user with the provided email exists
  db.collection("users")
    .where("email", "==", email)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        // Return an error response if the user does not exist
        return response.status(404).json({
          error: "User with this email does not exist.",
        });
      } else {
        // Send a password reset email to the user
        sendPasswordResetEmail(auth, email)
          .then(() => {
            // Return a success message as a JSON response
            return response.json({
              message: "Password reset email sent successfully.",
            });
          })
          .catch((error) => {
            console.error(error);
            // Return an error response if an error occurs during the process
            return response.status(500).json({
              error: "Failed to send password reset email.",
            });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        // Return an error response if an error occurs during the process
        error: "Failed to check if the email exists.",
      });
    });
};
