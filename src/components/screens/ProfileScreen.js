import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

export default class ProfileScreen extends React.Component {

  render() {
    Auth.currentAuthenticatedUser()
    .then(user => console.log({ user }))
    .catch(err => console.log(err))
    return (
      <View style={styles.container}>
        <Text value={Auth.getModuleName}>Your  Profile</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aa73b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
})