import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native'
import { t } from 'react-native-tailwindcss';
import {
  Item,
  Input
} from 'native-base'

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

// Load the app logo
const mblogo = require('../images/managedbill-corporate-logo.png');

export default class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Sign in users with Auth
  async signIn() {
    if(this.state.username === '' || this.state.password === ''){
      Alert.alert('Login error:', 'You must enter a username or a password to login.')
    } else {
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
  }

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }

  render() {
    return (
      <View style={[ t.bgBlue900, t.hFull]}>
        <View style={[t.bgWhite, t.hFull ]}>
            <Item style={[ t.mT40, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                <Image 
                  source={mblogo}
                  style={[ t.objectContain]}
                />
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                <Text style={[t.textLg, t.textGray500, t.textCenter]}>Please enter your username and password to get started.</Text>
              </View>
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
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
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
              <Input
                style={[t.alignCenter, t.bgGray100]}
                placeholder='Password'
                returnKeyType='go'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                ref='SecondInput'
                type="password"
                onChangeText={value => this.onChangeText('password', value)}
              />
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              onPress={() => this.signIn()}
              style={[t.p4, t.roundedLg, t.bgBlue600, t.itemsCenter, t.w10_12]}
              >
                <Text style={[t.textWhite, t.textLg]}>Login</Text>
            </TouchableOpacity>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              onPress={() => this.handleRoute('SignUp')}
              style={[t.p4, t.roundedLg, t.bgBlue600, t.itemsCenter, t.w10_12]}
              >
                <Text style={[t.textWhite, t.textLg]}>Register</Text>
            </TouchableOpacity>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT20]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.wFull, t.itemsCenter]}>
                <Text style={[t.textXs, t.textGray500, t.textCenter]}>By continuing you agree to the managedbills T&C's.</Text>
              </View>
            </Item>
          </Item>
        </View>
      </View>
    )
  }
}