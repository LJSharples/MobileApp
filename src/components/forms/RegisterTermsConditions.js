import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  Modal,
  FlatList,
  Switch
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input,
  DatePicker
} from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';

// Load the app logo
const logo = require('../images/managedbill-corporate-logo.png')

export default class RegisterTermsConditions extends React.Component {
    render(){
        if(this.props.currentStep !== 7){
            return null;
        }

        return (
            <View>
                <Item style={[t.bgWhite, t.borderTransparent]}>

                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent, t. justifyCenter]}>
                            <Text style={[ t.text2xl, t.textBlue600]}> Terms & Conditions</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent, t.justifyCenter, t.itemsCenter]}>
                            <Text style={[t.textBlue600]}>Have you been reffered by somebody to try out Managed Bills?</Text>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}