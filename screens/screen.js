import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const screen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>screen</Text>
    </View>
  )
}

export default screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#D32F2F',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
})