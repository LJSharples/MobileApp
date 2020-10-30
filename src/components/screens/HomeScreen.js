import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import {
  Item,
} from 'native-base';
import { getUserDetails, getServices } from "../../graphql/queries";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { t } from 'react-native-tailwindcss';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";

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
                console.log(parseFloat(current.savings));
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
      <View style= {[ t.flex1]}>
        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <Item style={[t.mT5, t.alignCenter, t.bgBlue100, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w7_12]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textWhite]}>Hello {this.state.firstName}</Text>
              </Item>
            </View>
            <View style={[t.roundedLg, t.itemsCenter, t.w5_2]}>
              <TouchableOpacity 
                onPress={() => this.handleRoute('AddQuote')}
                style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite, t.justifyStart]}>
                <Text style={[ t.textBlue100, t.textXl, t.p2]}>Get Quotes</Text>
              </TouchableOpacity>
            </View>
          </Item>
          <Item style={[t.alignCenter, t.bgBlue200, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w7_12]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textBlue600]}> Services</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textLg, t.textBlue600]}>Active Services: {this.state.activeServices}</Text>
              </Item>
            </View>
            <View style={[t.roundedLg, t.itemsCenter, t.w5_12]}>
              <TouchableOpacity 
                onPress={() => this.handleRoute('Services')}
                style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                <Text style={[ t.textWhite, t.textXl, t.p2]} onPress={() => this.handleRoute('Services')}>View</Text>
              </TouchableOpacity>
            </View>
          </Item>
          <Item style={[t.alignCenter, t.bgPurple300, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w7_12]}>
              <Item style={[t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textPurple600]}> Expenses</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textLg, t.textPurple600]}>Monthly: £{this.state.monthlyCost}</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textLg, t.textPurple600]}>Yearly:{'     '}£{this.state.annualCost}</Text>
              </Item>
            </View>
            <View style={[t.roundedLg, t.itemsCenter, t.w5_12]}>
              <TouchableOpacity 
                onPress={() => this.handleRoute('Services')}
                style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                <Text style={[ t.textWhite, t.textXl, t.p2]} onPress={() => this.handleRoute('Services')}>View</Text>
              </TouchableOpacity>
            </View>
          </Item>
          <Item style={[t.alignCenter, t.bgGray300, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg, t.w7_12]}>
              <Item style={[t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textGray900]}> News</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textLg, t.textGray900]}>Monthly: £{this.state.monthlyCost}</Text>
              </Item>
            </View>
            <View style={[t.roundedLg, t.itemsCenter, t.w5_12]}>
              <TouchableOpacity 
                onPress={() => this.handleRoute('Services')}
                style={[ t.pX2, t.pY2,t.roundedLg, t.bgBlue100, t.justifyStart]}>
                <Text style={[ t.textWhite, t.textXl, t.p2]} onPress={() => this.handleRoute('Services')}>View</Text>
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
              { title: "Dashboard", icon: "home", tintColor: "#2F82EC", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.state.activeTab },
              { title: "Services", icon: "settings-power", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Expenses", icon: "attach-money", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Get Quote", icon: "format-quote", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Profile", icon: "verified-user", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
            ]}
          />
      </View>
    )
  }
}