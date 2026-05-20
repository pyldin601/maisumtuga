import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAHfSLd-tTb8LZkZBkiZfIFdl3DgkbNsFk',
  authDomain: 'maisumtuga.firebaseapp.com',
  projectId: 'maisumtuga',
  storageBucket: 'maisumtuga.firebasestorage.app',
  messagingSenderId: '359726131914',
  appId: '1:359726131914:web:32eea69d7fb949a18ca233',
  measurementId: 'G-85HVHHM5GE',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export const firebaseAnalytics: Promise<Analytics | null> = isSupported()
  .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
  .catch(() => null);
