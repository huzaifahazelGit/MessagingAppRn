import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC0Q994YlSdRQQbcw2daYUlCA8Ae8zf0gQ",
  authDomain: "realm-4805d.firebaseapp.com",
  projectId: "realm-4805d",
  storageBucket: "realm-4805d.appspot.com",
  messagingSenderId: "191792014167",
  appId: "1:191792014167:web:59dfffc7990c390e781412",
  measurementId: "G-76LVVHTS9K",
};

// export default firebaseConfig;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore:any = getFirestore(app);
const storage = getStorage(app);


export { firestore,storage, };