import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

const MatchModal = ({ isVisible, onClose, onGoToChat , other, image1, image2}) => {
    
    return (
        <Modal className="h-[200]" isVisible={isVisible} animationIn="slideInUp" animationOut="slideOutDown">
            <View className='justify-center items-center'>
                <View className="w-full py-6">
                    <Image className='h-20 w-full' source={require('../assets/its-a-match.png')}></Image>
                </View>

                <View>
                    <Text className='text-white text-xl'>You and {other} Liked Each other</Text>
                </View>
                <View className="py-6 flex-row gap-8">
                    <Image className='h-36 w-36 rounded-full' source={image1}></Image>
                    <Image className='h-36 w-36 rounded-full' source={image2}></Image>
                </View>

                {/* Close Icon */}

                {/* Go to Chat Button */}
                <TouchableOpacity onPress={onGoToChat} className="bg-white w-[300] py-2 my-2 rounded-full">
                    <Text className="text-black text-center text-lg">Send Message</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} className="bg-white w-[300] py-2 my-2 rounded-full">
                    <Text className="text-black text-center text-lg ">Keep Swiping</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default MatchModal;