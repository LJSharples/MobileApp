import React, { Component} from "react"
import {
  Image,
} from 'react-native'
import {
  Item,
} from 'native-base';
import { t } from 'react-native-tailwindcss';

const mblogo = require('../images/managedbill-corporate-logo.png');

export default class Header extends Component{
    render(){
        return (
            <Item style={[ t.mT12, t.mB6, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                <Image 
                    source={mblogo}
                    style={[ t.objectContain]}
                />
            </Item>
        )
    }
}