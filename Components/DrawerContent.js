import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import useAuth from '../Hooks/useAuth';

const DrawerContent = () => {
    const { userDetails } = useAuth()
    return (
        <View className='flex-1 my-8 items-center'>
            {/* Image */}
            <Image
                source={{ uri: userDetails.imageUrl }}
                className='w-48 h-48 rounded-full'
            />

            {/* DrawerContent text */}
            <Text className='text-black'>Welcome, {userDetails.name}</Text>

            {/* Two buttons */}
            <TouchableOpacity
                style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    margin: 5,
                    borderRadius: 5,
                }}
            >
                <Text style={{ color: 'white' }}>Button 1</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: 'green',
                    padding: 10,
                    margin: 5,
                    borderRadius: 5,
                }}
            >
                <Text style={{ color: 'white' }}>Button 2</Text>
            </TouchableOpacity>
        </View>
    );
};


export default DrawerContent