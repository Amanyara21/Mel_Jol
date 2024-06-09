import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import ListHeader from '../Components/ListHeader';
import useAuth from '../Hooks/useAuth';
import { API_URL } from '@env'
const MatchedUserListScreen = ({ navigation }) => {
    useEffect(() => {
        getMatchedUser()
    }, [])
    const { userDetails } = useAuth();
    const [initialUsers, setIntialUsers] = useState(null);
    const [users, setUsers] = useState(null)
    const getMatchedUser = async () => {
        const response = await fetch(`${API_URL}/api/connection/connected-data/${userDetails._id}`);
        const data = await response.json();
        setIntialUsers(data);
        setUsers(data);
    }

    const handleSearch = (searchText) => {
        const filteredUsers = initialUsers && initialUsers.filter(user => user.requestUser.name.toLowerCase().includes(searchText.toLowerCase()));
        setUsers(filteredUsers);
    };

    const renderUser = ({ item }) => {
        const lastMessage = item.messages.length > 0 ? item.messages[item.messages.length - 1] : null;
        const lastMessageTime = lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : null;

        return (
            <TouchableOpacity key={item.id} className='flex-row bg-white  rounded-lg p-4 space-y-2 ' onPress={() => navigation.navigate('Chat', { userName: item.requestUser.name, userId: item.requestUser._id, userPic: item.requestUser.imageUrl })}>
                <Image source={{ uri: item.requestUser.imageUrl }} className='w-16 h-16 mr-6 mb-2 rounded-full' />
                <View className="flex-1">
                    <Text className="font-bold text-lg text-black">{item.requestUser.name}</Text>
                    <View className="flex flex-row justify-between w-fit">
                        <Text className="text-sm text-gray-500">{lastMessage && lastMessage.content }</Text>
                        <Text className="text-sm text-gray-500">{lastMessageTime && lastMessageTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View>
            <ListHeader onSearch={handleSearch} />
            {<FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
            />}
        </View>
    );
};



export default MatchedUserListScreen;
