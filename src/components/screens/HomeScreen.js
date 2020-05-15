import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Button,
  Image,
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

// Load the app logo
const logo = require('../images/Graph.png')

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
  }
  render() {
    return (
      <View style={[t.wFull]}>
        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <Item style={[t.pX6, t.pY4, t.pt8, t.alignCenter, t.justifyCenter]}>
            <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.bgIndigo200, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Ionicons name="ios-bulb" style={[ t.text2xl]}> Suggestions</Ionicons>
              </Item>
              <Item style={[t.pX6, t.pY2, t.pt8,t.itemsCenter, t.justifyCenter]}>
                <Text style={[t.textSm]}>As we enter the new financical year, take some time to review your business needs and ensure long term sustainability</Text>
              </Item>
              <Item style={[t.itemsEnd, t.justifyEnd]}>
                <TouchableOpacity 
                  onPress={() => this.handleRoute('Services')}
                  style={[ t.pX2, t.pY2,t.roundedLg, t.bgIndigo100, t.justifyStart]}>
                  <Text onPress={() => this.handleRoute('Services')}>Request Quotes</Text>
                </TouchableOpacity>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX6, t.pY4, t.pt8, t.alignCenter, t.justifyCenter]}>
            <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.bgGreen200, t.itemsCenter]}>
              <TouchableOpacity>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.textXl]}> Monthly Expense Breakdown</Text>
                </Item>
                <Item style={[t.pX6, t.pY2, t.pt8,t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                  <Text style={[t.textSm]} onPress={() => this.handleRoute('Expenses')}>As we enter the new financical year, take some time to review your business needs and ensure long term sustainability</Text>
                </Item>
              </TouchableOpacity>
            </View>
          </Item>
          <Item style={[t.pX6, t.pY4, t.pt8, t.alignCenter, t.justifyCenter]}>
            <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.bgRed300, t.itemsCenter]}>
              <TouchableOpacity 
                  onPress={() => this.handleRoute('Expenses')}>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.textXl]}> Annual Expenses</Text>
                </Item>
                <Item style={[t.pX4, t.pY4, t.pT8, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                  <Image 
                    source={logo}
                    style={[t.alignCenter, t.justifyCenter]}
                  />
                </Item>
              </TouchableOpacity>
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
})