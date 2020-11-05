import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import {
  Item,
} from 'native-base';
import { getUserDetails, getServices } from "../../graphql/queries";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { t } from 'react-native-tailwindcss';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";

const background = require('../images/background.png')

export default class HomeScreen extends React.Component {
  state = {
    username: '',
    firstName: '',
    activeServices: 0,
    annualCost: 0,
    monthlyCost: 0,
    annualSave: 0,
    userProfile: {},
    userCompany: {},
    curTab: 0,
    activeTab: 0,
    refreshing: false,
    routes: [
      'home',
      'Services',
      'Expenses',
      'Quote',
      'Account',
      'AddQuote'
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

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
    this.setState({ 
      username: user.username
    });

    this.setState({ firstName: userProfile.data["user"].first_name});
    this.setState({ userProfile: userProfile.data["user"]});
    this.setState({ userCompany: userProfile.data["getCompany"]});

    const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
    let serviceSum = userServices.data["getServices"].items.reduce(function(prev, current) {
        if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
            return prev + +1 
         }
         return prev
    }, 0);
    this.setState({activeServices: serviceSum});

    let sum = userServices.data["getServices"].items.reduce(function(prev, current) {
      if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
          return prev + +parseFloat(current.cost_year) 
       }
       return prev
    }, 0);
    let sum2 = userServices.data["getServices"].items.reduce(function(prev, current) {
      if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
          return prev + +parseFloat(current.cost_month) 
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
      <ImageBackground source={background} style= {[ t.flex1]}>
        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <Item style={[t.mT5, t.alignCenter, t.justifyCenter, t.wFull, t.h48, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
              <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textWhite, t.fontMedium]}>Hello</Text>
              </Item>
              <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text3xl, t.textWhite]}>{this.state.firstName}</Text>
              </Item>
              <View style={[ t.flex1, t.mT2, t.justifyCenter, t.borderTransparent, t.itemsEnd]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('AddQuote')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                  <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>Get Quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Item>
          <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
              <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textWhite, t.fontMedium]}>Services</Text>
              </Item>
              <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textWhite]}>Active Services: {this.state.activeServices}</Text>
                <Item style={[t.pX8, t.borderTransparent]}/>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('Services')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                  <Text style={[ t.textBlue600, t.textXl, t.fontMedium, t.p2]}>Services</Text>
                </TouchableOpacity>
              </Item>
              <Item style={[t.justifyEnd, t.pX8, t.borderTransparent]}>
              </Item>
            </View>
          </Item>
          <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
              <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textWhite, t.fontMedium]}>Expenses</Text>
              </Item>
              <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textWhite]}>
                  Monthly: £{this.state.monthlyCost}
                  {"\n"}
                  Yearly:{'     '}£{this.state.annualCost}
                </Text>
                <Text style={[ t.textXl, t.textWhite]}></Text>
                <Item style={[t.pX4, t.borderTransparent]}/>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('Expenses')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                  <Text style={[ t.textPurple600, t.textXl, t.fontMedium, t.p2]}>Expenses</Text>
                </TouchableOpacity>
              </Item>
              <Item style={[t.justifyEnd, t.pX8, t.borderTransparent]}>
              </Item>
            </View>
          </Item>
          <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
              <Item style={[t.pX8, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textWhite, t.fontMedium]}>News</Text>
              </Item>
              <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textWhite]}>
                Lorem ipsum dolor sit. 
                </Text>
                <Text style={[ t.textXl, t.textWhite]}></Text>
                <Item style={[t.pX6, t.borderTransparent]}/>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('Expenses')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                  <Text style={[ t.textGray900, t.textXl, t.fontMedium, t.p2]}>View</Text>
                </TouchableOpacity>
              </Item>
              <Item style={[t.justifyEnd, t.pX8, t.borderTransparent]}>
              </Item>
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
              { title: "Dashboard", icon: "home", tintColor: "#2F82EC", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.state.activeTab },
              { title: "Services", icon: "settings-power", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Expenses", icon: "attach-money", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Get Quote", icon: "format-quote", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Profile", icon: "verified-user", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
            ]}
          />
      </ImageBackground>
    )
  }
}