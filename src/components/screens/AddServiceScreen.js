import React from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import {
  Item
} from 'native-base'
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { addService } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements'

import DateTimePickerForm from '../forms/DateTimePickerForm';
import DateTimePickerContract from '../forms/DateTimePickerContract';
import FileUpload from "../forms/FileUpload";
import SuccessUpload from "../forms/SuccessUpload"

const background = require('../images/background.png')

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
        submitted: [],
        permission: false,
        user_name: '',
        displayModal: false
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
      this.setState({
        displayModal: false
      })
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

    fileUploadKey = (key) => {
      this.setState(prevState => ({
          uploaded_documents: [...prevState.uploaded_documents, key]
      }))
    }


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
        status: status,
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
          this.setState({
            displayModal: true
          })
      } catch (err) {
          console.log("Error:")
          console.log(err);
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
            <ImageBackground source={background} style= {[ t.flex1]}>
                <ScrollView
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                    <Item style={[ t.mT8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                      <Text style={[ t.text2xl, t.textWhite]}>Add A Service</Text>
                    </Item>
                    <View style={[ t.flex1, t.justifyCenter, t.alignCenter]}>
                        <Item style={[t.pX1, t.pY1, t.pt2, t.alignCenter, t.justifyCenter, t.wFull, t.hFull,]}>
                          <View style={[t.pX1, t.pY1, t.pt2, t.roundedLg, t.wFull, t.hFull]}>
                            <View rounded>
                              <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.z10, t.bgGray100]}>
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
                                    containerStyle={{height: 50, width: 400}}
                                    style={{ backgroundColor: '#fafafa' }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={item => this.setState({
                                        service_name: item.value
                                    })}
                                  />
                                </Item>
                              </View>
                              <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100, t.z0]}>
                                <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                <TextInput style={[ t.textLg]} placeholder="Your Current Supplier"
                                  placeholderTextColor="black"
                                  onChange={event => this.onChangeText('current_supplier', event)}
                                  value={this.state.current_supplier}/> 
                                </Item>
                              </View>
                              <DateTimePickerContract onChange={this.onChange}/>
                              <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100, t.z10]}>
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
                                    containerStyle={{height: 50, width: 400}}
                                    style={{ backgroundColor: '#fafafa' }}
                                    dropDownStyle={{ backgroundColor: '#fafafa'}}
                                    onChangeItem={item => this.setState({
                                        contract_length: item.value
                                    })}
                                  />
                                </Item>
                              </View>
                              <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                <Item style={[t.pX4, t.pY4, t.pt8, t.borderTransparent]}>
                                    <FileUpload fileUploadKey={this.fileUploadKey}/>
                                </Item>
                              </View>
                              <DateTimePickerForm onChange={this.onChange}/>
                              <Item style={[ t.mT2, t.borderTransparent]}>
                                <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX4, t.pY4, t.pt8]}>
                                  <TextInput style={[ t.textLg, t.textCenter]} placeholder="Year Cost"
                                    placeholderTextColor="black"
                                    onChange={event => this.onChangeText('cost_year', event)}
                                    keyboardType = 'numeric'
                                    value={this.state.cost_year}/> 
                                </View>
                                <View style={[t.wPx]}/>
                                <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX4, t.pY4, t.pt8]}>
                                  <TextInput style={[ t.textLg, t.textCenter]} placeholder="Month Cost"
                                    placeholderTextColor="black"
                                    onChange={event => this.onChangeText('cost_month', event)}
                                    keyboardType = 'numeric'
                                    value={this.state.cost_month}/> 
                                </View>
                              </Item>
                              <View style={[ t.mT2, t.itemsCenter, t.bgGray100]}>
                                  <CheckBox
                                    center
                                    title='Permission To Share Details'
                                    checked={this.state.permission}
                                    onPress={() => {
                                      this.setState(prevState => ({
                                        permission: !prevState.permission
                                      }));    
                                    }}
                                  />
                              </View>
                              <Item style={[ t.mT2, t.borderTransparent]}>
                                <View style={[t.roundedLg, t.bgWhite, t.w5_12]}>
                                  <TouchableOpacity 
                                    onPress={() => {
                                      this.handleRoute('Services');
                                    }}
                                    style={[ t.pX3, t.pY4, t.pt8, t.roundedLg,]}>
                                    <Text style={[ t.textRed600, t.textLg, t.textCenter, t.p2]}>Cancel</Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={[t.w2_12]}/>
                                <View style={[t.roundedLg, t.bgWhite, t.w5_12]}>
                                  <TouchableOpacity 
                                    onPress={() => {
                                      this.submitService();
                                    }}
                                    style={[ t.pX3, t.pY4, t.pt8, t.roundedLg,]}>
                                    <Text style={[ t.textBlue600, t.textXl, t.textCenter, t.p2]}>Add Service</Text>
                                  </TouchableOpacity>
                                </View>
                              </Item>
                              <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.displayModal}
                                onRequestClose={() => {
                                    Alert.alert("Modal has been closed.");
                                }}
                              >
                                <SuccessUpload handleRoute={this.handleRoute}/>
                              </Modal>
                            </View>
                          </View>
                        </Item>
                  </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}