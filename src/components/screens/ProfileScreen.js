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
import { API, graphqlOperation } from 'aws-amplify';
import { t } from 'react-native-tailwindcss';
import CollapsibleList from "react-native-collapsible-list";

// AWS Amplify modular import
import Auth from '@aws-amplify/auth';

// Service colors and icons
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';

//additonal screens
import ExpensesDetails from '../forms/ExpenseDetails'

// Load the app logo
const logo = require('../images/Building.png')

// custom queries
const ListServicesComp = `query listServices($company: String!){
  listServices(filter:{
    business:{
      contains:$company
    }
  }){
    items{
      id name, provider contracts {
        items{
          id eac length contractStart contractEnd expenses{
            items{
              id value paidDate
            }
          }
        }
      }
    }
  }
}`;

export default class ProfileScreen extends React.Component {
  state = {
    username: '',
    company_name: '',
    industry_sector: '',
    post_code: '',
    industry_sector: '',
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

  // Change state input
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
    const username = user.username;
    this.setState({ username: username});

    const currentUserInfo = await Auth.currentUserInfo();
    this.setState({ company_name: currentUserInfo.attributes['custom:company_name'] });
    this.setState({ post_code: currentUserInfo.attributes['custom:post_code'] });
    this.setState({ industry_sector: currentUserInfo.attributes['custom:industry_sector'] });

    const compDetails = {
      company: this.state.company_name
    };

    const serviceData = await API.graphql(graphqlOperation(ListServicesComp, compDetails))
    this.setState({ services: serviceData.data.listServices.items })
    console.log(this.state.services)
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
                      style={styles.input}
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
                      onChangeText={value => this.onChangeText('company_name', value)}
                      onEndEditing={() => this.updateData('custom:company_name', 'company_name')}
                    />
                  </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        style={styles.input}
                        placeholder={this.state.post_code}
                        value={this.state.post_code}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='ThirdInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('post_code', value)}
                        onEndEditing={() => this.updateData('custom:post_code', 'post_code')}
                      />
                    </Item>
                  <Item>
                      <Ionicons name="ios-mail"/>
                      <Input
                        style={styles.input}
                        placeholder={this.state.industry_sector}
                        value={this.state.industry_sector}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('industry_sector', value)}
                        onEndEditing={() => this.updateData('custom:industry_sector', 'industry_sector')}
                      />
                    </Item>
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
                  <Text style={[t.textXl, t.textBlue600]}>Services</Text>
                </View>
                { this.state.services.map((s, i) => {
                  return (
                    <View key={i} style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.name]}>
                      <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                        <FontAwesome5 name={serviceIcons[s.name]} size={24} color="black" style={[t.pE8]}/>
                        <Text key={i} style={[t.textXl, t.itemsCenter, t.pE8]}>{s.name}</Text>
                      </Item>
                      <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                        { s.contracts.items.map((unit, key2) => {
                          return <Text style={styles.financeContainer} key={key2}>{unit.contractStart} - {unit.contractEnd}: Total length: {unit.length}</Text>
                        })}
                      </Item>
                    </View>
                  );
                })} 
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
  financeContainer: {
    backgroundColor: '#B9B9E3',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10
  }
})