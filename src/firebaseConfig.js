// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt58hQaIhq9Js5IwcQDUQw6qz2gOBwFgY",
  authDomain: "plannedem.firebaseapp.com",
  projectId: "plannedem",
  storageBucket: "plannedem.appspot.com",
  messagingSenderId: "733564765714",
  appId: "1:733564765714:web:0eeb0b07f9eb5f86fbbacb",
  measurementId: "G-RD3TX0RWYM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default { auth };
