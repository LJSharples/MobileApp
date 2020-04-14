import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
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

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

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

export default class HomeScreen extends React.Component {
  state = {
    username: '',
    company_name: '',
    refreshing: false,
    services: [],
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser(); 
    const username = user.username;
    this.setState({ username: username});

    const currentUserInfo = await Auth.currentUserInfo();
    this.setState({ company_name: currentUserInfo.attributes['custom:company_name'] });

    const compDetails = {
      company: this.state.company_name
    }
    const serviceData = await API.graphql(graphqlOperation(ListServicesComp, compDetails))
    this.setState({ services: serviceData.data.listServices.items })
    console.log(this.state.services)
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>  
          <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
            <Item style={styles.spacer}>
              <View style={styles.logoContainer}>
            <Text>Hi {this.state.username} of {this.state.company_name}</Text>
              </View>
            </Item>
            <Item style={styles.section}>
              <View style={styles.logoContainer}>
                <Ionicons name="ios-bulb" style={styles.iconStyle}> Suggestions</Ionicons>
                <Text>As we enter the new financical year, take some time to review your business needs and ensure long term sustainability</Text>
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
                <View>
                  { this.state.services.map((item, key) => {
                    return (
                      <View key={key}>
                        <Text style={styles.serviceContainer} onPress={() => this.showModal()}>{item.name} {item.provider}</Text>
                        { item.contracts.items.map((unit, key2) => {
                          return <Text style={styles.financeContainer} key={key2}>{unit.contractStart} - {unit.contractEnd}: Total length: {unit.length}</Text>
                        })}
                      </View>
                    );
                  })} 
                </View>
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