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

export default class RegisterCompanyDetails extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }

    render(){
        if(this.props.currentStep !== 3){
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
                            <Text style={[t.textBlue600]}>Now it's time to get to know your business and its needs!</Text>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY2, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="companyName"
                                name="companyName"
                                placeholder="Company Name"
                                value={this.props.companyName}
                                onChange={(value) => this.update('companyName', value)}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY2, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="companyNumber"
                                name="companyNumber"
                                placeholder="Company number (Optional)"
                                value={this.props.companyNumber}
                                onChange={(value) => this.update('companyNumber', value)}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY2, t.wFull]}>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="industrySector"
                                name="industrySector"
                                placeholder="Industry Sector"
                                value={this.props.industrySector}
                                onChange={(value) => this.update('industrySector', value)}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}