import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import SendMsg from '../Components/SendMsg';
import ChatHeader from '../Components/ChatHeader';
import io from 'socket.io-client';
import useAuth from '../Hooks/useAuth';
import ReceiveMsg from '../Components/ReceiveMsg';
import { API_URL } from '@env'
import Icon from 'react-native-vector-icons/Ionicons'
import uuid from 'react-native-uuid';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';

const ChatScreen = ({ route, navigation }) => {

  const { userName, userId, userPic } = route.params
  const { userDetails } = useAuth()
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [prevDate, setPrevDate] = useState(null);
  const flatListRef = useRef()

  const socket = io('ws://192.168.42.220:3000/');
  // Socket.io not working with vercel
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Is connected");
      console.log(socket.connected);
    });
  }, [])
  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data)
      setMessages([...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  useEffect(() => {
    getMessages()

  }, [])


  const sendMessage = () => {
    if (inputText.trim() === '') {
      return;
    }

    const newMessage = {
      content: inputText,
      contentType: 'text',
      senderId: userDetails._id,
      userA: userDetails._id,
      userB: userId,
      id: uuid.v4(),
      imageUrl: userDetails.imageUrl,
      timestamp: new Date()
    };

    socket.emit('message', newMessage);

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const selectImage = async () => {
    ImagePicker.showImagePicker({}, (response) => {
      if (!response.didCancel && !response.error) {
        // Upload in the response.uri in firebase
        // Will Work on it later
        const newMessage = {
          contentType: 'image',
          content: response.uri,
          senderId: userDetails._id,
          userA: userDetails._id,
          userB: userId,
          id: uuid.v4(),
          imageUrl: userDetails.imageUrl,
          timestamp: new Date(),
        };

        socket.emit('message', newMessage);

        setMessages([...messages, newMessage]);
      }
    });
  };

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      // Upload result.uri in the firebase
      // Will Work on it later
      const newMessage = {
        contentType: 'document',
        content: result.uri,
        senderId: userDetails._id,
        userA: userDetails._id,
        userB: userId,
        id: uuid.v4(),
        imageUrl: userDetails.imageUrl,
        timestamp: new Date(),
      };

      socket.emit('message', newMessage);

      setMessages([...messages, newMessage]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
      } else {
        console.error('Error picking document:', err);
      }
    }
  };


  const getMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/connection/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser: userDetails._id, requestUser: userId
        })

      })
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      console.log(data);
      setMessages(data.messages)

      flatListRef.current?.scrollToEnd({ animated: true })
    } catch (error) {

    }
  }

  const onPressVideoCall = () => {
    navigation.navigate('VideoCall', { senderId: userDetails._id, receiverId: userId, caller: "sender" })
  }
  const onPressAudioCall = () => {
    navigation.navigate('AudioCall', { userId })
  }
  const renderMessage = ({ item }) => {
    const messageDate = new Date(item.timestamp);
    const currentDate = messageDate.toLocaleDateString();
    const showDate = currentDate !== prevDate;
    setPrevDate(currentDate);
    console.log(prevDate, currentDate, showDate, item.content)

    return (
      <View>
        {showDate && (
          <Text className="text-center text-gray-500 mt-2 mb-1">
            {messageDate.toLocaleDateString()}
          </Text>
        )}
        {item.senderId === userDetails._id ? (
          <SendMsg message={item} />
        ) : (
          <ReceiveMsg message={item} imageUrl={userPic} />
        )}
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <ChatHeader title={userName} onPressAudioCall={onPressAudioCall} onPressVideoCall={onPressVideoCall} />
      {messages && <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        style={styles.messageList}
      />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="black"
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity onPress={selectImage}>
          <Icon size={30} color="#000" name="images" />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectDocument}>
          <Icon size={30} color="#000" name="document-attach" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage}>
          <Icon size={30} color="#5e17eb" name="send" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageList: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#5e17eb',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 20

  },
  input: {
    flex: 1,
    height: 40,
    padding: 8,
    marginRight: 8,
    color: 'black'
  },
  sendButton: {
    backgroundColor: '#5e17eb',
    borderRadius: 8,
    padding: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
