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
        <View style={[t.bgWhite, t.hFull ]}>
          <Item style={[t.pX, t.mT40, t.alignCenter, t.borderTransparent]}>
            <Image 
              source={mblogo}
            />
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                <Text style={[t.textLg, t.textGray600, t.textCenter]}>Procure and manage your essential business services in a hassle free way.</Text>
              </View>
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgBlue500, t.wFull, t.itemsCenter]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('SignIn')}>
                  <Text style={[t.textWhite, t.textSm]}>Login</Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Item>
          <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.bgBlue500, t.wFull, t.itemsCenter]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('SignUp')}>
                  <Text style={[t.textWhite, t.textSm]}>Register</Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Item>
        </View>
      </View>
    )
  }
}