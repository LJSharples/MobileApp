import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input
} from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { API, graphqlOperation } from 'aws-amplify';
import { listServices } from '../../graphql/queries';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

// Load the app logo
const logo = require('../images/mb.png')

export default class ProfileScreen extends React.Component {
  state = {
    username: '',
    company_name: '',
    industry_sector: '',
    post_code: '',
    industry_sector: '',
    services: [],
    modalVisible: false,
  };

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

    const serviceData = await API.graphql(graphqlOperation(listServices, {
      filter: {
        business: {
          contains: this.state.company_name
        }
      }
    }))
    this.setState({ services: serviceData.data.listServices.items })
  }

  async updateData(attribute, key){
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user,{
      [attribute]:  this.state[key]
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <ScrollView>
            <Item style={styles.spacer}>
              <View style={styles.logoContainer}>
                <Animated.Image 
                  source={logo} 
                  style={{ width: 158, height: 117}}/>
                <Text>{this.state.company_name}</Text>
              </View>
            </Item>
            <Item style={styles.section}>
              <View style={styles.logoContainer}>
                <Text>Company Details</Text>
                {/* Company section */}
                {/* Company Address */}
                <Item style={styles.itemStyle}>
                  <Ionicons name="ios-mail" style={styles.iconStyle} />
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
                <Item style={styles.itemStyle}>
                    <Ionicons name="ios-mail" style={styles.iconStyle} />
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
                <Item style={styles.itemStyle}>
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
            </Item>
            <Item style={styles.spacer}>
              <View style={styles.logoContainer}>
                <Text>Services</Text>
                {
                  this.state.services.map((s, i) => 
                  <>
                    <Text key={i} onPress={() => this.showModal()}>{s.name} - {s.provider}</Text>
                    <Modal
                      animationType="slide" // fade
                      transparent={false}
                      visible={this.state.modalVisible}>
                      <View style={{ flex: 1 }}>
                        <ScrollView>
                          <TouchableOpacity
                            onPress={() => this.hideModal()} 
                            style={styles.closeButtonStyle}>
                            <Ionicons name="ios-close" style={styles.closeIconStyle}/>
                            <Text>Your Contracts for this service.</Text>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    </Modal>
                    </>
                  )
                }
              </View>
            </Item>
            <Item style={styles.spacer}>
              <View style={styles.logoContainer}>
                <Text>Expenses</Text>
              </View>
            </Item>
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    marginBottom: 20,
  },
  section:{
    marginTop: 10
  },
  spacer: {
    marginTop: 2.5
  },
  logoContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  closeIconStyle: {
    fontSize: 30,
    paddingLeft: 25,
    paddingTop: 20,
    marginRight: 15,
    alignItems: 'flex-end', 
  },
  closeHeaderStyle:{
    fontSize: 25, 
    paddingTop: 5, 
    marginLeft: 15,
    color: '#39F',
    alignItems: "flex-start"
  },
  closeButtonStyle: {
    marginRight: 5,
    alignItems: "flex-end"
  },
})