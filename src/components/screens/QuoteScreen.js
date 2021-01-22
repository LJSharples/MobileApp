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
  ImageBackground
} from 'react-native'
import {
  Item
} from 'native-base'
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { addService } from '../../graphql/mutations';
import { getServices, getUserDetails } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";
import Header from "../forms/Header";

const background = require('../images/background.png')

export default class QuoteScreen extends React.Component {
  state = {
    curTab: 3,
    activeTab: 3,
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
      'Account',
      'AddQuote'
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
      <View source={background} style= {[ t.flex1]}>
        <Header/>
        <ImageBackground source={background}  style= {[ t.flex1]}>
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
                  <Text style={[ t.text3xl, t.fontSemibold, t.textWhite]}>Get Quote</Text>
                </Item>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.textXl, t.textWhite]}>Let our team of experts help you with your business services.</Text>
                </Item>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.textXl, t.textWhite]}>Just click 'Get Quote' to get started or call our Team '01244 391 500'.</Text>
                </Item>
              </View>
              <View style={[t.roundedLg, t.itemsCenter, t.w5_2]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('Services')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite, t.justifyStart]}>
                  <Text style={[ t.textBlue100, t.textXl, t.p2]} onPress={() => this.handleRoute('AddQuote')}>Get Quote</Text>
                </TouchableOpacity>
              </View>
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
                { title: "Services", icon: "md-document", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons},
                { title: "Expenses", icon: "md-wallet", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons},
                { title: "Get Quote", icon: "redo-variant", tintColor: "#2F82EC", isIcon: true, iconType: iconTypes.MaterialCommunityIcons, activeTab:this.state.activeTab},
                { title: "Profile", icon: "person-outline", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              ]}
            />
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