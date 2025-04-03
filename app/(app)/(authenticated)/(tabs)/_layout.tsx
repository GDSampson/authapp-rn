import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { COLORS } from '@/utils/colors'
import {FontAwesome6 } from '@expo/vector-icons';

const Layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarStyle:{
        backgroundColor: COLORS.background,
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#666',
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen name='messages' options={{tabBarLabel: 'Message',
        tabBarIcon: ({color, size}) => <FontAwesome6 name='message' size={size} color={color}/>
      }} />
      <Tabs.Screen name='profile' options={{tabBarLabel: 'Profile',
        tabBarIcon: ({color, size}) => <FontAwesome6 name='user' size={size} color={color}/>
      }}/>
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({})