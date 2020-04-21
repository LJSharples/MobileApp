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


export default class ServiceDetails extends React.Component {
    render(){
        if(this.props.currentStep !== 1){
            return null;
        }

        return (
            <View>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Service Type</Text>
                        </Item>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="serviceType"
                                name="serviceType"
                                placeholder="Please select Service Type"
                                value={this.props.serviceType}
                                onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Provider</Text>
                        </Item>
                        <Item>
                            <Input
                                id="serviceType"
                                name="serviceType"
                                style={[t.alignCenter, t.bgGray100]}
                                placeholder="Please select Service Type"
                                value={this.props.serviceType}
                                onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Contract End Date</Text>
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
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Upload a bill</Text>
                        </Item>
                        <Item>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="serviceType"
                                name="serviceType"
                                placeholder="Please upload a bill"
                                value={this.props.serviceType}
                                onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}