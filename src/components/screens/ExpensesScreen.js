import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Modal
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input,
  DatePicker
} from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { API, graphqlOperation } from 'aws-amplify';
import { t } from 'react-native-tailwindcss';

// Load the app logo
const logo = require('../images/office.png');
const graph = require('../images/Graph.png');

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

//custom queries
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

export default class ExpensesScreen extends React.Component {
  state = {
      username: '',
      company_name: '',
      year: '2020',
      modalVisible: false,
      monthCost: '750.23',
      services: [],
      monthNames: [
        "January",
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September",
        "October",
        "November", 
        "December"
      ]
  };

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
    this.setState({ callBack: new Date()}) 

    const currentUserInfo = await Auth.currentUserInfo();
    this.setState({ company_name: currentUserInfo.attributes['custom:company_name'] });

    const compDetails = {
      company: this.state.company_name
    };
    const serviceData = await API.graphql(graphqlOperation(ListServicesComp, compDetails))
    this.setState({ services: serviceData.data.listServices.items })
    console.log(this.state.services);

    //set months
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
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.mT5,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text style={[ t.textXl]}> Annual Expenses</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Image 
                  source={graph}
                  style={[t.alignCenter, t.justifyCenter]}
                />
              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text style={[ t.textXl]}> Monthly Breakdown for: {this.state.year}</Text>
              </Item>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text>Your annual expenses are broken down to each month:</Text>
              </Item>
              <View rounded>
                {
                  this.state.monthNames.map((s, i) => 
                    <>
                      <View style={[t.roundedLg, t.w1_2, t.wAuto, t.mT2, t.itemsCenter]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                          <Text key={i} onPress={() => this.showModalService()} style={[t.itemsStart, t.contentStart]}>{s} - </Text>
                          <Text key={i} onPress={() => this.showModalService()}>£{this.state.monthCost}</Text>
                        </Item>
                      </View>
                    </>
                  )
                }
              </View>
            </View>
          </Item>
        </ScrollView>
      </View>
    )
  }
}