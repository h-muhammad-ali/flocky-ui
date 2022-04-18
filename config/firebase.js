import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3kavyra4MAtnjepikO2XCvVq45GCWoMo",
  authDomain: "flocky-2716.firebaseapp.com",
  projectId: "flocky-2716",
  storageBucket: "flocky-2716.appspot.com",
  messagingSenderId: "1061843249630",
  appId: "1:1061843249630:web:0da3b4f7175f4acd8d954f",
  measurementId: "G-HH245G79EN",
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

