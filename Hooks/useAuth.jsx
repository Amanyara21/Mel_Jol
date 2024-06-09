import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth, { firebase } from '@react-native-firebase/auth'
import messaging from "@react-native-firebase/messaging";
import {API_URL} from '@env'
GoogleSignin.configure({
  webClientId: '477930628198-junaqt5ortgmvamilphc98spcuoafl06.apps.googleusercontent.com',
  "client_type": 3,
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
});

const AuthContext = createContext({

})
export const AuthComponent = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null)
  const [fcmToken, setFcmToken]= useState(null)

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await getUserDetails(user.uid)
          setUser(user);
        } else {
          setUser(null);
        }

        setLoadingInitial(false);
      })
      getDeviceToken()
  }, []);
  const getDeviceToken=async()=>{
    await messaging().registerDeviceForRemoteMessages()
    const token = await messaging().getToken();
    setFcmToken(token)
    console.log("token" + token);
    if(userDetails && userDetails.fcmToken!=token){
      try {
        const response = await fetch(`${API_URL}/api/updateuser/details/${user.uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fcmToken: token,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update FCM token');
        }
  
        const updatedUser = await response.json();
        console.log("updatedUser");
      } catch (error) {
        console.error("Error is "+error);
      }
  
    }
  }
  const getUserDetails = async (uid) => {
    try {
      console.log(uid)
      console.log(`${API_URL}/api/user/details/${uid}`)
      const response = await fetch(`${API_URL}/api/user/details/${uid}`)
      if (!response.ok) {
        console.log(response);
        return null;
      }
      const data = await response.json();
      setUserDetails(data)
    } catch (error) {
      console.log(error);
    }
  }

  const addUserData = async (age, height, gender, imageUrl) => {
    setLoading(true)

    const response = await fetch(`${API_URL}api/newuser/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        age,
        height,
        gender,
        imageUrl,
        fcmToken
      }),
    });

    try {
      const res = await response.json();
      console.log(res);
      setUser(res)
    } catch (error) {
      console.error('Error parsing JSON response:', error);
    }
    setLoading(false)
  };

  const logout = async () => {
    try {
      await auth().signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error.message);
      Alert.alert('Logout Error', 'An error occurred during logout. Please try again.');
    }
  };




  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      const googleCredentials = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredentials);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("statusCodes.SIGN_IN_CANCELLED ", error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("statusCodes.IN_PROGRESS", error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("statusCodes.PLAY_SERVICES_NOT_AVAILABLE" + error)
      } else {
        console.log(statusCodes, error)
      }
    }
  }
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      logout,
      userDetails,
      loadingInitial,
      addUserData
    }),
    [user, loading, error, loadingInitial]
  );




  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}

