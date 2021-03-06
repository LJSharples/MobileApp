import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import {
  Item,
} from 'native-base'
import { t } from 'react-native-tailwindcss';

// Load the app logo
const mblogo = require('../images/managedbill-corporate-logo.png');

export default class WelcomeScreen extends React.Component {
  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    return (
      <View style={[ t.bgBlue900, t.hFull]}>
        <View style={[t.bgWhite, t.hFull ]}>
          <Item style={[t.itemsCenter, t.mT16, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[ t.roundedLg, t.itemsCenter]}>
                <Image 
                  source={mblogo}
                />
              </View>
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT40]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                <Text style={[t.textLg, t.textGray200, t.textCenter, t.fontLight]}>Procure and manage your essential business services in a hassle free way.</Text>
              </View>
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT3]}>
            <TouchableOpacity 
              style={[t.p4, t.roundedLg, t.bgBlue100, t.itemsCenter, t.w10_12]}
              onPress={() => this.handleRoute('SignIn')}>
              <Text style={[t.textWhite, t.textLg]}>Login</Text>
            </TouchableOpacity>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              style={[t.p4, t.roundedLg, t.bgGray500, t.itemsCenter, t.w10_12]}
              onPress={() => this.handleRoute('SignUp')}>
              <Text style={[t.textWhite, t.textLg]}>Register</Text>
            </TouchableOpacity>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
            <TouchableOpacity 
              style={[t.p2, t.roundedLg, t.itemsCenter, t.w10_12]}
              onPress={() => this.handleRoute('ForgetPassword')}>
              <Text style={[t.textBlue100, t.textLg]}>Forgot Your Password?</Text>
            </TouchableOpacity>
          </Item>
          <Item style={[t.itemsCenter, t.mT40, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.wFull, t.itemsCenter]}>
                <Text style={[t.textXs, t.textGray500, t.textCenter]} onPress={() => this.handleRoute('TermsConditions')}>By continuing you agree to the managedbills T&C's.</Text>
              </View>
            </Item>
          </Item>
        </View>
      </View>
    )
  }
}