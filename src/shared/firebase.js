import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1hyyQrFTg8H_6ixZ-HdSMArwc4AeR23k",
  authDomain: "community-d0c00.firebaseapp.com",
  projectId: "community-d0c00",
  storageBucket: "community-d0c00.appspot.com",
  messagingSenderId: "404539499977",
  appId: "1:404539499977:web:6d92e8f3aa5dded877b418",
};

const apiKey = firebaseConfig.apiKey;

// firebaseConfig에 있는 정보로 firebase를 시작해라
firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();
const auth = getAuth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };
