import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
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
const logo = require('../images/office.png')

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
      name, provider contracts {
        items{
          id eac length contractStart contractEnd
        }
      }
    }
  }
}`

export default class ExpensesScreen extends React.Component {
  state = {
      username: '',
      company_name: '',
      year: '2020',
      modalVisible: false,
      services: [],
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
  }

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    return (
      <View style={[t.h]}>
        <View style={[t.bgWhite, t.hAuto, t.roundedLg, t.pB4 ]}>
          <Item>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg]}>
                <Text style={[t.text2xl]}>
                  Annual Expenses
                </Text>
              </View>
            </Item>
          </Item>
        </View>
        <View style={[ t.h3]}></View>
        <View style={[t.bgWhite, t.hAuto, t.roundedLg, t.pB4 ]}>
          <Item>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                <Text style={[t.text2xl]}>
                  Monthly Breakdown for: {this.state.year}
                </Text>
                <Text>
                    Your annual expenses are broken down to each month:
                </Text>
                {
                    this.state.services.map((s, i) => 
                    <>
                        <Text onPress={() => this.showModal()} key={i}>{s.name} - {s.provider}</Text>
                        <Modal
                          animationType="slide" // fade
                          transparent={false}
                          visible={this.state.modalVisible}>
                          <View style={[t.flex1]}>
                            <ScrollView>
                              <TouchableOpacity
                                onPress={() => this.hideModal()} 
                                >
                                <Ionicons name="ios-close"/>
                              </TouchableOpacity>
                              <Text >Request Quote </Text>
                            </ScrollView>
                          </View>
                        </Modal>
                    </>
                    )
                }
              </View>
            </Item>
          </Item>
        </View>
      </View>
    )
  }
}