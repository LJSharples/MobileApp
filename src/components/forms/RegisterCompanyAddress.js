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
const logo = require('../images/Building.png')

export default class RegisterCompanyAddress extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }

    render(){
        if(this.props.currentStep !== 4){
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
                            <Text style={[ t.text2xl, t.textBlue600]}> Company Details</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent, t.justifyCenter, t.itemsCenter]}>
                            <Text style={[t.textBlue600]}>Where is your business located?</Text>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="buildingNumber"
                                name="buildingNumber"
                                placeholder="Building Number"
                                value={this.props.buildingNumber}
                                onChange={(value) => this.update('buildingNumber', value)}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="postCode"
                                name="postCode"
                                placeholder="Post Code"
                                value={this.props.postCode}
                                onChange={(value) => this.update('postCode', value)}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}