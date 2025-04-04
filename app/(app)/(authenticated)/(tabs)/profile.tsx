import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, uploadImage } from '@/utils/api';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/utils/colors';

let API_URL = process.env.EXPO_PUBLIC_API_URL;

const Page = () => {
  const { onLogout, token } = useAuth();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
  })

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  })

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled) {
      uploadImageMutation.mutate({
        uri: result.assets[0].uri,
        token: token || '',
      })
    }
  }





  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handleSelectImage} style={styles.avatarContainer}>
        {user?.data?.avatar ? (
          <Image source={{ uri: `${API_URL}${user.data.avatar}` }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {user?.data?.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <Text style={styles.changePhotoText}>Change Avatar</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user?.data?.name || 'No name'}</Text>
        <Text style={styles.email}>{user?.data?.email || 'No email'}</Text>
      </View>
      <Button title='Logout' onPress={onLogout} />
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 50,
    color: '#fff',
  },
  changePhotoText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})