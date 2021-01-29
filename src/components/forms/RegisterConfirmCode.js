import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import {
  Item,
} from 'native-base'
import { t } from 'react-native-tailwindcss';

export default class RegisterConfirmCode extends React.Component {
    render(){
        if(this.props.currentStep !== 2){
            return null;
        }

        return (
            <View>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent, t. justifyCenter]}>
                            <Text style={[ t.text2xl, t.textBlue600]}> Complete Signup</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent, t.justifyCenter, t.itemsCenter]}>
                            <Text style={[t.textBlue600]}>Use the confirmation email sent to your account and complete your signup</Text>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}