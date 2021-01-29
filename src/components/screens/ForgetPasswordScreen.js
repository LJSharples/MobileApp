import React from 'react'
import {
  TouchableOpacity,
  ImageBackground,
  Text,
  View,
  Alert,
} from 'react-native'
import {
  Item,
  Input,
} from 'native-base'
import Auth from '@aws-amplify/auth';
import { t } from 'react-native-tailwindcss';

// Load the app logo
const background = require('../images/background.png')

export default class ForgetPasswordScreen extends React.Component {
  state = {
    username: '',
    authCode: '',
    newPassword: '',
  }

  onChangeText(key, value){
    this.setState({[key]: value});
  }

  // Request a new password
  async forgotPassword() {
    const { username } = this.state
    await Auth.forgotPassword(username)
    .then(data => console.log('New code sent', data))
    .catch(err => {
      if (! err.message) {
        console.log('Error while setting up the new password: ', err)
        Alert.alert('Error while setting up the new password: ', err)
      } else {
        console.log('Error while setting up the new password: ', err.message)
        Alert.alert('Error while setting up the new password: ', err.message)
      }
    })
  }

  // Upon confirmation redirect the user to the Sign In page
  async forgotPasswordSubmit() {
    const { username, authCode, newPassword } = this.state
    await Auth.forgotPasswordSubmit(username, authCode, newPassword)
    .then(() => {
      this.props.navigation.navigate('SignIn')
      console.log('the New password submitted successfully')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error while confirming the new password: ', err)
        Alert.alert('Error while confirming the new password: ', err)
      } else {
        console.log('Error while confirming the new password: ', err.message)
        Alert.alert('Error while confirming the new password: ', err.message)
      }
    })
  }

  render() {
    return (
      <ImageBackground source={background} style= {[ t.flex1]}>
        <View style={[t.mT5,t.alignCenter, t.borderTransparent, t.pX3, t.pY4, t.pt8, t.wFull]}>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <Text style={[ t.text3xl, t.fontSemibold, t.textWhite]}>Forgot My Password</Text>
          </Item>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <Text style={[ t.textXl, t.textWhite]}>Reset password here</Text>
          </Item>
        </View>
        <View style={[t.mT5,t.alignCenter, t.borderTransparent, t.pX3, t.pY4, t.pt8, t.wFull]}>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <Input
              style={[ t.border, t.borderGray500, t.p2, t.roundedLg]}
              placeholder='Username'
              placeholderTextColor='#adb4bc'
              keyboardType={'email-address'}
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={value => this.onChangeText('username', value)}
            />
          </Item>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <TouchableOpacity
              onPress={() => this.forgotPassword()}
              style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.wFull, t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
              <Text style={[t.textBlue100]}>
                Send Code
              </Text>
            </TouchableOpacity>
          </Item>
        </View>
        <View style={[t.mT5,t.alignCenter, t.borderTransparent, t.pX3, t.pY4, t.pt8, t.wFull]}>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <Input
              placeholder='New password'
              placeholderTextColor='#adb4bc'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
              onChangeText={value => this.onChangeText('newPassword', value)}
            />
          </Item>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <Input
              placeholder='Confirmation code'
              placeholderTextColor='#adb4bc'
              keyboardType={'numeric'}
              returnKeyType='done'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={false}
              ref='SecondInput'
              onChangeText={value => this.onChangeText('authCode', value)}
            />
          </Item>
          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <TouchableOpacity
              onPress={() => this.forgotPasswordSubmit()}
              style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.wFull, t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
              <Text style={[t.textBlue100]}>
                Confirm the new password
              </Text>
            </TouchableOpacity>
          </Item>
        </View>
      </ImageBackground>
    );
  }
}