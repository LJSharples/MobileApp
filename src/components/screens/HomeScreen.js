import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
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
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";

const background = require('../images/background.png')
const mblogo = require('../images/managedbill-corporate-logo.png');

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

      var dateCurrent = new Date();
      var contractEndDate = new Date(current.contract_end);
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
          <Item style={[ t.mT12, t.mB6, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <Image 
              source={mblogo}
              style={[ t.objectContain]}
            />
          </Item>
          <Tabs style={[t.flex1, t.wFull]}>
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
                    <Item style={[t.mT5, t.alignCenter, t.justifyCenter, t.wFull, t.h54, t.borderTransparent]}>
                      <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text style={[ t.textXl, t.textWhite, t.fontMedium]}>Hi, welcome back</Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text style={[ t.text4xl, t.textWhite]}>{this.state.firstName}</Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Item style={[t.w1_3, t.borderTransparent]}/>
                          <Item style={[t.w1_3, t.wFull, t.borderTransparent]}>
                            <TouchableOpacity 
                              onPress={() => this.handleRoute('AddQuote')}
                              style={[ t.p1, t.roundedLg, t.bgWhite]}>
                              <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>Get Quote</Text>
                            </TouchableOpacity>
                          </Item>
                          <Item style={[t.w1_3, t.borderTransparent]}/>
                        </Item>
                      </View>
                    </Item>
                    <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.h40, t.borderTransparent]}>
                      <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text style={[ t.text2xl, t.textWhite, t.fontMedium]}>Services</Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Text style={[ t.textXl, t.textWhite]}>Active Services: {this.state.activeServices}</Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Item style={[t.w1_3, t.borderTransparent]}/>
                          <Item style={[t.w1_3, t.wFull, t.borderTransparent]}>
                            <TouchableOpacity 
                              onPress={() => this.handleRoute('Services')}
                              style={[ t.p1, t.roundedLg, t.bgWhite]}>
                              <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>My Services</Text>
                            </TouchableOpacity>
                          </Item>
                          <Item style={[t.w1_3, t.borderTransparent]}/>
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
                            Yearly:{'    '}£{this.state.annualCost}
                          </Text>
                          <Text style={[ t.textXl, t.textWhite]}></Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <Item style={[t.w1_3, t.borderTransparent]}/>
                          <Item style={[t.w1_3, t.wFull, t.borderTransparent]}>
                            <TouchableOpacity 
                              onPress={() => this.handleRoute('Expenses')}
                              style={[ t.p1, t.roundedLg, t.bgWhite]}>
                              <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>My Expenses</Text>
                            </TouchableOpacity>
                          </Item>
                          <Item style={[t.w1_3, t.borderTransparent]}/>
                        </Item>
                      </View>
                    </Item>
                  </ScrollView>
                </ImageBackground>
            </Tab>
            <Tab heading={ <TabHeading><Text>Affiliate</Text></TabHeading>}>
                <ImageBackground source={background} style= {[ t.flex1]}>
                  <Item style={[t.mT5, t.alignCenter, t.justifyCenter, t.wFull, t.h54, t.borderTransparent]}>
                    <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
                      <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Text style={[ t.textXl, t.textWhite, t.fontMedium]}>Hi, welcome back</Text>
                      </Item>
                      <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                        <Text style={[ t.text4xl, t.textWhite]}>{this.state.firstName}</Text>
                        <Item style={[t.pX16, t.borderTransparent]}/>
                        <TouchableOpacity 
                          onPress={() => this.handleRoute('AddQuote')}
                          style={[ t.pX2, t.pY2,t.roundedLg, t.bgWhite]}>
                          <Text style={[ t.textBlue100, t.textXl, t.fontMedium, t.p2]}>Get Quote</Text>
                        </TouchableOpacity>
                      </Item>
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
                          <Text style={[ t.textBlue600, t.textXl, t.fontMedium, t.p2]}>My Services</Text>
                        </TouchableOpacity>
                      </Item>
                      <Item style={[t.justifyEnd, t.pX8, t.borderTransparent]}>
                      </Item>
                    </View>
                  </Item>
                  <Item style={[ t.alignCenter, t.justifyCenter, t.wFull, t.h40, t.pB4, t.borderTransparent]}>
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
                          <Text style={[ t.textPurple600, t.textXl, t.fontMedium, t.p2]}>My Expenses</Text>
                        </TouchableOpacity>
                      </Item>
                      <Item style={[t.justifyEnd, t.pX8, t.borderTransparent]}>
                      </Item>
                    </View>
                  </Item>
                </ImageBackground>
            </Tab>
          </Tabs>
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
              { title: "Services", icon: "md-document", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons},
              { title: "Expenses", icon: "md-wallet", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.Ionicons},
              { title: "Get Quote", icon: "redo-variant", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialCommunityIcons},
              { title: "Profile", icon: "person-outline", tintColor: "#bee3f8", isIcon: true, iconType: iconTypes.MaterialIcons},
            ]}
          />
      </View>
    )
  }
}