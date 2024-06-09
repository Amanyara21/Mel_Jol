import { View, Text, Image } from 'react-native'

const ReceiveMsg = ({message, imageUrl}) => {
  const formattedTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString([], options);
};
  return (
    <View className='bg-app-themes rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14 self-start'>
      <Image
        className='h-12 w-12 rounded-full absolute top-0 -left-14'
        source={{ uri: imageUrl }}
      />
      <Text className='text-white'>{message.content}</Text>
      <Text className='text-white text-xs self-end -right-3'>{formattedTime(message.timestamp)}</Text>
    </View>
  )
}
export default ReceiveMsg