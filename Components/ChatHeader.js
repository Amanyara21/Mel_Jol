import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";

const ChatHeader = ({ title, onPressVideoCall, onPressAudioCall }) => {
    const navigation = useNavigation();
    return (
        <View className="p-2 flex-row items-center justify-between mr-4">
            <View className="flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2"
                >
                    <Ionicons name="chevron-back-outline" size={34} color="#5e17eb" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold pl-2 text-black">{title}</Text>
            </View>

            <View className="flex-row gap-8">
                <TouchableOpacity onPress={onPressAudioCall}>
                    <FontAwesome
                        name="phone"
                        size={30}
                        className='rounded-t-xl rounded-l-full'
                        color="#5e17eb"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressVideoCall}>
                    <FontAwesome
                        name="video-camera"
                        size={30}
                        className='rounded-t-xl rounded-l-full'
                        color="#5e17eb"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatHeader;