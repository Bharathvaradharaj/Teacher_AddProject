// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAc_4VTsZwUviDOb1zyFQMdC75KMpCPjTw",
  authDomain: "final-project-acc23.firebaseapp.com",
  projectId: "final-project-acc23",
  storageBucket: "final-project-acc23.appspot.com",
  messagingSenderId: "664774059465",
  appId: "1:664774059465:web:9cde4fb2ac743bedce7418",
  measurementId: "G-2117SB5FD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
const auth = getAuth(app)

export default auth