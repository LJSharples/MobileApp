import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import {
  Item
} from 'native-base'
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getServices, getUserDetails } from '../../graphql/queries'
import { FontAwesome5 } from '@expo/vector-icons';
import { updateCompany, updateUser} from '../../graphql/mutations'
import { t } from 'react-native-tailwindcss';
import TabBar, { iconTypes } from "react-native-fluidbottomnavigation";
import CollapsibleList from "react-native-collapsible-list";

export default class ProfileScreen extends React.Component {
  state = {
    activeTab: 4,
    curTab: 4,
    userProfile: {},
    userCompany: {},
    full_name: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    company_number: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    region: "",
    num_employees: "",
    years_trading: "",
    yearly_turnover: "",
    industry: "",
    user_name: "",
    chevron1: false,
    chevron2: false,
    chevron3: false,
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

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
    this.setState({ email: user.email});
    this.setState({ userProfile: userProfile.data["user"]});
    this.setState({
      user_name: user.username,
      full_name: userProfile.data["user"].full_name,
      first_name: userProfile.data["user"].first_name,
      last_name: userProfile.data["user"].last_name,
      phone: userProfile.data["user"].phone
    });
    this.setState({ userCompany: userProfile.data["getCompany"]});
    this.setState({
      company_name: userProfile.data["getCompany"].Data,
      address1: userProfile.data["getCompany"].address1,
      address2: userProfile.data["getCompany"].address2,
      city: userProfile.data["getCompany"].city,
      postcode: userProfile.data["getCompany"].postcode,
      region: userProfile.data["getCompany"].region,
      company_number: userProfile.data["getCompany"].company_number,
      years_trading: userProfile.data["getCompany"].years_trading,
      yearly_turnover: userProfile.data["getCompany"].yearly_turnover,
      num_employees: userProfile.data["getCompany"].num_employees,
      industry: userProfile.data["getCompany"].industry
    });
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  updateUserProfile = async () => {
    const data = {
        user_name: this.state.user_name,
        full_name: this.state.first_name + " " + this.state.last_name,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        phone: this.state.phone
    }
    try {
        await API.graphql(graphqlOperation(updateUser, data));
      } catch (err) {
        console.log("Error:")
        console.log(err);
    }
  }

  updateCompany = async () => {
    const data = {
      user_name: this.state.user_name,
      company_name: this.state.company_name,
      company_number: this.state.company_number,
      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.city,
      postcode: this.state.postcode,
      region: this.state.region,
      years_trading: this.state.years_trading,
      num_employees: this.state.num_employees,
      yearly_turnover: this.state.yearly_turnover,
      industry: this.state.industry
    }
    try{
      await API.graphql(graphqlOperation(updateCompany, data));
    }catch(err){
      console.log("Error:");
      console.log(err);
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  // Sign out from the app
  signOutAlert = async () => {
    await Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from the app?',
      [
        {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
        // Calling signOut
        {text: 'OK', onPress: () => this.signOut()}, 
      ],
      { cancelable: false }
    )
  }
  // Confirm sign out
  signOut = async () => {
    await Auth.signOut()
    .then(() => {
      console.log('Sign out complete')
      this.props.navigation.navigate('Authloading')
    })
    .catch(err => console.log('Error while signing out!', err))
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
          <Item style={[ t.mT5,t.alignCenter, t.wFull, t.borderTransparent]}>
            <View style={[t.pX3, t.pY4, t.pt8, t.roundedLg]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textBlue600]}>My Details</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl, t.textBlue600]}>Manage your account details</Text>
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
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>My Details
                  {'                                             '} 
                  { this.state.chevron1 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                  </Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite]}>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>First Name</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('first_name', value)} value={this.state.first_name}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Last Name</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('last_name', value)} value={this.state.last_name}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Mobile number</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('phone', value)} value={this.state.phone}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mT2]}>
                    <TouchableOpacity
                      style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.pX2, t.pY2,t.roundedLg, t.bgBlue100]}
                      onPress={this.updateUserProfile}>
                      <Text style={[ t.textWhite, t.textXl, t.p2, t.textCenter]}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </CollapsibleList>
          </Item>
          <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <CollapsibleList
              numberOfVisibleItems={0}
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600]}
              buttonPosition="top"
              onToggle={() => {
                this.swapChevron2();
              }}
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>About Your Company
                  {'                         '} 
                  { this.state.chevron2 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                  </Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite]}>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Company Name</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('company_name', value)} value={this.state.company_name}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Company Number</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('company_number', value)} value={this.state.company_number}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Address 1</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('address1', value)} value={this.state.address1}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Address 2</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('address2', value)} value={this.state.address2}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>City</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('city', value)} value={this.state.city}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Region</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('region', value)} value={this.state.region}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Post Code</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} onChangeText={value => this.onChangeText('postcode', value)} value={this.state.postcode}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mT2]}>
                    <TouchableOpacity
                      style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.pX2, t.pY2,t.roundedLg, t.bgBlue100]}
                      onPress={this.updateCompany}>
                      <Text style={[ t.textWhite, t.textXl, t.p2, t.textCenter]}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>Additional Information
                  {'                        '} 
                  { this.state.chevron3 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                  </Text>
                </View>
              }
            >
              <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite]}>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>How many years have you been trading?</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} value={this.state.years_trading}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>What is your estimated yearly turn-over?</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} value={this.state.yearly_turnover}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>How many employees do you have?</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} value={this.state.num_employees}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mB1]}>
                    <Text>Which industry does your business form part of?</Text>
                  </View>
                  <View style={[ t.flex1, t.selfStretch]}>
                    <TextInput style={[ t.border, t.borderGray500, t.p2]} value={this.state.industry}/>
                  </View>
                  <View style={[ t.flex1, t.selfStretch, t.mT2]}>
                    <TouchableOpacity
                      style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.pX2, t.pY2,t.roundedLg, t.bgBlue100]}
                      onPress={this.updateCompany}>
                      <Text style={[ t.textWhite, t.textXl, t.p2, t.textCenter]}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </CollapsibleList>
          </Item>
          <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <View style={[ t.flex1, t.selfStretch, t.mT2]}>
              <TouchableOpacity
                style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.pX2, t.pY2,t.roundedLg, t.bgBlue100]}
                onPress={this.signOutAlert}>
                <Text style={[ t.textWhite, t.textXl, t.p2, t.textCenter]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </Item>
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
              { title: "Services", icon: "settings-power", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Expenses", icon: "attach-money", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Get Quote", icon: "format-quote", tintColor: "#4299e1", isIcon: true, iconType: iconTypes.MaterialIcons},
              { title: "Profile", icon: "verified-user", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.state.activeTab},
            ]}
          />
      </View>
    )
  }
  
}