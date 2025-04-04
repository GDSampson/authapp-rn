import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/colors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { deleteMessage, fetchMessage, updateMessage } from '@/utils/api';
import * as Burnt from 'burnt';
import { ErrorState } from '@/components/common/ErrorState';

// reusable button component for actions in the message view
const IconButton = ({
    icon,
    onPress,
    disabled,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    disabled?: boolean;
}) => {
    const colorScheme = useColorScheme();

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.iconButton}>
            <Ionicons
                name={icon}
                size={24}
                color={disabled ? '#999': COLORS.primary}
            />
        </TouchableOpacity>
    );
};


const Page = () => {
    // get message id from url params
    const { id } = useLocalSearchParams();
    const router = useRouter();
    // get current user id for permission checks
    const { userId } = useAuth();
    const queryClient = useQueryClient();
    // state for editing functionality
    const [editedText, setEditedText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // fetch message data based on id
    const { data: message, isLoading, isError, refetch } = useQuery({
        queryKey: ['message', id],
        queryFn: () => fetchMessage(Number(id)),
    })

    // set initial text when message loads
    useEffect(() => {
        if (message?.data?.content) {
            setEditedText(message.data.content);
        }
    }, [message?.data?.content]);

    // mutation for updating message content
    const updateMutation = useMutation({
        mutationFn: () => updateMessage(Number(id), { content: editedText }),
        onSuccess: ({ data }) => {
            // invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['messages', id] });
            setIsEditing(false);
            if (!data) {
                Burnt.alert({
                    title: 'Failed to update Message',
                    duration: 3,
                });

            } else {
                Burnt.toast({
                    title: 'Message updated successfully',
                    duration: 3,
                })
            }
        },
    });

    // mutation for deleting messages
    const deleteMutation = useMutation({
        mutationFn: () => deleteMessage(Number(id)),
        onSuccess: () => {
            // invalidate messages list query to update ui
            queryClient.invalidateQueries({queryKey: ['messages']})
           
                Burnt.toast({
                    title: 'Message deleted successfully',
                    duration: 3,
                })
            
            router.back();
        }

    })

    // loading and error states
    if (isLoading) return <ActivityIndicator style={styles.center} />;
    if (isError) return <ErrorState onRetry={refetch} message="Failed to load message" />;
    if (!message) return <ErrorState onRetry={refetch} message="Message not found" />;

    // check if current user owns this message
    const isOwnMessage = message.data?.userId === userId;

    // handler for update button press
    const handleUpdate = () => {
        if (editedText.trim() !== message.data?.content) {
            updateMutation.mutate();
        } else {
            setIsEditing(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* configure screen header */}
            <Stack.Screen
                options={{
                    title: `Message # ${id}`
                }}
            />
            {/* conditional rendering based on message ownership */}
            {isOwnMessage ? (
                <View style={[styles.ownMessageContainer]}>
                    {isEditing ? (
                        <>
                            {/* editing mode view */}
                            <TextInput
                                value={editedText}
                                onChangeText={setEditedText}
                                style={styles.input}
                                multiline
                                autoFocus
                            />
                             <View style={styles.controls}>
                                <IconButton icon="checkmark" onPress={() => handleUpdate} />
                                <IconButton
                                    icon="close"
                                    onPress={() => setIsEditing(false)}/>

                            </View>
                        </>
                    ) : (
                        <>
                            {/* display mode view */}
                            <Text style={[styles.messageText]}>{message.data?.content}</Text>
                            <View style={styles.controls}>
                                <IconButton icon="pencil" onPress={() => setIsEditing(true)} />
                                <IconButton
                                    icon="trash"
                                    onPress={() => deleteMutation.mutate()}
                                    disabled={deleteMutation.isPending}
                                />

                            </View>
                        </>
                    )}
                </View>
            ) : (
                // view for messages from other users
                <View style={styles.otherMessageContainer}>
                    <Text style={styles.messageText}>{message.data?.content}</Text>
                </View>
            )}
        </View>
    )
}

export default Page

// styles for the message detail page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    ownMessageContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },
    otherMessageContainer: {
        backgroundColor: '#ccc',
        padding: 16,
        borderRadius: 12,
      },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        gap: 8,
    },
    input: {
        fontSize: 16,
        lineHeight: 24,
        backgroundColor: '#FFFFFF',
      },
      iconButton: {
        padding: 8,
      },
})