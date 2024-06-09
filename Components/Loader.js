import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {

  return (
    <View className='absolute justify-center items-center'>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};


export default Loader;
