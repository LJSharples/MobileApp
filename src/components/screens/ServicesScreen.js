import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TextInput,
} from 'react-native'
import {
  Item
} from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { addService } from '../../graphql/mutations';
import { getServices, getUserDetails } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';

// Service colors, icons and components
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';
import DateTimePickerForm from '../forms/DateTimePickerForm';
import DateTimePickerContract from '../forms/DateTimePickerContract';
import FileUpload from "../forms/FileUpload";

export default class ServicesScreen extends React.Component {
  state = {
    userProfile: {},
    userCompany: {},
    services: [],
    service_name: '',
    callback_time: '29/10/2020',
    contract_end: '',
    contract_length: '',
    current_supplier: '',
    cost_year: '',
    cost_month: '',
    uploaded_documents: [],
    modalVisible: false,
    mode: 'datetime'
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  hideModal(){
    this.setState({ modalVisible: false});
  }

  onChangeText(key, value) {
    console.log(value);
    this.setState({
      [key]: value.nativeEvent.text
    })
  }

  onChange = (key, value) => {
    this.setState({
      [key]: value
    })
    console.log(key);
    console.log(value);
  };

  submitService = async () => {
    const data = {
        user_name: this.state.userProfile.user_name,
        status: "FROMMVP",
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
        console.log("Success");
    } catch (err) {
        console.log("Error:")
        console.log(err);
    } 
    this.hideModal();
  }

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
    this.setState({ userProfile: userProfile.data["user"]});
    this.setState({ userCompany: userProfile.data["getCompany"]});

    const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
    this.setState({ services: userServices.data["getServices"].items});
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
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
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.w1_2, t.bgBlue400, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
                >
                  <View style={[ t.flex1, t.justifyCenter, t.alignCenter, t.mT5]}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Add Service</Text>

                      <ScrollView style={[t.hFull]}>
                        <Item style={[t.pX1, t.pY1, t.pt2, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
                          <View style={[t.pX1, t.pY1, t.pt2, t.roundedLg, t.wFull, t.hFull, t.mT2]}>
                            <View rounded>
                              <>
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold]}>SERVICE NAME</Text>
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
                                      containerStyle={{height: 40, width: 250}}
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
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold]}>PROVIDER</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100, t.z0]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <TextInput style={[ t.textXl]} placeholder="Your current Supplier"
                                    onChange={event => this.onChangeText('current_supplier', event)}
                                    value={this.state.current_supplier}/> 
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold, t.mT2]}>CONTRACT END DATE</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <DateTimePickerContract onChange={this.onChange}/>
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold, t.mT2]}>CONTRACT LENGTH</Text>
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
                                      containerStyle={{height: 40, width: 250}}
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
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold, t.mT2]}>CALLBACK DATE</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                      <FileUpload/>
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold, t.mT2]}>CALLBACK DATE</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <DateTimePickerForm onChange={this.onChange}/>
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold, t.mT2]}>COST PER YEAR(£)</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                  <TextInput style={[ t.textXl]} placeholder="£0.00"
                                    onChange={event => this.onChangeText('cost_year', event)}
                                    value={this.state.cost_year}/> 
                                  </Item>
                                </View>
                              </>
                              <>
                                <Text style={[t.textBlue400, t.textCenter, t.fontBold, t.mT2]}>COST PER MONTH(£)</Text>
                                <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                    <TextInput style={[ t.textXl]} placeholder="£0.00"
                                      onChange={event => this.onChangeText('cost_month', event)}
                                      value={this.state.cost_month}/> 
                                  </Item>
                                </View>
                              </>
                              <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                                <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgRed400, t.itemsCenter]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                    <TouchableHighlight
                                      onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                      }}
                                    >
                                      <Text style={styles.textStyle}>Close</Text>
                                    </TouchableHighlight>
                                  </Item>
                                </View>
                                <View style={[t.w5]}/>
                                <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgBlue400, t.itemsCenter]}>
                                  <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                    <TouchableHighlight
                                      onPress={() => {
                                        this.submitService();
                                      }}
                                    >
                                      <Text style={styles.textStyle}>Submit</Text>
                                    </TouchableHighlight>
                                  </Item>
                                </View>
                              </Item>
                            </View>
                          </View>
                        </Item>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(true);
                  }}
                >
                  <Text style={[ t.textXl]}>Add Service</Text>
                </TouchableHighlight>


              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT2,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl]}> All Services</Text>
              </Item>
              <View rounded>
                {
                  this.state.services.map((s, i) => 
                    <>
                      <View key={s.PK} style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.service_name]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                          <FontAwesome5 name={serviceIcons[s.service_name]} size={24} color="black" style={[t.pE8]}/>
                          <Text style={[t.textXl, t.itemsCenter, t.pE8]}>{s.service_name}</Text>
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
const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});