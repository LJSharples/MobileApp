import React from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import {
  Item,
  Input,
} from 'native-base'
import { t } from 'react-native-tailwindcss';

// Load the app logo
const logo = require('../images/managedbill-corporate-logo.png')

export default class RegisterUserPhone extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }

    render(){
        if(this.props.currentStep !== 2){
            return null;
        }

        return (
            <View style={[ t.bgBlue900]}>
                <View style={[t.bgWhite, t.hFull ]}>
                    <Item style={[ t.mT16, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <Image 
                        source={logo}
                        style={[ t.objectContain]}
                        />
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                            <Text style={[t.textLg, t.textGray200, t.textCenter, t.fontLight]}>Signup and managed your business services in a hassle free way.</Text>
                        </View>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value={this.props.firstName}
                                onChange={(value) => this.update('firstName', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                value={this.props.lastName}
                                onChange={(value) => this.update('lastName', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Mobile Phone Number"
                                value={this.props.phoneNumber}
                                onChange={(value) => this.update('phoneNumber', value)}/>
                        </Item>
                    </Item>
                </View>
            </View>
        )
    }
}