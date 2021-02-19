import React from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import { t } from 'react-native-tailwindcss';
import {
  Item,
  Input
} from 'native-base'

// Load the app logo
const logo = require('../images/managedbill-corporate-logo.png')

export default class RegisterUserDetails extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }
    render(){
        if(this.props.currentStep !== 1){
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
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={this.props.username}
                                autoCapitalize='none'
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChange={(value) => this.update('username', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="email"
                                name="email"
                                placeholder="Email"
                                keyboardType = 'email-address'
                                value={this.props.email}
                                onChange={(value) => this.update('email', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="password"
                                name="password"
                                placeholder='Password'
                                returnKeyType='go'
                                autoCapitalize='none'
                                autoCorrect={false}
                                secureTextEntry={true}
                                type="password"
                                onChange={(value) => this.update('password', value)}/>
                        </Item>
                    </Item>
                </View>
            </View>
        )
    }
}