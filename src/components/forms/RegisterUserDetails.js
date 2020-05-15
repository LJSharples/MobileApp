import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
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
const logo = require('../images/UserIcon.png')

export default class RegisterUserDetails extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }
    render(){
        if(this.props.currentStep !== 1){
            return null;
        }

        return (
            <View>
                <Item style={[t.pX4, t.pT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                    <Image 
                        source={logo}
                    />
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent, t. justifyCenter]}>
                            <Text style={[ t.text2xl, t.textBlue600]}> About you</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent, t.justifyCenter]}>
                            <Text style={[t.textBlue600]}>First let's get to know a bit about you!</Text>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY2, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value={this.props.firstName}
                                autoCapitalize='none'
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChange={(value) => this.update('firstName', value)}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY2, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                value={this.props.lastName}
                                onChange={(value) => this.update('lastName', value)}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY2, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                value={this.props.email}
                                onChange={(value) => this.update('email', value)}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}