import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Message } from '@/utils/api'
import { Link } from 'expo-router';

interface MessageItemProps {
    message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
    return (
        <Link href={`/`} style={styles.container} asChild>
            <TouchableOpacity>
                <View style={styles.content}>
                    <Text>{message.content}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default MessageItem

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    content:{
        
    }
})