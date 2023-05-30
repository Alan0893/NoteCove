const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const admin = initializeApp(config);
const db = getFirestore(admin);

module.exports = { admin, db };
