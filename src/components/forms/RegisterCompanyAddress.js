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

export default class RegisterCompanyAddress extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }

    render(){
        if(this.props.currentStep !== 5){
            return null;
        }

        return (
            <View style={[ t.bgBlue900, t.hFull]}>
                <View style={[t.bgWhite, t.hFull ]}>
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
                                id="buildingNumber"
                                name="buildingNumber"
                                placeholder="Building Number"
                                value={this.props.buildingNumber}
                                onChange={(value) => this.update('buildingNumber', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="postCode"
                                name="postCode"
                                placeholder="Post Code"
                                value={this.props.postCode}
                                onChange={(value) => this.update('postCode', value)}/>
                        </Item>
                    </Item>
                </View>
            </View>
        )
    }
}