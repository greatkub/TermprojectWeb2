import firebase from "firebase/app";
import "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyDilyEb0r9c4mkFY8-3LYYvPjfc_VURRcU",
    authDomain: "lendit-upload.firebaseapp.com",
    projectId: "lendit-upload",
    storageBucket: "lendit-upload.appspot.com",
    messagingSenderId: "235321569963",
    appId: "1:235321569963:web:5702a262cd252415203dee",
    measurementId: "G-ZXD35NWRRE"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };