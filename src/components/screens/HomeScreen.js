import React from 'react'
import {
  StyleSheet,
  View,
  Text,
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

export default class HomeScreen extends React.Component {
  state = {
    username: ''
  };

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser(); 
    const username = user.username;
    this.setState({ username: username});
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <ScrollView>
            <Item style={styles.spacer}>
              <View style={styles.logoContainer}>
                <Text>Hi {this.state.username}</Text>
              </View>
            </Item>
            <Item style={styles.section}>
              <View style={styles.logoContainer}>
                <Ionicons name="ios-bulb" style={styles.iconStyle}> Suggestions</Ionicons>
                <Text>Services</Text>
              </View>
            </Item>
            <Item style={styles.spacer}>
              <View style={styles.logoContainer}>
                <Ionicons name="ios-cash" style={styles.iconStyle}> Monthly Expense Breakdown</Ionicons>
                <Text>Monthly Expense Breakdown</Text>
              </View>
            </Item>
            <Item style={styles.spacer}>
              <View rounded style={styles.logoContainer}>
                <Ionicons name="ios-power" style={styles.iconStyle}> Services</Ionicons>
                <Text>Customers</Text>
              </View>
            </Item>
            <Item style={styles.spacer}>
              <View rounded style={styles.logoContainer}>
                <Ionicons name="ios-people" style={styles.iconStyle}> Your Customers</Ionicons>
                <Text>Customers</Text>
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
    marginTop: 10,
  },
  spacer: {
    marginTop: 15
  },
  logoContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  iconStyle: {
    fontSize: 20,
    marginRight: 15
  },
})