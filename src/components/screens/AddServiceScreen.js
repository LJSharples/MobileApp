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
import { addService } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements'

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
        ],
        service_name: '',
        current_supplier: '',
        contractDate: '',
        contract_length: '',
        callback_time: '',
        callback_date: '',
        cost_year: '',
        cost_month: '',
        uploaded_documents: [],
        permission: false,
        user_name: '',
    };

    async componentDidMount(){
      let user = await Auth.currentAuthenticatedUser();
      this.setState({ user_name: user.username})
    }
      
    _handlePress = (index) => {
        this.setState({ curTab: index})
        this.handleRoute(this.state.routes[index]);
    }
    
    handleRoute = async (destination) => {
        await this.props.navigation.navigate(destination)
    }

    onChangeText = (key, event) => {
      const value = event.nativeEvent.text
      if(key === "contractDate"){
          this.setState({ s_contractDate: value})
          let month = value.getMonth() + 1
          let date = value.getFullYear() + "-" + month + "-" + value.getDate();
          this.setState({ contractDate : date})
      } else if(key === "callback_date"){
          let time = value.toLocaleString();
          this.setState({ s_callback_date: value})
          this.setState({ callback_date : value.toLocaleDateString()})
          this.setState({ callback_time : time.substr(12, 8)})
      } else {
          this.setState({ [key]: value})
      }
    };

    onChange = (key, value) => {
      this.setState({
        [key]: value
      })
    };  

    submitService = async () => {
      console.log("HERE")
      var time = this.state.callback_time;
      var date = this.state.callback_date;
      var status = "CURRENT";
      if(this.state.permission){
          status = "LEAD"
      }

      const data = {
        user_name: this.state.user_name,
        status: "CURRENT",
        email: this.state.email,
        service_name: this.state.service_name,
        callback_time: date + 'T' + time,
        contract_end: this.state.contractDate,
        contract_length: this.state.contract_length,
        current_supplier: this.state.current_supplier,
        cost_year: this.state.cost_year,
        cost_month: this.state.cost_month,
        uploaded_documents: this.state.uploaded_documents,
        permission: this.state.permission
      }
      console.log(data)
      try {
          const re = await API.graphql(graphqlOperation(addService, data));
          console.log("Success");
      } catch (err) {
          console.log("Error:")
          console.log(err);
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
                                <DateTimePickerContract onChange={this.onChange}/>
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
                                <DateTimePickerForm onChange={this.onChange}/>
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
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>PERMISSION</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <CheckBox
                                      center
                                      title='Click Here'
                                      checked={this.state.permission}
                                      onPress={() => {
                                        this.setState(prevState => ({
                                          permission: !prevState.permission
                                        }));    
                                      }}
                                    />
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
                                    onPress={() => {
                                      this.submitService();
                                    }}
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