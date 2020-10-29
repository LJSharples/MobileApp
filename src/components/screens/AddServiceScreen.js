import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import {
  Item
} from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { addService, removeService } from '../../graphql/mutations';
import { getServices, getUserDetails } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";
import CollapsibleList from "react-native-collapsible-list";
import DropDownPicker from 'react-native-dropdown-picker';

import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';
import DateTimePickerForm from '../forms/DateTimePickerForm';
import DateTimePickerContract from '../forms/DateTimePickerContract';
import FileUpload from "../forms/FileUpload";


export default class addServiceScreen extends React.Component {
    state = {
        routes: [
            'Home',
            'Services',
            'Expenses',
            'Quote',
            'Account'
        ]
    };
      
    _handlePress = (index) => {
        this.setState({ curTab: index})
        this.handleRoute(this.state.routes[index]);
    }
    
    handleRoute = async (destination) => {
        await this.props.navigation.navigate(destination)
    }

    async componentDidMount(){

    }

    submitService = async () => {
        const data = {
          user_name: this.state.userProfile.user_name,
          status: "CURRENT",
          email: this.state.email,
          service_name: this.state.service_name,
          callback_time: this.state.callback_time,
          contract_end: this.state.contract_end,
          contract_length: this.state.contract_length,
          current_supplier: this.state.current_supplier,
          cost_year: this.state.cost_year,
          cost_month: this.state.cost_month,
          uploaded_documents: this.state.uploaded_documents
        }
        console.log(data)
        try {
            const re = await API.graphql(graphqlOperation(addService, data));
            this.getServices();
            console.log("Success");
        } catch (err) {
            console.log("Error:")
        }
    }


    render() {
        return (
            <View style= {[ t.flex1, t.bgBlue200]}>
                <ScrollView
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                    <Item style={[ t.mT5, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                        <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w7_12]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.text2xl, t.textBlue600]}>Add A Service</Text>
                            </Item>
                        </View>
                    </Item>
                    <View style={[ t.flex1, t.justifyCenter, t.alignCenter]}>
                        <Item style={[t.pX1, t.pY1, t.pt2, t.alignCenter, t.justifyCenter, t.wFull, t.hFull, t.mT5,]}>
                          <View style={[t.pX1, t.pY1, t.pt2, t.roundedLg, t.wFull, t.hFull, t.mT2]}>
                            <View rounded>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold]}>SERVICE NAME</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.z10]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <DropDownPicker
                                      items={[
                                        { label: 'Electricity', value: 'Electric' },
                                        { label: 'Gas', value: 'Gas' },
                                        { label: 'Oil', value: 'Oil' },
                                        { label: 'Water', value: 'Water' },
                                        { label: 'Energy Reduction', value: 'Energy Reduction' },
                                        { label: 'Waste Management', value: 'Waste Management' },
                                        { label: 'Business Rates Review', value: 'Business Rates Review' },
                                        { label: 'Fuel Cards', value: 'Fuel Cards' },
                                        { label: 'Telecomms & Broadband', value: 'Telecomms & Broadband' },
                                        { label: 'Cyber Security', value: 'Cyber Security' },
                                        { label: 'Printers', value: 'Printers' },
                                        { label: 'Merchant Services', value: 'Merchant Services' },
                                        { label: 'Insolvency', value: 'Insolvency' },
                                      ]}
                                      placeholder="Please Select a Service"
                                      placeholderStyle={{
                                        fontSize: 18,
                                        textAlign: 'center'
                                      }}
                                      containerStyle={{height: 50, width: 360}}
                                      style={{ backgroundColor: '#fafafa' }}
                                      dropDownStyle={{ backgroundColor: '#fafafa' }}
                                      onChangeItem={item => this.setState({
                                          service_name: item.value
                                      })}
                                    />
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold]}>PROVIDER</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100, t.z0]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <TextInput style={[ t.textXl]} placeholder="Your current Supplier"
                                    onChange={event => this.onChangeText('current_supplier', event)}
                                    value={this.state.current_supplier}/> 
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>CONTRACT END DATE</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <DateTimePickerContract onChange={this.onChange}/>
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>CONTRACT LENGTH</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.z10]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <DropDownPicker
                                      items={[
                                        { label: '12 Months', value: '12 Months' },
                                        { label: '18 Months', value: '18 Months' },
                                        { label: '24 Months', value: '24 Months' },
                                        { label: '36 Months', value: '36 Months' },
                                        { label: '48 Months', value: '48 Months' },
                                        { label: '60 Months', value: '60 Months' },
                                      ]}
                                      placeholder="Enter Contract Length"
                                      placeholderStyle={{
                                        fontSize: 18,
                                        textAlign: 'center'
                                      }}
                                      containerStyle={{height: 50, width: 360}}
                                      style={{ backgroundColor: '#fafafa' }}
                                      dropDownStyle={{ backgroundColor: '#fafafa'}}
                                      onChangeItem={item => this.setState({
                                          contract_length: item.value
                                      })}
                                    />
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>FILE UPLOAD</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                      <FileUpload/>
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>CALLBACK DATE</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <DateTimePickerForm onChange={this.onChange}/>
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>COST PER YEAR(£)</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <TextInput style={[ t.textXl]} placeholder="£0.00"
                                    onChange={event => this.onChangeText('cost_year', event)}
                                    value={this.state.cost_year}/> 
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>COST PER MONTH(£)</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <TextInput style={[ t.textXl]} placeholder="£0.00"
                                      onChange={event => this.onChangeText('cost_month', event)}
                                      value={this.state.cost_month}/> 
                                  </Item>
                                </View>
                              </>
                              <Item style={[ t.mT5, t.alignCenter, t.justifyCenter, t.itemsCenter, t.borderTransparent]}>
                                <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w1_2]}>
                                  <TouchableOpacity 
                                    onPress={() => {
                                      this.handleRoute('Services');
                                    }}
                                    style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                                    <Text style={[ t.textWhite, t.textXl, t.p2]}>{'      '}Cancel</Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={[t.roundedLg, t.itemsCenter, t.textCenter, t.w1_2]}>
                                  <TouchableOpacity 
                                    onPress={() => this.submitService}
                                    style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                                    <Text style={[ t.textWhite, t.textXl, t.p2]}>Add Service</Text>
                                  </TouchableOpacity>
                                </View>
                              </Item>
                            </View>
                          </View>
                        </Item>
                  </View>
                </ScrollView>
            </View>
        )
    }
}