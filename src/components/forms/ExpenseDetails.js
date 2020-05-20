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
    state = {
        username: '',
        company_name: '',
        year: '2020',
        modalVisible: false,
        monthCost: '750.23',
        services: [],
        monthNames: [
        "January",
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September",
        "October",
        "November", 
        "December"
        ],
        selectedMonth: '',
        selectedExpenses: []
    };

    render(){
        return (
            <View style={[t.flex1]}>
                <ScrollView
                style={[t.hFull]}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.mT5,]}>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                    <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                        <Text style={[ t.textXl]}> Annual Expenses</Text>
                    </Item>
                    <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                        <Image 
                        source={graph}
                        style={[t.alignCenter, t.justifyCenter]}
                        />
                    </Item>
                    </View>
                </Item>
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
                    <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                        <Text style={[ t.textXl]}> Monthly Breakdown for: {this.state.year}</Text>
                    </Item>
                    <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Text>Your annual expenses are broken down to each month:</Text>
                    </Item>
                    <View rounded>
                        {
                        this.state.monthNames.map((s, i) => 
                            <>
                            <View style={[t.roundedLg, t.pX2, t.pY2, t.pt4, t.wAuto, t.mT2, t.flexRow, t.itemsCenter, t.justifyCenter]}>
                                <Item style={[t.borderTransparent, t.itemsStart, t.justifyStart]}>
                                <Text key={i} onPress={() => this.showModal()}>{s} - </Text>
                                </Item>
                                <Item style={[t.borderTransparent, t.itemsEnd, t.justifyEnd]}>
                                <Text key={i} onPress={() => this.showModal()} style={[t.textRight]}>£{this.state.monthCost}</Text>
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