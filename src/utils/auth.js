import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { auth } from './firebaseConfig';
import { checkUserProfile } from './firestore';

const provider = new GoogleAuthProvider();

// Google Sign-In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error during sign-in:', error);
    return null;
  }
};

// Handle Sign-In
//     Return true: user already exists in the database
export const handleSignIn = async () => {
  const user = await signInWithGoogle();
  let alreadyExist = true;
  if (user) {
    alreadyExist = await checkUserProfile(user);
  }
  return alreadyExist;
};

// Handle Sign-Out
export const handleSignOut = async (navigate) => {
  try {
    await signOut(auth);
    console.log('Sign out successful');
    navigate('/');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};
