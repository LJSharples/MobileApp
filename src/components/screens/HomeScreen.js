import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl
} from 'react-native'
import {
  Item,
  Tab, 
  Tabs, 
  TabHeading, 
} from 'native-base';
import { getUserDetails, getServices } from "../../graphql/queries";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { t } from 'react-native-tailwindcss';
import Header from "../forms/Header";
import NavBar from "../forms/NavBar";
import AffiliateTab from "../forms/AffiliateTab"

const background = require('../images/background.png')

export default class HomeScreen extends React.Component {
  state = {
    username: '',
    firstName: '',
    requestOptions: '',
    url: '',
    affiliateStatus: false,
    activeServices: 0,
    annualCost: 0,
    monthlyCost: 0,
    annualSave: 0,
    userProfile: {},
    userCompany: {},
    curTab: 0,
    activeTab: 0,
    page:0,
    refreshing: false,
    routes: [
      'home',
      'Services',
      'Expenses',
      'Quote',
      'Account',
      'AddQuote'
    ],
    affiliateRoutes: [
      'home',
      'Customers',
      'AffiliateExpenses',
      'Affiliates',
      'Account',
    ]
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  _handlePress = (index) => {
    this.setState({ 
      curTab: index
    })
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

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    if(user.attributes['custom:affiliate_id'] !== undefined){
      console.log("HERE");
      this.setState({ 
        affiliateStatus: true,
        page: 1
      });
      var url = "https://siugsrwucj.execute-api.eu-west-2.amazonaws.com/prod/affiliates/" + user.attributes['custom:affiliate_id'];

      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }
      this.setState({
        requestOptions: requestOptions,
        url: url
      })
    }
    this.getUserProfile(user);
    this.getServiceAndFinance(user);
  }

  getUserProfile = async (user) => {
    const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
    this.setState({ 
      username: userProfile.data["user"].username,
      firstName: userProfile.data["user"].first_name,
      userProfile: userProfile.data["user"],
      userCompany: userProfile.data["getCompany"]
    });
  }

  getServiceAndFinance = async (user) => {
    const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
    let serviceSum = userServices.data["getServices"].items.reduce(function(prev, current) {
      var dateCurrent = new Date();
      var contractEndDate = new Date(current.contract_end);
      if(isNaN(contractEndDate)){
        contractEndDate = new Date()
      }
      if(contractEndDate.toISOString() > dateCurrent.toISOString()){
        if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
            return prev + +1 
         }
      }
      return prev
    }, 0);
    this.setState({activeServices: serviceSum });
    let sum = userServices.data["getServices"].items.reduce(function(prev, current) {
      if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
          if(!isNaN(parseFloat(current.cost_year))){
            return prev + +parseFloat(current.cost_year) 
          }
       }
       return prev
    }, 0);
    let sum2 = userServices.data["getServices"].items.reduce(function(prev, current) {
      if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
          if(!isNaN(parseFloat(current.cost_month))){
            return prev + +parseFloat(current.cost_month) 
          }
       }
       return prev
    }, 0);
    let sum3 = userServices.data["getServices"].items.reduce(function(prev, current) {
        if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
            if(!isNaN(parseFloat(current.savings))){
                return prev + +parseFloat(current.savings) 
            }
        }
        return prev
    }, 0);
    this.setState({annualCost: parseFloat(sum).toFixed(2)})
    this.setState({monthlyCost: parseFloat(sum2).toFixed(2)})
    this.setState({annualSave: parseFloat(sum3).toFixed(2)})
    if(isNaN(sum3)){
        this.setState({annualSave: '0.00'})
    }
  }

  render() {
    return (
      <View source={background} style= {[ t.flex1]}>
          <Header/>
          <Tabs initialPage={this.state.page} style={[t.flex1, t.wFull]}>
            <Tab heading={ <TabHeading><Text>Dashboard</Text></TabHeading>}>
                <ImageBackground source={background} style= {[ t.flex1]}>
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                      />
                    }
                  >
                    <Item style={[t.borderTransparent]}>
                        <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt8]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}>Hi, welcome back</Text>
                        </View>
                        <View style={[t.wPx]}/>
                        <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt6]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}></Text>
                        </View>
                    </Item>
                    <Item style={[t.pX4, t.pY2, t.pt8, t.itemsStart, t.justifyStart, t.borderTransparent, t.wFull, t.h54, t.pX3, t.pY4, t.pt8]}>
                      <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt8]}>
                        <Text style={[ t.mL5, t.text4xl, t.textWhite, t.fontMedium]}>{this.state.firstName}</Text>
                      </View>  
                    </Item>
                    <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Item style={[t.w3_5, t.borderTransparent]}/>
                        <Item style={[t.w3_6,, t.borderTransparent]}>
                        <TouchableOpacity 
                            onPress={() => this.handleRoute('AddQuote')}
                            style={[ t.p1, t.roundedLg, t.bgWhite]}>
                            <Text style={[ t.textBlue100, t.textXl, t.pX4,t.fontBold, t.p2]}> Get Quote {'  '}</Text>
                        </TouchableOpacity>
                        </Item>
                        <Item style={[t.wPx]}/>
                    </Item>
                    
                    <Item style={[t.mT2, t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent, t.wFull, t.h54, t.pX3, t.pY4, t.pt8]}>
                        <Text style={[ t.text2xl, t.textWhite, t.fontMedium]}>Services</Text>
                    </Item>
                    <Item style={[t.borderTransparent]}>
                        <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt8]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}>Active Services: {this.state.activeServices}</Text>
                        </View>
                        <View style={[t.wPx]}/>
                        <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt6]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}></Text>
                        </View>
                    </Item>
                    <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Item style={[t.w3_5, t.borderTransparent]}/>
                        <Item style={[t.w3_6,, t.borderTransparent]}>
                        <TouchableOpacity 
                            onPress={() => this.handleRoute('Services')}
                            style={[ t.p1, t.roundedLg, t.bgWhite]}>
                            <Text style={[ t.textBlue100, t.textXl, t.pX4,t.fontBold, t.p2]}>My Services</Text>
                        </TouchableOpacity>
                        </Item>
                        <Item style={[t.wPx]}/>
                    </Item>

                    <Item style={[t.mT2, t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent, t.wFull, t.h54, t.pX3, t.pY4, t.pt8]}>
                        <Text style={[ t.text2xl, t.textWhite, t.fontMedium]}>Expenses</Text>
                    </Item>
                    <Item style={[t.borderTransparent]}>
                        <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt8]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}>
                          Monthly: £{this.state.monthlyCost}
                          {"\n"}
                          {' '}Yearly:{'    '}£{this.state.annualCost}</Text>
                        </View>
                        <View style={[t.wPx]}/>
                        <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt6]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}></Text>
                        </View>
                    </Item>
                    <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Item style={[t.w3_5, t.borderTransparent]}/>
                        <Item style={[t.w3_6,, t.borderTransparent]}>
                        <TouchableOpacity 
                            onPress={() => this.handleRoute('Expenses')}
                            style={[ t.p1, t.roundedLg, t.bgWhite]}>
                            <Text style={[ t.textBlue100, t.textXl, t.pX2,t.fontBold, t.p2]}>My Expenses</Text>
                        </TouchableOpacity>
                        </Item>
                        <Item style={[t.wPx]}/>
                    </Item>
                  </ScrollView>
                </ImageBackground>
            </Tab>
            <Tab heading={ <TabHeading><Text>Affiliate</Text></TabHeading>}>
                <ImageBackground source={background} style= {[ t.flex1]}>
                    <AffiliateTab requestOptions={this.state.requestOptions} handleRoute={this.handleRoute} url={this.state.url}/>
                </ImageBackground>
            </Tab>
          </Tabs>
          <NavBar activeTab={[1,0,0,0,0]} index={this.state.activeTab} affilaite={this.state.affiliateStatus} _handlePressAffiliate={this._handlePressAffiliate} _handlePress={this._handlePress}/>
      </View>
    )
  }
}