import React from 'react'
import {
  View,
  Alert,
  Text,
  ScrollView,
  RefreshControl,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
  ImageBackground
} from 'react-native'
import {
  Item
} from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getServices, getUserDetails } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';
import CollapsibleList from "react-native-collapsible-list";
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Header from "../forms/Header";
import NavBar from "../forms/NavBar";

const background = require('../images/background.png')

export default class AffiliatesScreen extends React.Component {
  state = {
    curTab: 1,
    activeTab: 3,
    chevron1: false,
    chevron2: false,
    chevron3: false,
    affiliateId: '',
    affiliateStatus: false,
    userProfile: {},
    userCompany: {},
    rowsCurrent: [],
    rowsActive: [],
    rowsEnded: [],
    tableHead: ['Service', 'Supplier', 'End Date', ''],
    modalHead: ['Service', 'Supplier', 'Contract End Date', 'Record ID', 'Bills'],
    rowsActiveArray: [
    ],
    email: '',
    billLink: {},
    selectedRecord: [],
    modalVisible: false,
    deleteModalVisible: false,
    routes: [
      'Home',
      'Services',
      'Expenses',
      'Quote',
      'Account',
      'AddServices'
    ],
    affiliateRoutes: [
      'Home',
      'Customers',
      'AffiliateExpenses',
      'Affiliates',
      'Account',
    ]
  };

  _handlePress = (index) => {
    this.setState({ curTab: index})
    this.handleRoute(this.state.routes[index]);
  }

  _handlePressAffiliate = (index) => {
    this.setState({ 
      curTab: index
    })
    this.handleRoute(this.state.affiliateRoutes[index]);
  }

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
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
    this.setState({ affiliateId: user.attributes['custom:affiliate_id'] });
    if(this.state.affiliateId !== ""){
      this.setState({ affiliateStatus: true});
    }
  
    const currentArray = [];
    const endedArray = [];
    const activeRowArray = [];
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
          const arrayRow = [lead.service_name, lead.current_supplier, contractEndDate.toLocaleDateString(),lead.id]
          endedArray.push(arrayRow)
        } else if(lead.status === "CURRENT" || lead.status === "LIVE" || lead.status === "Live" || lead.status === "Live Contract"){
          const arrayRow = [lead.service_name, lead.current_supplier, contractEndDate.toLocaleDateString(),lead.id, bills]
          activeRowArray.push(arrayRow)
        }else if(lead.status !== "CURRENT" || lead.status !== "LIVE" || lead.status !== "Live" || lead.status !== "Live Contract"){
          const arrayRow = [lead.service_name, lead.current_supplier, contractEndDate.toLocaleDateString(),lead.id]
          currentArray.push(arrayRow)
        }
      }
    });
    this.onChange('rowsCurrent', currentArray);
    this.onChange('rowsActiveArray', activeRowArray);
    this.onChange('rowsEnded', endedArray);
  }

  downloadFile = async (key) => {
    await Storage.get(key, { level: 'private'})
    .then(result => {
      Linking.openURL(result);
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

  _alertIndex(data, rowData) {
    this.setState({ 
      modalVisible: true,
      selectedRecord: rowData,
      selectedKey: data 
    });
  }

  render() {
    const element = (data, rowData) => (
      <TouchableOpacity style={[ t.pY1,t.roundedLg]} onPress={() => this._alertIndex(data, rowData)}>
        <Text style={[ t.textWhite, t.textCenter]}>
          <FontAwesome5 name="plus" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    );
    return (
      <View source={background} style= {[ t.flex1]}>
        <Header/>
        <ImageBackground source={background} style= {[ t.flex1]}>
          <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
            <View style={[t.mT5, t.alignCenter, t.borderTransparent, t.pX3, t.pY4, t.pt8, t.wFull]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text3xl, t.fontSemibold, t.textWhite]}>Affiliates</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textWhite]}>The affiliates you have recruited</Text>
              </Item>
              <Item style={[t.justifyEnd, t.borderTransparent]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('AddAffiliate')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                  <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>Add Affiliate</Text>
                </TouchableOpacity>
              </Item>
            </View>
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
                    <Text style={[ t.textWhite, t.textXl, t.fontMedium, t.p2]}>Affiliate Introductions 
                    {'                                 '} 
                    { this.state.chevron1 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                    </Text>
                  </View>
                }
              >
                <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                  <Table borderStyle={[t.borderTransparent]}>
                    <Row data={this.state.tableHead} style={[t.h10, t.flexAuto]} textStyle={[t.m2]}/>
                    {
                      this.state.rowsActiveArray.map((rowData, index) => (
                        <TableWrapper key={index} style={[t.flexRow, t.justifyCenter]}>
                          {
                            rowData.slice(0, 4).map((cellData, cellIndex) => (
                              <Cell key={cellIndex} data={cellIndex === 3 ? element(cellData, rowData, index) : cellData } textStyle={[t.m2]}/>
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
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
                    <Text style={[ t.textWhite, t.textXl, t.fontMedium, t.p2]}>Registered Affiliates 
                      {'                                    '} 
                      { this.state.chevron2 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                    </Text>
                  </View>
                }
              >
                <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                  <Table borderStyle={[t.borderTransparent]}>
                    <Row data={this.state.tableHead} style={[t.h10, t.flexAuto]} textStyle={[t.m2]}/>
                    {
                      this.state.rowsCurrent.map((rowData, index) => (
                        <TableWrapper key={index} style={[t.flexRow, t.justifyCenter]}>
                          {
                            rowData.slice(0, 4).map((cellData, cellIndex) => (
                              <Cell key={cellIndex} data={cellIndex === 3 ? element(cellData, rowData, index) : cellIndex < 3 ? cellData : ''} textStyle={[t.m2]}/>
                            ))
                          }
                        </TableWrapper>
                      ))
                    }
                  </Table>
                </View>
              </CollapsibleList>
            </Item>
          </ScrollView>
          <NavBar activeTab={[0,0,0,1,0]} index={this.state.activeTab} affilaite={this.state.affiliateStatus} _handlePressAffiliate={this._handlePressAffiliate} _handlePress={this._handlePress}/>
        </ImageBackground>
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