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

export default class ServicesScreen extends React.Component {
  state = {
    curTab: 1,
    activeTab: 1,
    chevron1: false,
    chevron2: false,
    chevron3: false,
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
  
    const currentArray = [];
    const activeArray = [];
    const endedArray = [];
    userServices.data["getServices"].items.map(lead => {
      if(lead.status === "CUSTOMER DELETED"){
      } else {
        let bills = []
        if(lead.uploaded_documents && lead.uploaded_documents.length > 0){
            let str = lead.uploaded_documents.slice(1,-1);
            bills = str.split(', ')
        }
        var dateCurrent = new Date();
        var contractEndDate = new Date(lead.contract_end);
        if(contractEndDate.toISOString() < dateCurrent.toISOString()){
          const newValue = {
              service_name: lead.service_name,
              provider: lead.current_supplier,
              contract_end: contractEndDate.toLocaleDateString(),
              cost_year: lead.cost_year,
              status: lead.status,
              bills: bills
          }
          endedArray.push(newValue)
        } else if(lead.status === "CURRENT" || lead.status === "LIVE" || lead.status === "Live" || lead.status === "Live Contract"){
            const newValue2 = {
                service_name: lead.service_name,
                provider: lead.current_supplier,
                contract_end: contractEndDate.toLocaleDateString(),
                cost_year: lead.cost_year,
                status: lead.status,
                bills: bills
            }
            activeArray.push(newValue2)
        }else if(lead.status !== "CURRENT" || lead.status !== "LIVE" || lead.status !== "Live" || lead.status !== "Live Contract"){
            const newValue = {
                service_name: lead.service_name,
                provider: lead.current_supplier,
                contract_end: contractEndDate.toLocaleDateString(),
                cost_year: lead.cost_year,
                status: lead.status,
                bills: bills
            }
            currentArray.push(newValue)
        }
      }
    });
    this.onChange('rowsCurrent', currentArray);
    this.onChange('rowsActive', activeArray);
    this.onChange('rowsEnded', endedArray);
  }

  downloadFile = async (key) => {
    await Storage.get(key, { level: 'private'})
    .then(result => {
      console.log(result)
    })
    .catch(err => console.log(err));
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  swapChevron1 = () => {
    this.setState(prevState => ({
      chevron1: !prevState.chevron1
    }));    
  }

  swapChevron2 = () => {
    this.setState(prevState => ({
      chevron2: !prevState.chevron2
    }));    
  }

  swapChevron3 = () => {
    this.setState(prevState => ({
      chevron3: !prevState.chevron3
    }));    
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
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600]}
              buttonPosition="top"
              onToggle={() => {
                this.swapChevron1();
              }}
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>Live Contracts 
                  {'                                     '} 
                  { this.state.chevron1 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                  </Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Service</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Provider</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Contract End Date</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                    </Item>
                  </View>
                </View>
                {
                  this.state.rowsActive.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.service_name}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.provider}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.contract_end}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <TouchableOpacity  onPress={() => this.setModalVisible(true, anObjectMapped)}>
                              <FontAwesome5 name="plus" size={24} color="black" />
                            </TouchableOpacity>
                          </Item>
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
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600, t.justifyCenter]}
              buttonPosition="top"
              onToggle={() => {
                this.swapChevron2();
              }}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>In Progress 
                    {'                                           '} 
                    { this.state.chevron2 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                  </Text>
                </View>
              }
            >
              
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Service</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Provider</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Contract End Date</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                    </Item>
                  </View>
                </View>
                {
                  this.state.rowsCurrent.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.service_name}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.provider}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.contract_end}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <TouchableOpacity  onPress={() => this.setModalVisible(true, anObjectMapped)}>
                              <FontAwesome5 name="plus" size={24} color="black" />
                            </TouchableOpacity>
                          </Item>
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
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600]}
              buttonPosition="top"
              onToggle={() => {
                this.swapChevron3();
              }}
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>Expired Contracts 
                    {'                               '} 
                    { this.state.chevron3 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                  </Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Service</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Provider</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                      <Text style={[ t.fontBold]}>Contract End Date</Text>
                    </Item>
                  </View>
                  <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                    </Item>
                  </View>
                </View>
                {
                  this.state.rowsEnded.map((anObjectMapped, index) => { // This will render a row for each data element.
                    return (
                      <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.service_name}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.provider}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text>{anObjectMapped.contract_end}</Text>
                          </Item>
                        </View>
                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                          <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <TouchableOpacity  onPress={() => this.setModalVisible(true, anObjectMapped)}>
                              <FontAwesome5 name="plus" size={24} color="black" />
                            </TouchableOpacity>
                          </Item>
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
                              <Text style={[ t.text2xl,]}>Bills</Text>
                            </Item>
                          </View>
                          <View style={[t.roundedLg, t.w1_2]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            {
                              anObjectMapped.bills.map((bill, billIndex) => { // This will render a row for each data element.
                                return (
                                  <TouchableOpacity
                                    onPress={() => this.downloadFile(bill)}
                                    style={[ t.pX2, t.pY2, t.justifyStart]}>
                                    <Text key={billIndex} style={[t.textXl]} onPress={() => this.downloadFile(bill)}>{bill}</Text>
                                  </TouchableOpacity>
                                )
                              })
                            }
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
            titleColor="#999999"
            isRtl={ false }
            iconSize={25}
            values={[
                { title: "Dashboard", icon: "home", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons },
                { title: "Services", icon: "settings-power", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.state.activeTab},
                { title: "Expenses", icon: "attach-money", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Get Quote", icon: "format-quote", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Profile", icon: "verified-user", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons},
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