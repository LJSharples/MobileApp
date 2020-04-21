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


export default class CallbackDetails extends React.Component {
    render(){
        if(this.props.currentStep !== 3){
            return null;
        }

        return (
            <View>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Service Type</Text>
                        </Item>
                        <Item style={[ t.mT5, t.borderTransparent]}>
                            <Text> Add a date and time if you would like our partners to get in touch with you.</Text>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Pick a date</Text>
                        </Item>
                        <Item>
                            <DatePicker
                                style={[t.alignCenter, t.bgGray100]}
                                defaultDate={new Date()}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "green" }}
                                placeHolderTextStyle={{ color: "#a0aec0" }}
                                onDateChange={this.props.onChangeText}
                                disabled={false}
                                />
                        </Item>
                    </View>
                </Item>
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.wAuto, t.itemsCenter]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Input
                            style={[t.alignCenter, t.bgGray100]}
                            id="callbackHour"
                            name="callbackHour"
                            placeholder="Callback Hour"
                            value={this.props.callbackHour}
                            onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                    <View style={[t.w5]}/>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Input
                            style={[t.alignCenter, t.bgGray100]}
                            id="callbackMinutes"
                            name="callbackMinutes"
                            placeholder="Callback Minutes"
                            value={this.props.callbackMinutes}
                            onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}