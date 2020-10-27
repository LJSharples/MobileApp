import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import {
  Item
} from 'native-base'
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getServices, getUserDetails } from '../../graphql/queries'
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
    routes: [
      'Home',
      'Services',
      'Expenses',
      'quote',
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
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgBlue100]}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>My Details</Text>
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
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgBlue100]}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>About Your Company</Text>
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
              wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgBlue100]}
              buttonPosition="top"
              buttonContent={
                <View style={[ t.p3, t.flex1]}>
                  <Text style={[ t.textWhite, t.textXl, t.p2]}>Additional Information</Text>
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
                { title: "Services", icon: "settings-power", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Expenses", icon: "attach-money", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Get Quote", icon: "format-quote", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons},
                { title: "Profile", icon: "verified-user", tintColor: "blue", isIcon: true, iconType: iconTypes.MaterialIcons, activeTab:this.state.activeTab},
            ]}
          />
      </View>
    )
  }
  
}