import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import useAuth from '../Hooks/useAuth';
import storage from '@react-native-firebase/storage';
import Loader from '../Components/Loader';
import messaging from "@react-native-firebase/messaging";
import { API_URL } from '@env'

const DataScreen = () => {

  const { user, addUserData } = useAuth();
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false)
  const [fcmToken, setFcmToken] = useState(false)

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log(response);
        setImage(imageUri);
      }
    });
  };


  const handleAddData = async () => {
    setLoading(true)

    const imageUrl = await uploadImage(image, user.displayName);


    await addUserData(age, height, gender, imageUrl)
    setLoading(false)

  };



  const uploadImage = async (uri, imageName) => {
    const reference = storage().ref(`images/${imageName}`);
    try {
      await reference.putFile(uri);
      console.log('Image uploaded successfully!');
      const downloadURL = await reference.getDownloadURL();
      console.log('Download URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };



  return (
    <View className="relative p-4 text-black">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Text className="text-2xl font-bold mb-2 text-black text-center" > Welcome, {user.displayName}</Text>
          <TouchableOpacity onPress={handleImagePicker} className='justify-center items-center text-black '>
            <Image
              source={image ? { uri: image } : require('../assets/default_image.jpg')}
              className="rounded-full mb-2 items-center border-light-bg-red-900 w-[150px] h-[150px]"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold mb-1 text-black" > Age</Text>
          <TextInput
            className="border border-gray-300 rounded-full py-2 px-6 mb-3 text-black"
            value={age}
            onChangeText={(text) => setAge(text)}
            keyboardType="numeric"
          />

          <Text className="text-lg font-bold mb-1 text-black">Height (in cm)</Text>
          <TextInput
            className="border border-gray-300 rounded-full py-2 px-6 mb-3 text-black"
            value={height}
            onChangeText={(text) => setHeight(text)}
            keyboardType="numeric"
          />

          <Text className="text-lg font-bold mb-1 text-black">Gender</Text>
          <View className='border-grey-600 border rounded-full mb-3 overflow-hidden'>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => {
                setGender(itemValue)
                console.log(itemValue, gender)
              }}
              mode='dropdown'
              dropdownIconColor='black'
            >
              <Picker.Item style={{ backgroundColor: "white", }} color="black" label="Male" value="Male" />
              <Picker.Item style={{ backgroundColor: "white" }} color="black" label="Female" value="Female" />
            </Picker>
          </View>
          <Button title="Add Data" onPress={handleAddData} />
        </>)}
    </View>
  );
};

export default DataScreen