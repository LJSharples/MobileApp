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


export default class CostDetails extends React.Component {
    render(){
        if(this.props.currentStep !== 2){
            return null;
        }

        return (
            <View>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Service Cost</Text>
                        </Item>
                        <Item style={[ t.borderTransparent, t.mT5, t.alignCenter, t.justifyCenter, t.itemsCenter]}>
                            <Text>{this.props.costType ? 'Annual Cost' : 'Monthly Cost'}</Text>
                        </Item>
                        <Item style={[ t.borderTransparent, t.alignCenter, t.justifyCenter, t.itemsCenter]}>
                            <Switch onValueChange={this.props.toggleSwitch} value={this.props.costType}/>
                        </Item>
                        <Item style={[ t.mT5]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="serviceType"
                                name="serviceType"
                                placeholder="£ 0.00"
                                value={this.props.serviceCost}
                                onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                </Item>
                <Item style={[t.bgWhite, t.borderTransparent]}>
                    <View style={[ t.pX4, t.pY4, t.wFull]}>
                        <Item style={[ t.borderTransparent]}>
                            <Text style={[ t.textXl]}> Contract Length</Text>
                        </Item>
                        <Item>
                            <Input
                                id="serviceType"
                                name="serviceType"
                                style={[t.alignCenter, t.bgGray100]}
                                placeholder="Please select Service Type"
                                value={this.props.contractLength2}
                                onChange={this.props.onChangeText}/>
                        </Item>
                    </View>
                </Item>
            </View>
        )
    }
}