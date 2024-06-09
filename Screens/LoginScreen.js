import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import useAuth from "../Hooks/useAuth";
import Loader from '../Components/Loader';

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  return (
    <View style={styles.container}>
    {loading && <Loader/>}
      <Image style={styles.Logo} source={require('../assets/Logo.png')}/>
      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:200,
    backgroundColor:'#ffffff'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#5e17eb',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width:'90%',
    padding:16,
    borderRadius:16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    textTransform:'uppercase',
    fontWeight:'bold'
  },
  Logo:{
    height:400,
    width:400
  }
});

export default LoginScreen
