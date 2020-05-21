import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  Modal,
  Image
} from 'react-native'
import {
  Item,
  Icon,
} from 'native-base'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';

// Service colors and icons
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';

const values = {
    Gas: "109.62",
    Electric: "301.87",
    Water: "121.38",
}

export default class ExpenseDetails extends React.Component {

    render(){
        return (
            <View style={[t.flex1]}>
                <ScrollView
                    style={[t.hFull]}>
                    <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            <Text style={[t.textXl, t.itemsCenter, t.pE8]}>{this.props.selectedMonth} {this.props.selectedYear} - £{this.props.monthCost}</Text>
                        </Item>
                    </View>
                    <View style={[t.roundedLg, t.itemsCenter, t.roundedLg]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            <Text style={[t.textXl, t.itemsCenter, t.pE8]}>{this.props.updateNotice}</Text>
                        </Item>
                    </View>
                    <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
                        <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.textXl]}> All Services</Text>
                            </Item>
                            <View rounded>
                                {
                                    this.props.services.map((s, i) => 
                                        <>
                                            <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.name]}>
                                            <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                                <FontAwesome5 name={serviceIcons[s.name]} size={24} color="black" style={[t.pE8]}/>
                                <Text key={i} style={[t.textXl, t.itemsCenter, t.pE8]}>{s.name} - £{values[s.name]}</Text>
                                            </Item>
                                            </View>
                                        </>
                                    )
                                }
                            </View>
                        </View>
                    </Item>
                </ScrollView>
            </View>
        )
    }
}