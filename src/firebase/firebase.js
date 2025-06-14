import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSNnRnNdHb6Beu35PuKyP8UcUde6qK4Yo",
  authDomain: "contact-manager-54259.firebaseapp.com",
  projectId: "contact-manager-54259",
  storageBucket: "contact-manager-54259.appspot.com",
  messagingSenderId: "540212279979",
  appId: "1:540212279979:web:459c70cde30085aab615ee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
