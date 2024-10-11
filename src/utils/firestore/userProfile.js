// User profile operations (get, update, check)
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';

// Unified function to fetch user profile by UID
// (supports both regular and transaction-based fetches)
export const fetchUserProfile = async (uid, transaction) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = transaction ? await transaction.get(userRef) : await getDoc(userRef);

    if (!userSnapshot.exists()) {
      console.warn(`User profile for ${uid} does not exist`);
      return { ref: userRef, profile: null }; // Ensure a consistent return format
    }

    return { ref: userRef, profile: userSnapshot.data() };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { ref: null, profile: null };
  }
};

// Check or create user profile in Firestore (uses fetchUserProfile to streamline code)
export const checkUserProfile = async (user) => {
  try {
    const { uid, photoURL, displayName, email, phoneNumber } = user;
    const defaultProfile = {
      uid,
      profilePic: photoURL || '',
      name: displayName || 'Anonymous',
      email: email || '',
      phoneNumber: phoneNumber || '',
      major: '',
      year: '',
      open: true,
      listOfCourses: [],
      description: '',
      incomingMatches: [],
      outgoingMatches: [],
      currentMatches: [],
      pastMatches: [],
    };

    const fetchedUser = await fetchUserProfile(uid);
    if (!fetchedUser) {
      // Create a new profile if it doesn't exist
      await setDoc(doc(db, 'users', uid), defaultProfile);
      console.log('User profile created');
      return false; // Return false indicating a new user profile was created
    }

    const existingProfile = fetchedUser.profile;
    const updates = {};

    // Check for missing or outdated fields in the user's profile
    for (const key in defaultProfile) {
      if (!(key in existingProfile) || existingProfile[key] === undefined) {
        updates[key] = defaultProfile[key]; // Add missing or undefined attributes to updates
      } else if (key === 'profilePic' && photoURL !== existingProfile.profilePic) {
        updates.profilePic = photoURL; // Update profile picture if it has changed
      }
    }

    // If updates are required, update the user profile in Firestore
    if (Object.keys(updates).length > 0) {
      await updateUserProfile(uid, updates);
      console.log('User profile updated with missing attributes');
    }
    return true; // Return true indicating the user profile already existed
  } catch (error) {
    console.error('Error checking or creating user profile:', error);
    return false; // Return false if an error occurs
  }
};

// Get user profile by UID
// (simple wrapper around fetchUserProfile for non-transaction use)
export const getUserProfile = async (uid) => {
  const fetchedUser = await fetchUserProfile(uid);
  return fetchedUser ? fetchedUser.profile : null; // Return only the profile data
};

// Update user profile by UID
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates);
    console.log('User profile updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Example usage:
// await updateUserProfile(user.uid, {
//   name: "New Name",
//   email: "newemail@example.com",
//   major: "Computer Science"
// });
