import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Message } from '@/utils/api'
import { Link } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
    message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
    return (
        // link wrapper with asChild to make touchable work as navigation
        <Link href={`/(app)/(authenticated)/(tabs)/messages/${message.id}`} style={styles.container} asChild>
            <TouchableOpacity>
                {/* container for message content and date */}
                <View style={styles.content}>
                    {/* message text with single line truncation */}
                    <Text style={styles.contentText} numberOfLines={1}>{message.content}</Text>
                    {/* relative time display (e.g. "2 hours ago") */}
                    <Text style={styles.date}>{formatDistanceToNow(new Date(message.createdAt), {addSuffix: true})}</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    contentText: {
        fontSize: 16,
        flex:1,
        marginRight: 8,

    },
})