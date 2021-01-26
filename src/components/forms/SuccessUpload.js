import React, { Component } from "react";
import {
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    View,
    ImageBackground
} from "react-native"
import {
    Item
} from "native-base"
import { t } from 'react-native-tailwindcss';

const background = {uri: "https://i.pinimg.com/originals/e8/06/52/e80652af2c77e3a73858e16b2ffe5f9a.gif"}

export default class SuccessUpload extends React.Component {

    render(){
        return(
            <ImageBackground source={background}  style= {[ t.flex1]}>
                <Item style={[ t.mT48, t.alignCenter, t.justifyCenter, t.contentEnd,t.wFull, t.borderTransparent]}>
                    <Text style={[ t.text2xl, t.textWhite]}>Your request was successfully sent</Text>
                </Item>
                <Item style={[ t.mT64, t.alignCenter, t.justifyCenter, t.contentEnd,t.wFull, t.borderTransparent]}>
                    <TouchableOpacity
                        style={[ t.pX3, t.pY4, t.pt8, t.roundedLg, t.mT12, t.bgWhite]}
                        onPress={() =>
                            this.props.handleRoute('Services')
                        }
                    >
                        <Text style={[ t.text2xl, t.textBlue600]}>Close</Text>
                    </TouchableOpacity>
                </Item>
            </ImageBackground>
        )  
    }
}