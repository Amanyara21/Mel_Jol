import React,{useEffect, useState} from "react";
import { View, Text, TouchableOpacity,TextInput } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";

const ListHeader = ({ onSearch }) => {
    const navigation = useNavigation();
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearchIconClick = () => {
        if (searchVisible) {
            setSearchText('');
        }
        setSearchVisible(!searchVisible);
    };

    
    useEffect(()=>{
        onSearch(searchText)
    },[searchText])

    return (
        <View className="relative p-2 flex-row items-center justify-between mr-4">
            <View className="flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="chevron-back-outline" size={34} color="#5e17eb" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold pl-2 text-black">Matching Profiles</Text>
            </View>

            <TouchableOpacity onPress={handleSearchIconClick} className='z-30'>
                <FontAwesome
                    name={searchVisible ? 'times' : 'search'}
                    size={30}
                    className='rounded-t-xl rounded-l-full'
                    color="#5e17eb"
                />
            </TouchableOpacity>

            {searchVisible && (
                <View className="flex-row absolute left-0 bg-white h-full w-[300px] items-center z-10">
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="black"
                        className='border text-black border-dark-50 rounded-md p-2 w-full mr-2'
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                        }}

                    />
                </View>
            )}
        </View>
    );
};

export default ListHeader;
