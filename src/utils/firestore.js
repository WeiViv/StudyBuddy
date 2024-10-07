import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  runTransaction,
} from 'firebase/firestore';

import { db } from './firebase'; // import db from the firebase.js

// Check user profile in Firestore
export const checkUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    const defaultProfile = {
      uid: user.uid,
      profilePic: user.photoURL || '',
      name: user.displayName || 'Anonymous',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      major: '',
      year: '',
      open: true,
      listOfCourses: [], // empty array, to be updated later
      description: '',
      inComingMatches: [],
      outGoingMatches: [],
      currentMatches: [],
      pastMatches: [],
    };

    if (!userSnapshot.exists()) {
      // Create a new profile if it doesn't exist
      await setDoc(userDocRef, defaultProfile);
      console.log('User profile created');
      return false; // Return false if a new user profile is created
    } else {
      const existingProfile = userSnapshot.data();
      const updates = {};

      // Check if each attribute in the schema is present and matches the default
      for (const key in defaultProfile) {
        if (!(key in existingProfile) || existingProfile[key] === undefined) {
          // Add missing or undefined attributes to updates
          updates[key] = defaultProfile[key];
        } else if (key === 'profilePic' && user.photoURL !== existingProfile.profilePic) {
          // Check if the profile picture needs updating
          updates.profilePic = user.photoURL;
        }
      }

      // If there are any updates, update the user profile
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(user.uid, updates);
        console.log('User profile updated with missing attributes');
      } else {
        console.log('User profile exists and is up-to-date');
      }

      return true; // Return true if the user profile already exists
    }
  } catch (error) {
    console.error('Error creating or updating user profile:', error);
  }
  return false; // Default return false if an error occurs
};

// Get user profile by uid
export const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      console.log(userSnapshot.data());
      return userSnapshot.data(); // return user data
    } else {
      console.log('No such user profile found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
  return null;
};

// Update user profile by uid
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates);
    console.log('User profile updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// ************************************************************
// Example usage: (Type 1)
// await updateUserProfile(user.uid, {
//   name: "New Name",
//   email: "newemail@example.com",
//   major: "Computer Science"
// });

// ************************************************************
// Example usage: (Type 2)
// const updates = {};

// if (newName) updates.name = newName;
// if (newEmail) updates.email = newEmail;
// if (newMajor) updates.major = newMajor;

// await updateUserProfile(user.uid, updates);
// ************************************************************

// Create a new match
export const createMatch = async (users, location, description = '') => {
  if (!Array.isArray(users) || users.length < 2) {
    throw new Error('Invalid user list');
  }
  if (!location) {
    throw new Error('Missing required match details');
  }

  // Initialize each user's status as 'pending'
  const usersWithStatus = users.map((userId) => ({
    uid: userId,
    status: 'pending', // initial status; can be 'confirmed' or 'declined'
    joinedAt: new Date().toISOString(), // optional: track when user joined
  }));

  // For first user in the array, status will be 'confirmed'
  usersWithStatus[0].status = 'confirmed';

  try {
    const matchRef = await addDoc(collection(db, 'matches'), {
      users: usersWithStatus,
      time: new Date().toISOString(), // track match creation time
      location,
      description,
      awaitingConfirmation: false, // flag to check if all users have confirmed
      createdAt: new Date().toISOString(), // track match creation time
    });
    console.log('Match created with ID: ', matchRef.id);
    return matchRef.id;
  } catch (error) {
    console.error('Error creating match:', error);
  }
};

// Get match by match id
export const getMatch = async (matchId) => {
  try {
    const matchDocRef = doc(db, 'matches', matchId);
    const matchSnapshot = await getDoc(matchDocRef);

    if (matchSnapshot.exists()) {
      return matchSnapshot.data(); // return match data
    } else {
      console.log('No such match found');
    }
  } catch (error) {
    console.error('Error fetching match:', error);
  }
};

// Update match with user confirmation
export const updateMatchWithUser = async (userId, matchId, newStatus) => {
  try {
    await runTransaction(db, async (transaction) => {
      const matchDocRef = doc(db, 'matches', matchId);
      const userDocRef = doc(db, 'users', userId);

      const matchDoc = await transaction.get(matchDocRef);
      if (!matchDoc.exists()) {
        throw 'Match does not exist!';
      }

      const matchData = matchDoc.data();
      const updatedUsers = matchData.users.map((user) => {
        if (user.uid === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      });

      // Check if all users have confirmed the match
      const awaitingConfirmation = updatedUsers.some((user) => user.status === 'pending');

      // Update the match with the new user status and awaitingConfirmation flag
      transaction.update(matchDocRef, {
        users: updatedUsers,
        awaitingConfirmation,
      });

      // Optionally, update the user's currentMatch if they've confirmed
      if (newStatus === 'confirmed') {
        transaction.update(userDocRef, { currentMatch: matchId });
      }
    });
    console.log('Transaction successfully committed!');
  } catch (error) {
    console.log('Transaction failed: ', error);
  }
};

// Get array of all users

export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);

    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
  }
};
