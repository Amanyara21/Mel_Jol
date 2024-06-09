import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useEffect, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../Hooks/useAuth';
import { API_URL } from '@env'
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from '../Components/DrawerContent';
import MatchModal from '../Components/MatchModal';

const HomeScreen = ({ navigation }) => {
  const { userDetails } = useAuth()
  const swipeRef = useRef(null);
  const drawerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false)
  const [profiles, setProfiles] = useState(null)
  useEffect(() => {
    getAllUsers();
  }, [])
  const getAllUsers = async () => {
    try {
      console.log(`https://mel-jol-server.vercel.app/api/users`);
      let response = await fetch(`https://mel-jol-server.vercel.app/api/users`);
      let data = await response.json();
      setProfiles(data)
    } catch (error) {
      console.log(error);
    }
  }
  const goToChat = () => {
    console.log("Okk");
  }
  const close = () => {
    setVisible(false)
  }



  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return <DrawerContent />;
      }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center relative justify-between px-5 py-1 border-transparent rounded-b-xl bg-white">
          <TouchableOpacity onPress={() => setOpen((prevOpen) => !prevOpen)}>
            <Image
              className="h-10 w-10 rounded-full"
              source={{ uri: userDetails.imageUrl }}
            />
          </TouchableOpacity>

          <Image className="h-14 w-14 rounded-full" source={require("../assets/Logo.png")} />
          <TouchableOpacity onPress={() => navigation.navigate("Matches")}>
            <Ionicons name="chatbubbles-sharp" size={30} color="#5e17eb" />
          </TouchableOpacity>
        </View>

        {profiles && <View className="flex-1 -mt-6">
          <Swiper
            ref={swipeRef}
            containerStyle={{ backgroundColor: "transparent" }}
            cards={profiles}
            stackSize={5}
            cardIndex={0}
            stackSeparation={14}
            verticalSwipe={false}
            animateCardOpacity
            onSwipedLeft={(cardIndex) => {
              console.log("Swipe PASS");
            }}
            onSwipedRight={async (cardIndex) => {
              console.log("Swipe MATCH");
              const response = await fetch(`${API_URL}/api/connection/createconnection`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userA: userDetails._id, userB: profiles[cardIndex]._id }),
              });

              const data = await response.json();
              if (data.message == "It's a Match.") {
                {
                  setVisible(true)
                  return (
                    <View className="relative">
                      <MatchModal isVisible={visible} onClose={() => setVisible(false)}
                        imaage1={userDetails.imageUrl} other={profiles[cardIndex].name} image2={profiles[cardIndex].imageUrl} goToChat={() => { navigation.navigate('Chat') }} />
                    </View>)
                }
              }
            }}
            overlayLabels={{
              left: {
                title: "NOPE",
                style: {
                  label: {
                    textAlign: "right",
                    color: "red",
                  },
                },
              },
              right: {
                title: "MATCH",
                style: {
                  label: {
                    color: "#4DED30",
                  },
                },
              },
            }}
            backgroundColor={"#4FD0E9"}
            renderCard={(card) =>
              card ? (
                <View
                  key={card._id}
                  className="relative bg-white h-3/4 rounded-xl"
                >
                  <Text className="text-black">{card.firstName}</Text>
                  <Image
                    className="absolute top-0 h-full w-full rounded-xl"
                    source={{ uri: card.imageUrl }}
                  />
                  <View className="absolute bottom-0 justify-between flex-row bg-white w-full h-20 px-6 py-2 rounded-b-xl items-center"
                    style={styles.cardShadow}
                  >
                    <View>
                      <Text className="text-xl font-bold text-black">
                        {card.name}
                      </Text>
                      <Text className="text-black">{card.job}</Text>
                    </View>
                    <Text className="text-2xl font-bold text-black">{card.age}</Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => { navigation.navigate('profile') }}>
                      <Text className='text-black'>View Full Profile</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ) : (
                <View className="relative bg-white h-3/4 rounded-xl justify-center items-center"
                  style={
                    styles.cardShadow}
                >
                  <Text className="font-bold pb-5">No more profiles</Text>
                </View>
              )
            }
          />
        </View>}
        <View className="flex flex-row justify-evenly p-10">
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeLeft()}
            className=
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          >
            <Entypo name="cross" size={32} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeRight()}
            className=
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          >
            <Entypo name="heart" size={32} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    </Drawer>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  },
});

export default HomeScreen
