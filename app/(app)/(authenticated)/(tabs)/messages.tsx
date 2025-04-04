import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fab from '@/components/fab/fab'

const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Messages</Text>
      <Fab/>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})