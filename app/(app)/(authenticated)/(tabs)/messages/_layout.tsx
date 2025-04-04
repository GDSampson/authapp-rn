import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { COLORS } from '@/utils/colors'

const Layout = () => {
    return (
        <Stack screenOptions={{
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: COLORS.background,
            },
        }}>
            <Stack.Screen name='index' options={{ title: 'Messages' }} />
        </Stack>
    )
}

export default Layout

const styles = StyleSheet.create({})