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
  Animated,
} from 'react-native'
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

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
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(0),  
    isHidden: false
  }
  componentDidMount() {
    this.fadeIn()
  }
  fadeIn() {
    Animated.timing(
      this.state.fadeIn,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
    this.setState({isHidden: true})
  }
  fadeOut() {
    Animated.timing(
      this.state.fadeOut,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
    this.setState({isHidden: false})
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
    let { fadeOut, fadeIn, isHidden } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar/>
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback 
            style={styles.container} 
            onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* App Logo */}
              <View style={styles.logoContainer}>
                {
                  isHidden ?
                  <Animated.Image 
                      source={logo} 
                      style={{ opacity: fadeIn, width: 250, height: 198 }}/>
                  :
                  <Animated.Image 
                      source={logo} 
                      style={{ opacity: fadeOut, width: 168, height: 127 }}/>
                }
              </View>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-person" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Username'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onSubmitEditing={(event) => {this.refs.SecondInput._root.focus()}}
                      onChangeText={value => this.onChangeText('username', value)}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder='Password'
                      placeholderTextColor='#adb4bc'
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password', value)}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.signIn()}
                    style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => this.handleRoute('ForgetPassword')}
                    style={styles.buttonStyle}>
                    <Text style={styles.textStyle} onPress={() => this.handleRoute('ForgetPassword')}>Forget password ?</Text>
                  </TouchableOpacity>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    marginTop: Constants.statusBarHeight
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 200,
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  itemStyle: {
    marginBottom: 20,
  },
  iconStyle: {
    color: '#fff',
    fontSize: 30,
    marginRight: 15
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#adb4bc',
    padding: 14,
    marginBottom: 20,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 500,
    bottom: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
})