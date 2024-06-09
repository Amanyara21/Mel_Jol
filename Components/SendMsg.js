import { View, Text, Image } from 'react-native'

const SendMsg = ({ message }) => {
    const formattedTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = { hour: 'numeric', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString([], options);
    };

    return (
        <View className='bg-app-themes rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 ml-14 self-end'>
            <Text className='text-white text-xl'>{message.content}</Text>
            <Text className='text-white text-xs self-end -right-3'>{formattedTime(message.timestamp)}</Text>
        </View>
    )
}
export default SendMsg