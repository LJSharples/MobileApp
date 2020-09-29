import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  Alert
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input
} from 'native-base'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getUserDetails, } from "../../graphql/queries";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { updateUser, updateCompany, addProfile, addCompany } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';
import CollapsibleList from "react-native-collapsible-list";

// Service colors and icons
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';

//additonal screens
import ExpensesDetails from '../forms/ExpenseDetails'

// Load the app logo
const logo = require('../images/Building.png')

export default class ProfileScreen extends React.Component {
  state = {
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
    services: [],
    modalVisible: false,
    refreshing: false,
    collapse: false,
    password1: '',
    password2: '',
  };

  showModal(){
    this.setState({
      modalVisible: true
    });
  }

  closeModal(){
    this.setState({
      modalVisible: false
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  // for password reset
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  //Setting section
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

  // Change user password for the app
  changePassword = async () => {
    const { password1, password2 } = this.state
    await Auth.currentAuthenticatedUser()
    .then(user => {
      return Auth.changePassword(user, password1, password2)
    })
    .then(data => console.log('Password changed successfully', data))
    .catch(err => {
      if (! err.message) {
        console.log('Error changing password: ', err)
        Alert.alert('Error changing password: ', err)
      } else {
        console.log('Error changing password: ', err.message)
        Alert.alert('Error changing password: ', err.message)
      }
    })
  }

  //load default values from server
  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();

    //get userprofile and services
    const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
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

  //update profile details
  async updateData(attribute, key){
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user,{
      [attribute]:  this.state[key]
    })
  }

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
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

  render() {
    return (
      <View style={[t.flex1]}>
        <ScrollView
          style={[t.hFull]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.borderTransparent]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wAuto, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Animated.Image 
                  source={logo} 
                  />
              </Item>
            </View>
            <View style={[t.w5]}/>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl]}> {this.state.company_name}</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text> {this.state.post_code}</Text>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull]}>
              <CollapsibleList
                numberOfVisibleItems={1}
                buttonContent={
                  <View>
                    <Text>Show</Text>
                  </View>
                }
              >
                <View style={styles.collapsibleItem}>
                  <Text style={[t.textXl, t.textBlue600]}>My Details</Text>
                </View>
                <View style={styles.collapsibleItem}>
                  <Item>
                    <Ionicons name="ios-mail"/>
                    <Input
                      placeholder={this.state.first_name}
                      placeholderTextColor='#adb4bc'
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      value={this.state.first_name}
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref='SecondInput'
                      onSubmitEditing={(event) => {this.refs.ThirdInput._root.focus()}}
                      onChangeText={value => this.onChangeText('first_name', value)}
                    />
                  </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.last_name}
                        value={this.state.last_name}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='ThirdInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('last_name', value)}
                      />
                    </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.phone}
                        value={this.state.phone}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('phone', value)}
                      />
                    </Item>
                  <View style={styles.collapsibleItem}>
                    <TouchableOpacity
                      style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}
                      onPress={this.updateUserProfile}>
                      <Text style={[t.textXl, t.textBlue600, t.textCenter]}>
                        Update User Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </CollapsibleList>
            </View>
          </Item> 
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull]}>
              <CollapsibleList
                numberOfVisibleItems={1}
                buttonContent={
                  <View>
                    <Text>Show</Text>
                  </View>
                }
              >
                <View style={styles.collapsibleItem}>
                  <Text style={[t.textXl, t.textBlue600]}>About your Company</Text>
                </View>
                <View style={styles.collapsibleItem}>
                  <Item>
                    <Ionicons name="ios-mail"/>
                    <Input
                      placeholder={this.state.company_name}
                      placeholderTextColor='#adb4bc'
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      value={this.state.company_name}
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref='SecondInput'
                      onSubmitEditing={(event) => {this.refs.ThirdInput._root.focus()}}
                      onChangeText={value => this.onChangeText('company_name', value)}                    />
                  </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.address1}
                        value={this.state.address1}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='ThirdInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('address1', value)}    
                      />
                    </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.address2}
                        value={this.state.address2}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('address2', value)}
                      />
                    </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.city}
                        value={this.state.city}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('city', value)}
                      />
                    </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.region}
                        value={this.state.region}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('region', value)}
                      />
                    </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        placeholder={this.state.postcode}
                        value={this.state.postcode}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FithInput'
                        name="postcode"
                        onSubmitEditing={(event) => {this.refs.FithInput._root.focus()}}
                        onChangeText={value => this.onChangeText('postcode', value)}
                      />
                    </Item>
                  <View style={styles.collapsibleItem}>
                    <TouchableOpacity
                      style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}
                      onPress={this.updateCompany}>
                      <Text style={[t.textXl, t.textBlue600, t.textCenter]}>
                        Update Company Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </CollapsibleList>
            </View>
          </Item> 
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull]}>
              <CollapsibleList
                numberOfVisibleItems={1}
                buttonContent={
                  <View>
                    <Text>Show</Text>
                  </View>
                }
              >
                <View style={styles.collapsibleItem}>
                  <Text style={[t.textXl, t.textBlue600]}>Settings</Text>
                </View>
                <View style={[t.pX2, t.pY2, t.pt4, t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                  <Text style={[ t.textXl]}>Change password</Text>              
                </View>
                <View style={styles.collapsibleItem}>
                  {/* Old password */}
                  <Item rounded style={[t.mT5]}>
                    <Icon
                      active
                      name='lock'
                    />
                    <Input
                      placeholder='Old password'
                      placeholderTextColor='#adb4bc'
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus()}}
                      onChangeText={value => this.onChangeText('password1', value)}
                    />
                  </Item>    
                  {/* New password */}              
                  <Item rounded>
                    <Icon
                      active
                      name='lock'
                    />
                    <Input
                      placeholder='New password'
                      placeholderTextColor='#adb4bc'
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password2', value)}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={this.changePassword}
                    style={[t.mT5, t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                    <Text style={[t.textXl]}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.collapsibleItem}>
                  <TouchableOpacity
                    style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}
                    onPress={this.signOutAlert}>
                    <Icon name='md-power'/>
                    <Text>
                      Sign out
                    </Text>
                  </TouchableOpacity>
                </View>
              </CollapsibleList>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull]}>
                <View style={styles.collapsibleItem}>
                  <Text style={[t.textXl, t.textBlue600]}>Expenses</Text>
                </View>
                <View style={styles.collapsibleItem}>
                  <TouchableOpacity
                    style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}
                    onPress={() => this.showModal()}>
                    <Text>
                      View Expenses
                    </Text>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide" // fade
                    transparent={false}
                    visible={this.state.modalVisible}>
                    <View style={[ t.flex1 ]}>
                      <ScrollView>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w3_4, t.wAuto, t.itemsCenter]}>
                            <Item style={[t.pX2, t.pY8, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                              <Text style={[ t.textXl]}> Annual Expenses</Text>
                            </Item>
                          </View>
                          <View style={[t.w5]}/>
                          <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_4, t.itemsEnd]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsEnd, t.justifyEnd, t.borderTransparent]}>
                              <TouchableOpacity
                                onPress={() => this.closeModal()} 
                                >
                                <Ionicons name="ios-close"/>
                              </TouchableOpacity>
                            </Item>
                          </View>
                        </Item>
                        <ExpensesDetails
                          services={this.state.services}/>
                      </ScrollView>
                    </View>
                  </Modal>
                </View>
            </View>
          </Item>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10
  }
})