var firebaseConfig = {
    apiKey: "AIzaSyA2lMKatZKkW693lc3-ccORP8Q5ausfSp8",
    authDomain: "agritecx-app.firebaseapp.com",
    databaseURL: "https://agritecx-app-default-rtdb.firebaseio.com",
    projectId: "agritecx-app",
    storageBucket: "agritecx-app.appspot.com",
    messagingSenderId: "628609097557",
    appId: "1:628609097557:web:c4554a1b9a2f9bbbb799dc",
    measurementId: "G-M82W0GP4H4"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
