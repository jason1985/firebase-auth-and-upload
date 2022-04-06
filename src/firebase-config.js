import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAN4aIxb4RLhS93zXeLVriQxGGdV8-HjG0",
  authDomain: "email-login-photo-upload.firebaseapp.com",
  projectId: "email-login-photo-upload",
  storageBucket: "email-login-photo-upload.appspot.com",
  messagingSenderId: "394003163939",
  appId: "1:394003163939:web:36118903d7470dafa8ba96",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
