import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "orcapro-4a0c9.firebaseapp.com",
  projectId: "orcapro-4a0c9",
  storageBucket: "orcapro-4a0c9.firebasestorage.app",
  messagingSenderId: "373393880167",
  appId: "1:373393880167:web:9a087fc5bdc796fbd8d0c2"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
