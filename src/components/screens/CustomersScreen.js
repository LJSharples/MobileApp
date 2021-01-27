import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  ImageBackground
} from 'react-native'
import {
  Item
} from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { removeService } from '../../graphql/mutations';
import { getServices, getUserDetails } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";
import CollapsibleList from "react-native-collapsible-list";
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Header from "../forms/Header";

const background = require('../images/background.png')

export default class CustomersScreen extends React.Component {
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
    tableHead: ['Service', 'Supplier', 'End Date', ''],
    modalHead: ['Service', 'Supplier', 'Contract End Date', 'Record ID', 'Bills'],
    rowsActiveArray: [
    ],
    email: '',
    billLink: {},
    selectedRecord: [],
    routes: [
      'Home',
      'Services',
      'Expenses',
      'Quote',
      'Account',
      'AddServices'
    ]
  };

  _handlePress = (index) => {
    this.setState({ curTab: index})
    this.handleRoute(this.state.routes[index]);
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
  _alertIndex(data, rowData) {
    this.setState({ 
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
            <Item style={[ t.mT5, t.alignCenter, t.borderTransparent]}>
              <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.text3xl, t.fontSemibold, t.textWhite]}>Customers</Text>
                </Item>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.textXl, t.textWhite]}>Customers you have invited on ManagedBills.com</Text>
                </Item>
                <Item style={[t.justifyEnd, t.borderTransparent]}>
                  <TouchableOpacity 
                    onPress={() => this.handleRoute('AddCustomer')}
                    style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                    <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>Add Customer</Text>
                  </TouchableOpacity>
                </Item>
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
                    <Text style={[ t.textWhite, t.textXl, t.fontMedium, t.p2]}>My Customers 
                    {'                                     '} 
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
          </ScrollView>
          <TabBar
              activeTab={this.state.activeTab}
              iconStyle={{ width: 50, height: 50 }}
              tintColor="#2F82EC"
              onPress={(tabIndex) => {
                  this._handlePress(tabIndex);
              }}
              iconActiveTintColor="black"
              iconInactiveTintColor="#2F82EC"
              tintColor="#f5f5f7"
              titleColor="#999999"
              isRtl={ false }
              iconSize={25}
              values={[
                { title: "Dashboard", icon: "home", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons,  },
                { title: "Services", icon: "md-document", tintColor: "#2F82EC", isIcon: true, iconType: iconTypes.Ionicons, activeTab:this.state.activeTab},
                { title: "Expenses", icon: "md-wallet", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons},
                { title: "Get Quote", icon: "redo-variant", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialCommunityIcons},
                { title: "Profile", icon: "person-outline", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              ]}
            />
        </ImageBackground>
      </View>
    )
  } 
}