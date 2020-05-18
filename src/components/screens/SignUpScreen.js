import React from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import {
  Container,
  Item,
  Input,
  Icon
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Auth from '@aws-amplify/auth';
import { t } from 'react-native-tailwindcss';

//Signup sections
import UserDetails from '../forms/RegisterUserDetails';
import UserPhone from '../forms/RegisterUserPhone';
import CompanyDetails from '../forms/RegisterCompanyDetails';
import CompanyAddress from '../forms/RegisterCompanyAddress';
import RefferalDetails from '../forms/RegisterRefferalDetails';
import TermsConditions from '../forms/RegisterTermsConditions';
import ConfirmCode from '../forms/RegisterConfirmCode';

export default class SignUpScreen extends React.Component {
  constructor(){
    super();
    this.onChangeText = this.onChangeText.bind(this);
  }
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companyNumber: '',
    industrySector: '',
    buildingNumber: '',
    postCode: '',
    refferalCode: '',
    isHidden: false,
    currentStep: 1,
    authCode: '',
  }
  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  onUpdate = (key, value) => {
    this.setState({
      [key]: value
    })
  };
  // Methods for logo animation
  componentDidMount() {
  }

  // Test current step with ternary
  // _next and _previous functions will be called on button click
  _next() {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 7? 8: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
    console.log(this.state);
  }

  get nextButton(){
    if(this.state.currentStep < 6){
      return (
        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgGray500, t.wFull, t.itemsCenter]}>
            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <TouchableOpacity
                onPress={() => this._next()} 
                >
                  <Text style={[t.textWhite, t.textXl]}>Continue</Text>
              </TouchableOpacity>
            </Item>
          </View>
        </Item>
      )
    } else{
      if(this.state.currentStep == 6){
        return (
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgGray500, t.wFull, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
              <TouchableOpacity
                  onPress={() => this.signUp()} 
                  >
                    <Text style={[t.textWhite, t.textXl]}>Agree</Text>
                </TouchableOpacity>
                
              </Item>
            </View>
          </Item>
        )
      }
    }
  }

  get authCode(){
    if(this.state.currentStep == 7){
      return (
        <View>
          <Item style={[t.bgWhite, t.borderTransparent]}>
              <View style={[ t.pX4, t.pY4, t.wFull]}>
                <Item>
                  <Input
                    style={[t.alignCenter, t.bgGray100]}
                    id="confirmationCode"
                    name="confirmationCode"
                    placeholder="Confirmation code"
                    onChangeText={value => this.onChangeText('authCode', value)}/>
                </Item>
              </View>
          </Item>
          <Item style={[t.bgWhite, t.borderTransparent]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgGray500, t.wFull, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <TouchableOpacity
                  onPress={() => this.confirmSignUp()}>
                  <Text>
                    Confirm Sign Up
                  </Text>
                </TouchableOpacity>
              </Item>
            </View>
          </Item>
          <Item style={[t.bgWhite, t.borderTransparent]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgGray500, t.wFull, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <TouchableOpacity
                  onPress={() => this.resendSignUp()}>
                  <Text>
                    Resend code
                  </Text>
                </TouchableOpacity>
              </Item>
            </View>
          </Item>
        </View>
      )
    }
  }
    
  _prev() {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  get backButton(){
    if(this.state.currentStep !== 1){
      return (
        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.wFull, t.itemsCenter]}>
            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
            <TouchableOpacity
                onPress={() => this._prev()} 
                >
                  <Text style={[t.textBlue600, t.textXl]}>Back</Text>
              </TouchableOpacity>
            </Item>
          </View>
        </Item>
      )
    } else {
      return null;
    }
  }

  async signUp() {
    const { firstName, lastName, password, email, phoneNumber, companyName, companyNumber, industrySector, buildingNumber, postCode } = this.state
    // rename variable to conform with Amplify Auth field phone attribute
    const username = email
    const phone_number = `+44 ${phoneNumber}`
    console.log(username);
    this.onUpdate("username", username);
    const company_name = companyName
    await Auth.signUp({
      username,
      password,
      attributes: { 
        'email': email,
        'custom:first_name': firstName,
        'custom:last_name': lastName,
        'custom:company_name': company_name,
        'custom:company_number': companyNumber,
        'custom:industry_sector': industrySector,
        'custom:building_number': buildingNumber,
        'custom:post_code': postCode
      }
    })
    .then(() => {
      console.log('sign up successful!')
      Alert.alert('Enter the confirmation code you received.')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error when signing up: ', err)
        Alert.alert('Error when signing up: ', err)
      } else {
        console.log('Error when signing up: ', err.message)
        Alert.alert('Error when signing up: ', err.message)
      }
    })
  }
  
  // Confirm users and redirect them to the SignIn page
  async confirmSignUp() {
    const { username, authCode } = this.state
    await Auth.confirmSignUp(username, authCode)
    .then(() => {
      this.props.navigation.navigate('SignIn')
      console.log('Confirm sign up successful')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error when entering confirmation code: ', err)
        Alert.alert('Error when entering confirmation code: ', err)
      } else {
        console.log('Error when entering confirmation code: ', err.message)
        Alert.alert('Error when entering confirmation code: ', err.message)
      }
    })
  }
  
  // Resend code if not received already
  async resendSignUp() {
    const { username } = this.state
    await Auth.resendSignUp(username)
    .then(() => console.log('Confirmation code resent successfully'))
    .catch(err => {
      if (! err.message) {
        console.log('Error requesting new confirmation code: ', err)
        Alert.alert('Error requesting new confirmation code: ', err)
      } else {
        console.log('Error requesting new confirmation code: ', err.message)
        Alert.alert('Error requesting new confirmation code: ', err.message)
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={[t.flex1]}>
        <StatusBar/>
        <KeyboardAvoidingView 
          style={[t.flex1]} 
          behavior='padding' 
          enabled>
          <TouchableWithoutFeedback style={[t.flex1]} onPress={Keyboard.dismiss}>
            <ScrollView
              style={[t.hFull, t.bgWhite]}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                  <UserDetails
                    currentStep={this.state.currentStep}
                    onUpdate={this.onUpdate}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    email={this.state.email}/>
                  <UserPhone
                    currentStep={this.state.currentStep}
                    phoneNumber={this.state.phoneNumber}
                    onUpdate={this.onUpdate}/>
                  <CompanyDetails
                    currentStep={this.state.currentStep}
                    companyName={this.state.companyName}
                    companyNumber={this.state.companyNumber}
                    industrySector={this.state.industrySector}
                    onUpdate={this.onUpdate}/>
                  <CompanyAddress
                    currentStep={this.state.currentStep}
                    buildingNumber={this.state.buildingNumber}
                    postCode={this.state.postCode}
                    onUpdate={this.onUpdate}/>
                  <RefferalDetails
                    currentStep={this.state.currentStep}
                    refferalCode={this.state.refferalCode}
                    onUpdate={this.onUpdate}/>
                  <TermsConditions
                    currentStep={this.state.currentStep}
                    onUpdate={this.onUpdate}/>
                  <ConfirmCode
                    currentStep={this.state.currentStep}/>
                </Item>
                {this.nextButton}
                {this.authCode}
                {this.backButton}
              </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

