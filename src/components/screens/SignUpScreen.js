import React from 'react'
import {
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  View,
  Alert,
} from 'react-native';
import {
  Item,
  Input
} from 'native-base';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { t } from 'react-native-tailwindcss';
import { addProfile, addCompany} from '../../graphql/mutations';

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
        <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t._mT4]}>
          <TouchableOpacity 
            onPress={() => this._next()}
            style={[t.p4, t.roundedLg, t.bgBlue100, t.itemsCenter, t.w10_12]}
            >
              <Text style={[t.textWhite, t.textLg]}>Continue</Text>
          </TouchableOpacity>
        </Item>
      )
    } else{
      if(this.state.currentStep == 6){
        return (
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              onPress={() => this.signUp()}
              style={[t.p4, t.roundedLg, t.bgBlue100, t.itemsCenter, t.w10_12]}
              >
                <Text style={[t.textWhite, t.textLg]}>Agree</Text>
            </TouchableOpacity>
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
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              onPress={() => this.confirmSignUp()}
              style={[t.p4, t.roundedLg, t.bgBlue100, t.itemsCenter, t.w10_12]}
              >
                <Text style={[t.textWhite, t.textLg]}>Confirm Sign Up</Text>
            </TouchableOpacity>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              onPress={() => this.resendSignUp()}
              style={[t.p4, t.roundedLg, t.bgBlue100, t.itemsCenter, t.w10_12]}
              >
                <Text style={[t.textWhite, t.textLg]}>Resend code</Text>
            </TouchableOpacity>
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
        <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
          <TouchableOpacity 
            onPress={() => this._prev()}
            style={[t.p4, t.roundedLg, t.bgBlue100, t.itemsCenter, t.w10_12]}
            >
              <Text style={[t.textWhite, t.textLg]}>Back</Text>
          </TouchableOpacity>
        </Item>
      )
    } else {
      return null;
    }
  }

  async signUp() {
    if(this.state.username === ''){
      Alert.alert('Registration error:', 'You have not provide all required information.')
    } else {
      let currentStep = this.state.currentStep
      const { username, firstName, lastName, password, email, phoneNumber, companyName, companyNumber, industrySector, buildingNumber, postCode } = this.state
      // rename variable to conform with Amplify Auth field phone attribute
      this.onUpdate("username", username);
      await Auth.signUp({
        username,
        password,
        attributes: { 
          'email': email,
        }
      })
      .then(() => {
        console.log('sign up successful!')
        Alert.alert('Please enter the confirmation code you received.')
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
      
      try {
        await API.graphql(graphqlOperation(addProfile, {
          user_name: username,
          full_name: firstName + " " + lastName,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber
        }));
      } catch (err) {
          console.log("Error:")
          console.log(err);
      }

      try{
        await API.graphql(graphqlOperation(addCompany, {
          user_name: username,
          company_name: companyName,
          company_number: companyNumber,
          address1: buildingNumber,
          postcode: postCode,
          industry: industrySector
        }));
      }catch(err){
      }

      currentStep = currentStep >= 7? 8: currentStep + 1
      this.setState({
        currentStep: currentStep
      })
    }
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
      <ScrollView
        style={[t.hFull, t.bgWhite]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <UserDetails
          currentStep={this.state.currentStep}
          onUpdate={this.onUpdate}
          username={this.state.username}
          email={this.state.email}/>
        <UserPhone
          currentStep={this.state.currentStep}
          phoneNumber={this.state.phoneNumber}
          firstName={this.state.firstName}
          lastName={this.state.lastName}
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
        {this.nextButton}
        {this.authCode}
        {this.backButton}
      </ScrollView>
    )
  }
}

