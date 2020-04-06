import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ScrollView,
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input
} from 'native-base'
import { Ionicons } from '@expo/vector-icons';

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
    industry_sector: ''
  };

  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    const username = user.username;
    this.setState({ username: username});

    const currentUserInfo = await Auth.currentUserInfo();
    this.setState({ company_name: currentUserInfo.attributes['custom:company_name'] });
    this.setState({ post_code: currentUserInfo.attributes['custom:post_code'] });
    this.setState({ industry_sector: currentUserInfo.attributes['custom:industry_sector'] });
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
})