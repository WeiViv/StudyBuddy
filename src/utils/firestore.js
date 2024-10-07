import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  runTransaction,
  arrayUnion,
  arrayRemove,
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
      incomingMatches: [],
      outgoingMatches: [],
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

// Function to get the array of majors from Firestore
export const getMajors = async () => {
  try {
    const majorsDocRef = doc(collection(db, 'majorsCourses'), 'majors');
    const majorsSnapshot = await getDoc(majorsDocRef);

    if (majorsSnapshot.exists()) {
      return majorsSnapshot.data().majors;
    } else {
      console.log('No majors found in Firestore');
      return [];
    }
  } catch (error) {
    console.error('Error fetching majors:', error);
  }
};

// Get user profile by uid
export const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
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
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates);
    console.log('User profile updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

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
    const matchRef = doc(collection(db, 'matches'));

    await runTransaction(db, async (transaction) => {
      const userProfiles = await Promise.all(
        usersWithStatus.map(async (user) => {
          const userRef = doc(db, 'users', user.uid);
          const userSnapshot = await transaction.get(userRef);

          if (!userSnapshot.exists()) {
            throw new Error(`User profile for ${user.uid} does not exist`);
          }

          return { uid: user.uid, ref: userRef, profile: userSnapshot.data() };
        }),
      );

      // Set the match document
      transaction.set(matchRef, {
        users: usersWithStatus,
        time: new Date().toISOString(), // track match creation time
        location,
        description,
        awaitingConfirmation: false, // flag to check if all users have confirmed
        createdAt: new Date().toISOString(), // track match creation time
      });

      // Update the incomingMatches of the first user
      transaction.update(userProfiles[0].ref, {
        incomingMatches: arrayUnion({
          requestingUser: userProfiles[1].uid,
          matchId: matchRef.id,
        }),
      });

      // Update the outgoingMatches of the second user
      transaction.update(userProfiles[1].ref, {
        outgoingMatches: arrayUnion({
          requestedUser: userProfiles[0].uid,
          matchId: matchRef.id,
        }),
      });
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

// Get all user matches
export const getUserMatches = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('User profile does not exist');
    }

    const { currentMatches } = userSnapshot.data();
    if (!currentMatches || currentMatches.length === 0) {
      return [];
    }

    // Fetch profiles for each match in the "matches" collection
    const matchProfiles = await Promise.all(
      currentMatches.map(async (matchId) => {
        const matchRef = doc(db, 'matches', matchId);
        const matchSnapshot = await getDoc(matchRef);

        if (!matchSnapshot.exists()) {
          console.error(`Match with ID ${matchId} does not exist`);
          return null;
        }

        const matchData = matchSnapshot.data();
        const otherUsers = matchData.users.filter((user) => user.uid !== uid);

        // Fetch profiles for all other users in the match
        const profiles = await Promise.all(
          otherUsers.map(async (user) => {
            const matchUserRef = doc(db, 'users', user.uid);
            const matchUserSnapshot = await getDoc(matchUserRef);
            if (matchUserSnapshot.exists()) {
              return { ...matchUserSnapshot.data(), uid: user.uid };
            }
            return null;
          }),
        );

        // Filter out any null values (in case some match profiles couldn't be fetched)
        return profiles.filter((profile) => profile !== null);
      }),
    );

    // Flatten the array to get a single list of profiles and filter out any empty arrays
    return matchProfiles.flat().filter((profile) => profile !== null);
  } catch (error) {
    console.error('Error fetching user matches:', error);
    return [];
  }
};

export const resolveMatchRequest = async (requestedUserUid, requestingUserUid, matchId, accept) => {
  try {
    await runTransaction(db, async (transaction) => {
      const requestedUserRef = doc(db, 'users', requestedUserUid);
      const requestingUserRef = doc(db, 'users', requestingUserUid);
      const matchRef = doc(db, 'matches', matchId);

      // Get the profiles of both users
      const requestedUserSnapshot = await transaction.get(requestedUserRef);
      const requestingUserSnapshot = await transaction.get(requestingUserRef);

      if (!requestedUserSnapshot.exists() || !requestingUserSnapshot.exists()) {
        throw new Error('One or both user profiles do not exist');
      }

      // Remove relevant incoming match from requestedUser's profile
      const incomingMatchToRemove = { requestingUser: requestingUserUid, matchId: matchId };
      transaction.update(requestedUserRef, {
        incomingMatches: arrayRemove(incomingMatchToRemove),
      });

      // Remove relevant outgoing match from requestingUser's profile
      const outgoingMatchToRemove = { requestedUser: requestedUserUid, matchId: matchId };
      transaction.update(requestingUserRef, {
        outgoingMatches: arrayRemove(outgoingMatchToRemove),
      });

      // If the request is accepted, add the match to both users' currentMatches
      if (accept) {
        transaction.update(requestedUserRef, {
          currentMatches: arrayUnion(matchId),
        });

        transaction.update(requestingUserRef, {
          currentMatches: arrayUnion(matchId),
        });
      } else {
        // If the request is denied, delete the match document
        transaction.delete(matchRef);
      }
    });

    console.log(`Match request resolved successfully (${accept ? 'accepted' : 'denied'})`);
  } catch (error) {
    console.error('Error resolving match request:', error);
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

export const getMatchedUserUids = async (userUid) => {
  try {
    const userRef = doc(db, 'users', userUid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('User profile does not exist');
    }

    const { currentMatches } = userSnapshot.data();
    if (!currentMatches || currentMatches.length === 0) {
      return [];
    }

    const matchedUserUids = new Set();

    // Fetch each match document and collect the UIDs of users in those matches
    await Promise.all(
      currentMatches.map(async (matchId) => {
        const matchRef = doc(db, 'matches', matchId);
        const matchSnapshot = await getDoc(matchRef);

        if (!matchSnapshot.exists()) {
          console.error(`Match with ID ${matchId} does not exist`);
          return;
        }

        const matchData = matchSnapshot.data();
        matchData.users.forEach((user) => {
          if (user.uid !== userUid) {
            matchedUserUids.add(user.uid);
          }
        });
      }),
    );

    return Array.from(matchedUserUids);
  } catch (error) {
    console.error('Error fetching matched user UIDs:', error);
    return [];
  }
};
