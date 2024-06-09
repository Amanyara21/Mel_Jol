import { View, Text, Image } from 'react-native'


const SplashScreen = ({navigation}) => {
  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Image className='h-[300] w-[300]' source={require('../assets/Logo.png')}/>
    </View>
  )
}
export default SplashScreen
