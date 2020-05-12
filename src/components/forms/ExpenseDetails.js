import React from 'react'
import {
  StyleSheet,
  View,
  Text,
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


export default class ExpenseDetails extends React.Component {
    render(){
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
                                        {item.contracts.items.map((unit,key2) => 
                                        <Text key={key2}>
                                            {unit.expenses.items.map((cost,key3) => 
                                            <Text key={key3}>
                                                {item.name}: £{cost.value}
                                            </Text>
                                            )}
                                        </Text>
                                        )}
                                    </Item>
                                </View>
                            );
                        })} 
                    </View>
                </Item>
            </View>
        )
    }
}