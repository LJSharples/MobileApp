import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Image,
} from 'react-native'
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';

import {
  Container,
  Item,
  Input
} from 'native-base'

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

// Load the app logo
const logo = require('../images/mb.png')

export default class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
  }
  componentDidMount() {
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Sign in users with Auth
  async signIn() {
    const { username, password } = this.state
    await Auth.signIn(username, password)
    .then(user => {
      this.setState({ user })
      this.props.navigation.navigate('Authloading')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error when signing in: ', err)
        Alert.alert('Error when signing in: ', err)
      } else {
        console.log('Error when signing in: ', err.message)
        Alert.alert('Error when signing in: ', err.message)
      }
    })
  }
  // Change Password
  passwordChange = async () => {
    await Auth.signOut()
    .then(() => {
      console.log('Sign out complete')
      this.props.navigation.navigate('PasswordScreen')
    })
    .catch(err => console.log('Error while signing out!', err))
  }
  render() {
    return (
      <View style={[ t.bgWhite, t.hFull]}>
        <Item style={[t.pX8, t.pY8, t.pT16, t.alignCenter, t.justifyCenter]}>
          <Image 
            source={logo}
            style={[t.alignCenter, t.justifyCenter]}
          />
        </Item>
        <Item style={[t.itemsCenter, t.justifyCenter]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
              <Input
                style={[t.alignCenter, t.bgGray100]}
                placeholder='Username'
                keyboardType={'email-address'}
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onSubmitEditing={(event) => {this.refs.SecondInput._root.focus()}}
                onChangeText={value => this.onChangeText('username', value)}

              />
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
              <Input
                style={[t.alignCenter, t.bgGray100]}
                placeholder='Password'
                returnKeyType='go'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                ref='SecondInput'
                onChangeText={value => this.onChangeText('password', value)}
              />
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
              <Text style={[t.textBlue500, t.textBase]}>
                If you are having trouble logging in
              </Text>
              <TouchableOpacity 
                onPress={() => this.handleRoute('ForgetPassword')}>
                <Text style={[t.textBlue500, t.textBase, t.fontBold]} onPress={() => this.handleRoute('ForgetPassword')}>Click Here</Text>
              </TouchableOpacity>
            </View>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgGray500, t.itemsCenter]}>
                <TouchableOpacity 
                  onPress={() => this.signIn()}>
                  <Text style={[t.textWhite, t.textXl]}>Log in</Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Item>
      </View>
    )
  }
}