const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const config = require("./config");

const admin = initializeApp(config);
const db = getFirestore(admin);
const storage = getStorage(admin);

module.exports = { admin, db, storage };
