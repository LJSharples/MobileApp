import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input,
  DatePicker
} from 'native-base'
import { t } from 'react-native-tailwindcss';

// Load the app logo
const logo = require('../images/splash-welcome.png');
const mblogo = require('../images/managedbill-corporate-logo.png');

export default class WelcomeScreen extends React.Component {
  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    return (
      <View style={[ t.bgBlue900, t.hFull]}>
        <Item style={[t.pX, t.pT, t.alignCenter]}>
          <Image 
            source={logo}
          />
        </Item>
        <View style={[t.bgWhite, t.hFull, t.roundedLg ]}>
        <Item style={[t.pX, t.pT, t.alignCenter]}>
          <Image 
            source={mblogo}
          />
        </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgBlue500, t.itemsCenter]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('SignUp')}>
                  <Text style={[t.textWhite, t.textXl]}>Register a new account</Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
              <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.itemsCenter]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('SignIn')}>
                  <Text style={[t.textBlue500, t.textXl]}>Already got an account?</Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Item>
        </View>
      </View>
    )
  }
}