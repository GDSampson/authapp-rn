import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview';

const Page = () => {
  return (
    <WebView style={styles.container} source={{uri: 'https://www.privacypolicies.com/generic/'}}/>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex:1,
    }
})