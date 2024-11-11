import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../../store/firebase-configNew';
import { useMe } from '../../../hooks/useMe';

const MessageThread = ({ route }) => {
    const { threadId, orderId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const me:any = useMe();
    const sellerId = me?.uid

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, 'messages', threadId), (doc) => {
            if (doc.exists) {
                setMessages(doc.data().messages);
            }
        });
        return () => unsubscribe();
    }, [threadId]);

    const handleSendMessage = async () => {
        if (newMessage.trim().length === 0) return;
        const message = {
            senderId: me.uid,
            timestamp: new Date(),  // Temporarily use client-side timestamp
            content: newMessage,
        };

        try {
            await updateDoc(doc(firestore, 'messages', threadId), {
                messages: arrayUnion(message),
            });
            setNewMessage('');
        } catch (error) {
            Alert.alert('Error sending message', error.message);
        }
    };

    const handleApproveDelivery = async () => {
        // try {
        //     const approveDelivery = httpsCallable(functions, 'approveDelivery');
        //     await approveDelivery({ orderId });
        //     Alert.alert('Delivery approved successfully');
        // } catch (error) {
        //     Alert.alert('Error approving delivery', error.message);
        // }
          const orderRef = doc(firestore, "orders", orderId);
          await updateDoc(orderRef, 
            { 
            status: 'Approved',
            deliveryTimestamp: serverTimestamp(), 
            });
            Alert.alert('Delivery approved successfully');
          // Additional logic to release payment from escrow
           sendNotification(sellerId, 'Your delivery has been approved!');
        //   sendNotification(sellerId, "Your delivery has been approved!").catch((error) => {
        //     console.error('Error sending notification:', error);
        //   });
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.message}>{item.content}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
    );

    const sendNotification = async (userId, message) => {
        const userRef = firestore.collection('users').doc(userId);
        const userDoc = await userRef.get();

        console.log("==userDoc===",userDoc);
        
        
        // if (userDoc.exists) {
        //   const { fcmToken } = userDoc.data();
          
        //   if (fcmToken) {
        //     const notification = {
        //       to: fcmToken,
        //       notification: {
        //         title: 'Order Update',
        //         body: message,
        //       },
        //     };
            
        //     await fetch('https://fcm.googleapis.com/fcm/send', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `key=YOUR_SERVER_KEY`, // Replace with your actual FCM server key
        //       },
        //       body: JSON.stringify(notification),
        //     });
            
        //     console.log('Notification sent successfully');
        //   } else {
        //     console.log('No FCM token found for user');
        //   }
        // } else {
        //   console.log('No user document found');
        // }
      };
      
      

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderMessage}
                />
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                    style={styles.input}
                    placeholderTextColor="gray"
                />
                <Button title="Send" onPress={handleSendMessage} />
                <Button title="Approve Delivery" onPress={handleApproveDelivery} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    message: {
        color: 'white',
    },
    timestamp: {
        fontSize: 10,
        color: '#888',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        color: 'white',
    },
});

export default MessageThread;
