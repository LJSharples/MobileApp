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

export default class RegisterUserPhone extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }

    render(){
        if(this.props.currentStep !== 2){
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
                            <Text style={[ t.text2xl, t.textBlue600]}> Add a phone number</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent, t.justifyCenter, t.itemsCenter]}>
                            <Text style={[t.textBlue600]}>Add a mobile phone number to recieve text notifications to never miss a contract renewal date afain!</Text>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Mobile Phone Number"
                                value={this.props.phoneNumber}
                                onChange={(value) => this.update('phoneNumber', value)}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}