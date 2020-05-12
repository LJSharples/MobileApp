import React from 'react';
import {
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Item,
    Platform,
} from 'react-native';
import { t } from 'react-native-tailwindcss';


export default class ExpandableList extends React.Component {
    render() {
        return (
            <View style={t.mT5}>
                <Item style={[t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull, t.bgWhite]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> {this.props.month} - {this.props.year}</Text>
                        </Item>
                        <Item style={[ t.borderTransparent, t.mT5, t.alignCenter, t.justifyCenter, t.itemsCenter]}>
                            <Text>{this.props.notice}</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent]}/>
                    </View>
                </Item>
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.wFull, t.hFull]}>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>   
                        { this.props.services.map((item, key) => {
                            return (
                                <View key={key} style={[t.roundedLg, t.w1_2, t.bgYellow500, t.wAuto, t.mT2, t.itemsCenter]}>
                                    <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                        
                                    <Text>{item.name}</Text>
                                    </Item>
                                </View>
                            );
                        })} 
                    </View>
                </Item>
            </View>
        );
      }
}