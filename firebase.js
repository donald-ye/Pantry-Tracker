// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDz_KzYoL1XieqEpxtrNJFLjeNmBc1AYBw",
	authDomain: "inventory-management-df535.firebaseapp.com",
	projectId: "inventory-management-df535",
	storageBucket: "inventory-management-df535.appspot.com",
	messagingSenderId: "50528703062",
	appId: "1:50528703062:web:e321523e9792806761a1f7",
	measurementId: "G-24K5W079W2"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}