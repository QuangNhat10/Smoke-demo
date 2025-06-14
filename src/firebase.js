// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8mqa54AyI3OXma7i3YAkbutQ6LZFJDyI",
  authDomain: "smoke-app-e18a1.firebaseapp.com",
  projectId: "smoke-app-e18a1",
  storageBucket: "smoke-app-e18a1.appspot.com",
  messagingSenderId: "326742322872",
  appId: "1:326742322872:web:8052f7ebee14fbb99d2b4c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
