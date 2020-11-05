import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
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


export default class addQuoteScreen extends React.Component {
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
        submitted: [],
        permission: true,
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

    onChangeText = (key, value) => {
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
      this.verifyInput(key);
    };

    onChange = (key, value) => {
      this.setState({
        [key]: value
      })
      this.verifyInput(key);
    }; 
    
    verifyInput = (key) => {
      if(key !== ""){
        var joined = this.state.submitted.concat(key);
        this.setState({ submitted: joined })
      }
    } 

    submitService = async () => {
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
          this.getServices();
          console.log("Success");
      } catch (err) {
          console.log("Error:")
      }
      this.setState({
        service_name: '',
        current_supplier: '',
        contractDate: '',
        contract_length: '',
        callback_time: '',
        callback_date: '',
        cost_year: '',
        cost_month: '',
        uploaded_documents: [],
        submitted: []
      })
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
                                <Text style={[ t.text2xl, t.textBlue600]}>Get A Quote</Text>
                            </Item>
                        </View>
                    </Item>
                    <View style={[ t.flex1, t.justifyCenter, t.alignCenter]}>
                        <Item style={[t.pX1, t.pY1, t.pt2, t.alignCenter, t.justifyCenter, t.wFull, t.hFull, t.mT5,]}>
                          <View style={[t.pX1, t.pY1, t.pt2, t.roundedLg, t.wFull, t.hFull, t.mT2]}>
                            <View rounded>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold]}>SERVICE NAME {this.state.submitted.includes('service_name') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
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
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold]}>PROVIDER {this.state.submitted.includes('current_supplier') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100, t.z0]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <TextInput style={[ t.textXl]} placeholder="Your current Supplier"
                                    onChange={event => this.onChangeText('current_supplier', event)}
                                    value={this.state.current_supplier}/> 
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>CONTRACT END DATE {this.state.submitted.includes('contractDate') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
                                <DateTimePickerContract onChange={this.onChange}/>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>CONTRACT LENGTH {this.state.submitted.includes('contract_length') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
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
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>CALLBACK DATE {this.state.submitted.includes('callback_date') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
                                <DateTimePickerForm onChange={this.onChange}/>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>COST PER YEAR(£) {this.state.submitted.includes('cost_year') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <TextInput style={[ t.textXl]} placeholder="£0.00"
                                    onChange={event => this.onChangeText('cost_year', event)}
                                    keyboardType = 'numeric'
                                    value={this.state.cost_year}/> 
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue600, t.textCenter, t.fontBold, t.mT2]}>COST PER MONTH(£) {this.state.submitted.includes('cost_month') ? <FontAwesome name="check" size={24} color="green" /> : ""}</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <TextInput style={[ t.textXl]} placeholder="£0.00"
                                      onChange={event => this.onChangeText('cost_month', event)}
                                      keyboardType = 'numeric'
                                      value={this.state.cost_month}/> 
                                  </Item>
                                </View>
                              </>
                              <Item style={[ t.mT5, t.alignCenter, t.justifyCenter, t.itemsCenter, t.borderTransparent]}>
                                <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w1_2]}>
                                  <TouchableOpacity 
                                    onPress={() => {
                                      this.handleRoute('Quote');
                                    }}
                                    style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                                    <Text style={[ t.textWhite, t.textXl, t.p2]}>{'      '}Cancel</Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={[t.roundedLg, t.itemsCenter, t.textCenter, t.w1_2]}>
                                  <TouchableOpacity 
                                    onPress={() => this.submitService}
                                    style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                                    <Text style={[ t.textWhite, t.textXl, t.p2]}>Get Quote</Text>
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