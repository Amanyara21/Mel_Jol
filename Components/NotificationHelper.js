import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';

const NotificationHandler = () => {

    console.log("IN NotificationHandler");
    const navigation = useNavigation();

    console.log("data");
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const { data } = remoteMessage;
            if (data?.navigationTarget === 'VideoCall') {
                navigation.navigate('VideoCall', {
                    receiverId: data.receiverId,
                    code: data.code,
                    caller: 'receiver',
                });
            }
        });

        return unsubscribe;
    }, [navigation]);

    return null;
};

export default NotificationHandler;
