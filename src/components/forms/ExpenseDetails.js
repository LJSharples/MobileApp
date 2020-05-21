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
  Switch,
  Image
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

//get expense breakdown
import ExpenseBreakdown from '../forms/ExpenseBreakDown';

// Load the app logo
const graph = require('../images/Graph.png');

export default class ExpenseDetails extends React.Component {
    state = {
        username: '',
        company_name: '',
        year: '2020',
        rowVisible: false,
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
        selectedYear: '',
        selectedExpenses: []
    };

    expandRow(month, year){
        this.setState({
            rowVisible: true,
            selectedMonth: month,
            selectedYear: year
        })
    }

    closeRow(){
        this.setState({
            rowVisible: false
        })
    }

    render(){
        return (
            <View style={[t.flex1]}>
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.mT5,]}>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
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
                                        <Text key={i} onPress={() => this.expandRow(s, this.state.year)} style={[t.textXl]}>{s} - </Text>
                                    </Item>
                                    <Item style={[t.borderTransparent, t.itemsEnd, t.justifyEnd]}>
                                        <Text key={i} onPress={() => this.expandRow(s, this.state.year)} style={[t.textXl]}>£{this.state.monthCost}</Text>
                                    </Item>
                                    <Modal
                                        animationType="slide" // fade
                                        transparent={false}
                                        visible={this.state.rowVisible}>
                                        <View style={[ t.flex1 ]}>
                                            <ScrollView>
                                            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
                                                <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w3_4, t.wAuto, t.itemsCenter]}>
                                                    <Item style={[t.pX2, t.pY8, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                        <Text style={[ t.textXl]}> {this.state.selectedMonth} breakdown </Text>
                                                    </Item>
                                                </View>
                                                <View style={[t.w5]}/>
                                                <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_4, t.itemsEnd]}>
                                                    <Item style={[t.pX2, t.pY2, t.pt4, t.itemsEnd, t.justifyEnd, t.borderTransparent]}>
                                                        <TouchableOpacity
                                                        onPress={() => this.closeRow()} 
                                                        >
                                                        <Ionicons name="ios-close"/>
                                                        </TouchableOpacity>
                                                    </Item>
                                                </View>
                                            </Item>
                                            <ExpenseBreakdown
                                                monthCost={this.state.monthCost}
                                                selectedMonth={this.state.selectedMonth}
                                                selectedYear={this.state.selectedYear}
                                                services={this.props.services}
                                                updateNotice="Your electric rates have risen 7%"/>
                                            </ScrollView>
                                        </View>
                                    </Modal>
                                </View>
                                </>
                            )
                        }
                        </View>
                    </View>
                </Item>
            </View>
        )
    }
}