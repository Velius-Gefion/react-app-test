import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = 
{
  apiKey: "AIzaSyDJ4Vpjlg56ZpIBCtEtvIGxTVoZEnar0Yo",
  authDomain: "test-website-with-sms.firebaseapp.com",
  projectId: "test-website-with-sms",
  storageBucket: "test-website-with-sms.appspot.com",
  messagingSenderId: "675058641317",
  appId: "1:675058641317:web:4c4d7d1b06642f4e60204c",
  measurementId: "G-YETZQZFPKM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);