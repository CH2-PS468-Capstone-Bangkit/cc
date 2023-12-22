const express = require("express");
const firebase = require("firebase");
const admin = require("firebase-admin");

const app = express();

// Koneksi ke database Firebase
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-firebase-auth-domain",
  databaseURL: "your-firebase-database-url",
  projectId: "your-firebase-project-id",
  storageBucket: "your-firebase-storage-bucket",
  messagingSenderId: "your-firebase-messaging-sender-id",
};
firebase.initializeApp(firebaseConfig);

// Koneksi ke backend Google App Engine
admin.initializeApp();

// Endpoints
app.get("/", (req, res) => {
  // Mengambil data dari database Firebase
  const usersRef = firebase.database().ref("/users");
  usersRef.on("value", (snapshot) => {
    // Mengembalikan data pengguna dalam format JSON
    res.send(JSON.stringify(snapshot.val()));
  });
});

app.post("/login", (req, res) => {
  // Memvalidasi kredensial login
  const username = req.body.username;
  const password = req.body.password;
  const userRef = firebase.database().ref("/users/" + username);
  userRef.on("value", (snapshot) => {
    if (snapshot.val().password === password) {
      // Login berhasil
      const token = admin.auth().createCustomToken(username);
      res.send({ token: token });
    } else {
      // Login gagal
      res.send({ error: "Invalid username or password" });
    }
  });
});

// Menjalankan aplikasi
app.listen(3000, () => {
  console.log("Aplikasi berjalan di port 3000");
});
