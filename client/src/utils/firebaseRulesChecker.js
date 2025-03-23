import { collection, getDocs, addDoc, deleteDoc, doc, query, where, limit } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

/**
 * Utility to diagnose Firebase Firestore rules issues
 * This can help identify if rules are configured correctly
 */
export const checkFirebaseRules = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    return {
      success: false,
      message: 'Not authenticated. Please sign in first.'
    };
  }
  
  const results = {
    read: { success: false, error: null },
    write: { success: false, error: null },
    update: { success: false, error: null },
    delete: { success: false, error: null }
  };
  
  try {
    // Test read operation
    const q = query(
      collection(db, 'notes'), 
      where('userId', '==', user.uid),
      limit(1)
    );
    
    await getDocs(q);
    results.read.success = true;
    
    // Test write operation
    const testDoc = {
      title: 'Test note',
      content: 'Testing Firebase rules',
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'notes'), testDoc);
    results.write.success = true;
    
    // Test delete operation
    await deleteDoc(doc(db, 'notes', docRef.id));
    results.delete.success = true;
    
    return {
      success: true,
      message: 'Firebase rules are configured correctly. Your permissions are working.',
      details: results
    };
  } catch (error) {
    console.error('Firebase rules check failed:', error);
    
    const errorTypeMap = {
      'permission-denied': 'Firebase security rules are preventing access. Please check rules configuration in Firebase console.',
      'unauthenticated': 'Authentication error. Try signing out and in again.',
      'unavailable': 'Firebase service is currently unavailable. Try again later.',
      'not-found': 'Collection or document not found. Check your database structure.'
    };
    
    // Determine which operation failed
    Object.keys(results).forEach(op => {
      if (!results[op].success) {
        results[op].error = error.message;
      }
    });
    
    return {
      success: false,
      message: errorTypeMap[error.code] || 'Error checking rules: ' + error.message,
      details: results
    };
  }
};

/**
 * Log the user's roles and current authentication state for debugging
 */
export const logAuthState = () => {
  const user = auth.currentUser;
  
  if (user) {
    console.log('User authenticated:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }
    });
  } else {
    console.log('User not authenticated');
  }
};

export default { checkFirebaseRules, logAuthState }; 