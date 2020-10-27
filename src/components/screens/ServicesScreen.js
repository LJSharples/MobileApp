import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Modal,
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
import { getServices, getUserDetails } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";
import CollapsibleList from "react-native-collapsible-list";


// Service colors, icons and components
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';
import DateTimePickerForm from '../forms/DateTimePickerForm';
import DateTimePickerContract from '../forms/DateTimePickerContract';
import FileUpload from "../forms/FileUpload";

export default class ServicesScreen extends React.Component {
  state = {
    curTab: 1,
    activeTab: 1,
    userProfile: {},
    userCompany: {},
    rowsCurrent: [],
    rowsActive: [],
    rowsEnded: [],
    email: '',
    selectedRecord: [],
    modalVisible: false,
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

  setModalVisible = (visible, record) => {
    var records = []
    records.push(record)
    console.log(records)
    this.setState({ 
      modalVisible: visible,
      selectedRecord: records
    });
  }

  hideModal(){
    this.setState({ modalVisible: false});
  }

  onChange = (key, value) => {
    this.setState({
      [key]: value
    })
  };

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
    const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
    this.setState({ email: user.email});
    this.setState({ userProfile: userProfile.data["user"]});
    this.setState({ userCompany: userProfile.data["getCompany"]});
  
    const currentArray = [{
      "contract_end": "Contract End Date",
      "provider": "Provider",
      "service_name": "Service",
      "view": "Actions"
    }];
    const activeArray = [{
      "contract_end": "Contract End Date",
      "provider": "Provider",
      "service_name": "Service",
      "view": "Actions"
    }];
    const endedArray = [{
      "contract_end": "Contract End Date",
      "provider": "Provider",
      "service_name": "Service",
      "view": "Actions"
    }];
    userServices.data["getServices"].items.map(lead => {
      if(lead.status === "CUSTOMER DELETED"){
      } else {
        var dateCurrent = new Date();
        var contractEndDate = new Date(lead.contract_end);
        if(contractEndDate.toISOString() < dateCurrent.toISOString()){
          const newValue = {
              service_name: lead.service_name,
              provider: lead.current_supplier,
              contract_end: contractEndDate.toLocaleDateString(),
              cost_year: lead.cost_year,
              status: lead.status
          }
          endedArray.push(newValue)
        } else if(lead.status === "CURRENT" || lead.status === "LIVE" || lead.status === "Live" || lead.status === "Live Contract"){
            const newValue2 = {
                service_name: lead.service_name,
                provider: lead.current_supplier,
                contract_end: contractEndDate.toLocaleDateString(),
                cost_year: lead.cost_year,
                status: lead.status
            }
            activeArray.push(newValue2)
        }else if(lead.status !== "CURRENT" || lead.status !== "LIVE" || lead.status !== "Live" || lead.status !== "Live Contract"){
            const newValue = {
                service_name: lead.service_name,
                provider: lead.current_supplier,
                contract_end: contractEndDate.toLocaleDateString(),
                cost_year: lead.cost_year,
                status: lead.status
            }
            currentArray.push(newValue)
        }
      }
    });
    this.onChange('rowsCurrent', currentArray);
    this.onChange('rowsActive', activeArray);
    this.onChange('rowsEnded', endedArray);
  }


  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
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
                <Text style={[ t.text2xl, t.textBlue600]}>Service</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textBlue600]}>Manage all your services in one place</Text>
              </Item>
            </View>
            <View style={[t.roundedLg, t.itemsCenter, t.w5_2]}>
              <TouchableOpacity 
                onPress={() => this.handleRoute('Services')}
                style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                <Text style={[ t.textWhite, t.textXl, t.p2]} onPress={() => this.handleRoute('Services')}>Add Service</Text>
              </TouchableOpacity>
            </View>
          </Item>
          <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <CollapsibleList
              numberOfVisibleItems={0}
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgBlue100]}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>Live Contracts</Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite]}>
                {
                  this.state.rowsActive.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View key={index} style={[ t.flex1, t.selfStretch, t.flexRow]}>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.service_name}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.provider}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.contract_end}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <TouchableOpacity style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100]} onPress={() => this.setModalVisible(true, anObjectMapped)}><Text>View</Text></TouchableOpacity>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </CollapsibleList>
          </Item>
          <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <CollapsibleList
              numberOfVisibleItems={0}
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgBlue100]}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>In Progress</Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite]}>
                {
                  this.state.rowsCurrent.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View key={index} style={[ t.flex1, t.selfStretch, t.flexRow]}>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.service_name}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.provider}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.contract_end}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <TouchableOpacity style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100]} onPress={() => this.setModalVisible(true, anObjectMapped)}><Text>View</Text></TouchableOpacity>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </CollapsibleList>
          </Item>
          <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <CollapsibleList
              numberOfVisibleItems={0}
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgBlue100]}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>Expired Contracts</Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite]}>
                {
                  this.state.rowsEnded.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View key={index} style={[ t.flex1, t.selfStretch, t.flexRow]}>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.service_name}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.provider}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <Text>{anObjectMapped.contract_end}</Text>
                        </View>
                        <View style={[ t.flex1, t.selfStretch]}>
                          <TouchableOpacity style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100]} onPress={() => this.setModalVisible(true, anObjectMapped)}><Text>View</Text></TouchableOpacity>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </CollapsibleList>
          </Item>
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
                <ScrollView>
                {
                  this.state.selectedRecord.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View key={index}>
                        <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.text2xl,]}>Service</Text>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.textXl]}>{anObjectMapped.service_name}</Text>
                            </Item>
                          </View>
                        </Item>
                        <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.text2xl,]}>Provider</Text>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.textXl]}>{anObjectMapped.provider}</Text>
                            </Item>
                          </View>
                        </Item>
                        <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.text2xl,]}>Contract End Date</Text>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.textXl]}>{anObjectMapped.contract_end}</Text>
                            </Item>
                          </View>
                        </Item>
                        <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.text2xl,]}>Costs Per Year (£)</Text>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.textXl]}>{anObjectMapped.cost_year}</Text>
                            </Item>
                          </View>
                        </Item>
                        <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.text2xl,]}>Status</Text>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.textXl]}>{anObjectMapped.status}</Text>
                            </Item>
                          </View>
                        </Item>
                        <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <TouchableOpacity 
                                onPress={() => this.hideModal()}
                                style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                                <Text style={[ t.textWhite, t.textXl, t.p2]} onPress={() => this.hideModal()}>Close</Text>
                              </TouchableOpacity>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.itemsCenter, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <TouchableOpacity 
                                onPress={() => this.handleRoute('Services')}
                                style={[ t.pX2, t.pY2,t.roundedLg, t.bgRed600, t.justifyStart]}>
                                <Text style={[ t.textWhite, t.textXl, t.p2]} onPress={() => this.handleRoute('Services')}>Delete</Text>
                              </TouchableOpacity>
                            </Item>
                          </View>
                        </Item>
                      </View>
                    )
                  })
                }
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <TabBar
            activeTab={this.state.activeTab}
            iconStyle={{ width: 50, height: 50 }}
            tintColor="blue"
            onPress={(tabIndex) => {
                this._handlePress(tabIndex);
            }}
            iconActiveTintColor="black"
            iconInactiveTintColor="blue"
            tintColor="#f5f5f7"
            titleColor="red"
            isRtl={ false }
            iconSize={25}
            values={[
                { title: "Dashboard", icon: "home", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons },
                { title: "Services", icon: "settings-power", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.state.activeTab},
                { title: "Expenses", icon: "attach-money", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Get Quote", icon: "format-quote", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Profile", icon: "verified-user", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons},
            ]}
          />
      </View>
    )
  }
  
}
const styles = StyleSheet.create({
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
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
});