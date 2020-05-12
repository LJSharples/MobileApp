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
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input
} from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { API, graphqlOperation } from 'aws-amplify';
import { t } from 'react-native-tailwindcss';
import CollapsibleList from "react-native-collapsible-list";

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

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
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  showModal(){
    this.setState({ modalVisible: true})
  }

  hideModal(){
    this.setState({ modalVisible: false});
  }

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

  async updateData(attribute, key){
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user,{
      [attribute]:  this.state[key]
    })
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
                  <Item style={[t.borderTransparent]}>
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
                  <Item style={[t.borderTransparent]}>
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
                  <Item style={[t.borderTransparent]}>
                      <Ionicons name="ios-mail" style={styles.iconStyle} />
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
                { this.state.services.map((item, key) => {
                  return (
                    <View key={key} style={styles.collapsibleItem}>
                      <Text style={styles.serviceContainer} onPress={() => this.showModal()}>{item.name} {item.provider}</Text>
                      { item.contracts.items.map((unit, key2) => {
                        return <Text style={styles.financeContainer} key={key2}>{unit.contractStart} - {unit.contractEnd}: Total length: {unit.length}</Text>
                      })}
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
                  <Text style={[t.textXl, t.textBlue600]}>Expenses</Text>
                </View>
                { this.state.services.map((item, key) => {
                  return (
                    <View key={key} style={styles.collapsibleItem}>
                      <Text style={styles.serviceContainer}> {item.provider} - {item.name}</Text>
                      <Text style={styles.financeContainer} >
                        {item.contracts.items.map((unit,key2) => 
                          <Text style={styles.financeContainer} key={key2}>
                            {unit.expenses.items.map((cost,key3) => 
                              <Text key={key3}>
                                {cost.paidDate}: £{cost.value}
                              </Text>
                            )}
                          </Text>
                        )}
                        </Text>
                    </View>
                  );
                })} 
              </CollapsibleList>
            </View>
          </Item>      
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  serviceContainer: {
    backgroundColor: '#408C45',
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10
  },
  financeContainer: {
    backgroundColor: '#B9B9E3',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  wrapperCollapsibleList: {
    flex: 1,
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10
  }
})