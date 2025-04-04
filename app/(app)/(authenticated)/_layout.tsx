import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { COLORS } from '@/utils/colors'

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: '#fff',
        contentStyle: {
          backgroundColor: COLORS.background
        },
        headerTitleStyle: {
          color: '#fff',
          fontWeight: 'bold',
        },
        
      }}>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name="new-msg"
        options={{
          presentation: 'modal',
          title: 'New Message',
          headerShown: true,
          sheetAllowedDetents: [0.3, 0.8],
          sheetGrabberVisible: true, // ios only
          sheetExpandsWhenScrolledToEdge: false, // ios
          sheetCornerRadius: 14,
          
        }}
      />
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})