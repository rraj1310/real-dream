import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
  signInWithPopup,
  Auth,
  UserCredential,
} from 'firebase/auth';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);

export { auth };

export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  return signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}

export async function signInWithGooglePopup(): Promise<UserCredential | null> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

export async function signInWithFacebookPopup(): Promise<UserCredential | null> {
  try {
    const provider = new OAuthProvider('facebook.com');
    provider.addScope('email');
    provider.addScope('public_profile');
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.error('Facebook sign-in error:', error);
    throw error;
  }
}

export async function signInWithGoogleCredential(idToken: string, accessToken?: string): Promise<UserCredential> {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}

export async function signInWithFacebookCredential(accessToken: string): Promise<UserCredential> {
  const provider = new OAuthProvider('facebook.com');
  const credential = provider.credential({ accessToken });
  return signInWithCredential(auth, credential);
}

export function onAuthStateChanged(callback: (user: any) => void) {
  return auth.onAuthStateChanged(callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}
