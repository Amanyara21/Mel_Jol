import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./Screens/ChatScreen";
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import DataScreen from "./Screens/DataScreen";

import useAuth from "./Hooks/useAuth";
import SplashScreen from "./Screens/SplashScreen";
import MatchedUserListScreen from "./Screens/MatchedUserListScreen";
import VideoCallScreen from "./Screens/VideoCallScreen";
import MatchModal from "./Components/MatchModal";


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user, userDetails, loadingInitial } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loadingInitial ? <Stack.Screen name='Splash' component={SplashScreen} /> :
        <>
          {user && userDetails ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Matches" component={MatchedUserListScreen} />
              <Stack.Screen name="Chat" component={ChatScreen}  initialParams={{ userName: null, userId: 0 }}/>
              <Stack.Screen name="VideoCall" component={VideoCallScreen}  initialParams={{ senderId: null, receiverId: null, caller:null }}/>
            </>
          ) : user ? (
            <Stack.Screen name="Data" component={DataScreen} options={{ swipeEnabled: false }} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} options={{ swipeEnabled: false }} />
          )}
        </>
      }
    </Stack.Navigator>
  );
};

export default StackNavigator;