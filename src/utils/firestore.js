import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  runTransaction,
} from 'firebase/firestore';

import { db } from './firebase'; // import db from the firebase.js

// Check or Create user profile in Firestore
export const createOrUpdateUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // Create a new profile if it doesn't exist
      await setDoc(userDocRef, {
        name: user.displayName || 'Anonymous',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '', // optional
        major: '', // optional
        year: '', // optional
        listOfCourses: [], // empty array, to be updated later
        description: '', // optional
        pendingMatch: [], // empty array, to be updated later
        currentMatch: null, // null, to be updated later
        pastMatch: [],
      });
      console.log('User profile created');
    } else {
      console.log('User profile exists');
      return userSnapshot.data(); // return user data if it exists
    }
  } catch (error) {
    console.error('Error creating or updating user profile:', error);
  }
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
export const createMatch = async (users, time, location, description) => {
  if (!Array.isArray(users) || users.length < 2) {
    throw new Error('Invalid user list');
  }
  if (!time || !location || !description) {
    throw new Error('Missing required match details');
  }

  // Initialize each user's status as 'pending'
  const usersWithStatus = users.map((userId) => ({
    uid: userId,
    status: 'pending', // initial status; can be 'accepted' or 'declined'
    joinedAt: new Date().toISOString(), // optional: track when user joined
  }));

  try {
    const matchRef = await addDoc(collection(db, 'matches'), {
      users: usersWithStatus,
      time,
      location,
      description,
      awaitingConfirmation: true, // awaiting confirmation by default
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
