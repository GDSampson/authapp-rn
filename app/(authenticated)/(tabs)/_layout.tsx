import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const Layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name='messages'/>
        <Tabs.Screen name='profile'/>
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({})