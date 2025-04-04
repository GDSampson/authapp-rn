import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { COLORS } from '@/utils/colors';
import { createMessage } from '@/utils/api';
import * as Burnt from 'burnt';

// component for creating new message
const newMessagePage = () => {
    // state to handle message input
    const [message, setMessage] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();

    // mutation hook for sending message
    const { mutate: sendMessage, isPending } = useMutation({
        // function to create message
        mutationFn: async () => {
            return createMessage({ content: message });
        },
        // handle successful message creation
        onSuccess: () => {
            // invalidate messages query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            // show success toast notification
            Burnt.toast({
                title: 'Message sent successfully',
                duration: 3,
            });
            // navigate back after sending
            router.back();
        },
        // handle error when message fails to send
        onError: (error) => {
            console.error('Failed to send message:', error);
            // show error alert notification
            Burnt.alert({
                title: 'Failed to send message',
                message: error.message,
                duration: 3,
            });
        },
    });

    // handler for submit button press
    const handleSubmit = () => {
        sendMessage();
    }

    return (
        // adjust view based on keyboard appearance
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.inputContainer}>
                {/* text input for message content */}
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message..."
                    multiline
                    autoFocus
                    maxLength={500}
                />
                {/* button to send message */}
                <TouchableOpacity
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                    disabled={!message.trim() || isPending}
                    onPress={handleSubmit}
                >
                    {/* show loading indicator or send text */}
                    {isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send</Text>
                    )}

                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};

export default newMessagePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        padding: 16,
        gap: 10,
        borderTopColor: '#eee',

    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        fontSize: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#a9a9a9',
        color: '#000',
        minHeight: 200,
        marginBottom: 20,

    },
    sendButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
})