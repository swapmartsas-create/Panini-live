import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBo7fM7Ls-my4k685FpnHaP4wqxSJErhKQ",
  authDomain: "panini-live-33dfd.firebaseapp.com",
  databaseURL: "https://panini-live-33dfd-default-rtdb.firebaseio.com",
  projectId: "panini-live-33dfd",
  storageBucket: "panini-live-33dfd.firebasestorage.app",
  messagingSenderId: "771071631712",
  appId: "1:771071631712:web:1a14bde649790d73d43e05"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
