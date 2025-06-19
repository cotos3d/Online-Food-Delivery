import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'

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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
})