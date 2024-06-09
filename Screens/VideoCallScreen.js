import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import database from '@react-native-firebase/database';
import { API_URL } from '@env';
const { height } = Dimensions.get('screen')
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const VideoCallScreen = ({ route, navigation }) => {
  const { caller, receiverId, code } = route.params;
  console.log(caller, receiverId, code);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();

  const channelRef = database().ref('channels').child('-Nq3BF5n8jC45VOxGMy2');
  const offerCandidatesRef = channelRef.child('offerCandidates');
  const answerCandidatesRef = channelRef.child('answerCandidates');

  useEffect(() => {
    initializeWebRTC();
  }, []);

  const initializeWebRTC = async () => {
    pc.current = new RTCPeerConnection(configuration);

    pc.current.onicecandidate = handleICECandidateEvent;
    pc.current.oniceconnectionstatechange = handleICEConnectionStateChange;
    pc.current.ontrack = handleTrackEvent;

    startWebcam();

  };


  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(configuration);

    const localStream = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(localStream);

    localStream.getTracks().forEach(track => {
      pc.current.addTrack(track, localStream);
    });

    const remote = new MediaStream();
    setRemoteStream(remote);



    pc.current.ontrack = event => {
      const receivedRemoteStream = event.streams[0];
      setRemoteStream(receivedRemoteStream);
    };

    pc.current.onaddstream = event => {
      const receivedRemoteStream = event.stream;
      setRemoteStream(receivedRemoteStream);
    };

    pc.current.onicegatheringstatechange = () => {
      console.log('iceGatheringState:', pc.current.iceGatheringState);
    };


    if (caller === 'sender') {
      startCall();
    } else {
      joinCall();
    }
  };
  const handleICECandidateEvent = async (event) => {
    console.log("handleICECandidateEvent" + event);
  }


  const handleICEConnectionStateChange = () => {
    console.log('ICE Connection State:', pc.current.iceConnectionState);
  };

  const handleTrackEvent = (event) => {
    setRemoteStream(event.stream[0])
  };
  const startCall = async () => {
    console.log('Working');
    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidatesRef.push(event.candidate.toJSON());
      }
    };
    setChannelId(channelRef.key);
    console.log(channelRef.key);
    sendNotification(channelRef.key);

    pc.current.oniceconnectionstatechange = event => {
      console.log('iceConnectionState:', event.target.iceConnectionState);
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);


    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelRef.set({ offer });

    // Listen for remote answer
    channelRef.on('value', snapshot => {
      const data = snapshot.val();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });


    // When answered, add candidate to peer connection
    answerCandidatesRef.on('child_added', snapshot => {
      const data = snapshot.val();
      pc.current.addIceCandidate(new RTCIceCandidate(data));
    });



  };

  const joinCall = async () => {
    console.log('joinCall');
    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidatesRef.push(event.candidate.toJSON());
      }
    };

    const channelSnapshot = await channelRef.once('value');
    const channelData = channelSnapshot.val();

    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    // try {

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await channelRef.update({ answer });

    offerCandidatesRef.on('child_added', async (snapshot) => {
      const data = snapshot.val();
      await pc.current.addIceCandidate(new RTCIceCandidate(data));
    });

  };

  const sendNotification = async code => {
    console.log('code is ' + code);
    console.log('code is ' + receiverId);
    try {
      const response = await fetch(
        `https://mel-jol-server.vercel.app/sendNotification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: receiverId, code: code }),
        },
      );

      const data = await response.text();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCutCall = () => {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    pc.current.close();
    navigation.goBack();
  };

  const handleToggleMic = () => {
    console.log('Toggling Mic');
  };

  const handleToggleScreenShare = () => {
    console.log('Toggling Screen Share');
  };

  const handleToggleCamera = () => {
    console.log('Toggling Camera');
  };

  return (
    <View style={styles.container}>

      {remoteStream && (
        <View>
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={styles.remoteStream}
            objectFit="cover"
            mirror
          />
          {/* <Text style={styles.streamLabel}>Remote Stream</Text> */}
        </View>
      )}
      {localStream && (
        <View>
          <RTCView streamURL={localStream.toURL()} style={styles.localStream} />
          {/* <Text style={styles.streamLabel}>Local Stream</Text> */}
        </View>
      )}

      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.iconButton} onPress={handleToggleMic}>
          <Icon name="mic" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleToggleScreenShare}>
          <Icon name="screen-share" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleToggleCamera}>
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleCutCall}>
          <Icon name="call" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    position: 'relative'
  },
  localStream: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    height: height / 4,
    aspectRatio: 9 / 16,
    backgroundColor: 'white',
  },
  remoteStream: {
    width: '100%',
    height: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  streamLabel: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  iconButton: {
    backgroundColor: '#5e17eb',
    padding: 15,
    borderRadius: 30,
  },
});

export default VideoCallScreen;

