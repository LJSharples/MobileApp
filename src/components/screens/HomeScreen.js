import React from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import {
  Item,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

//additional sccreens and views
import ExpensesDetails from '../forms/ExpenseDetails';
import ExpenseChart from '../forms/ExpenseChart';

// Load the app logo
const logo = require('../images/Graph.png')

export default class HomeScreen extends React.Component {
  state = {
    username: '',
    refreshing: false,
    services: [],
    modalVisible: false,
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

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ username: user.username});
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
          <Item style={[t.pX6, t.pY4, t.pt8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
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
          <Item style={[t.pX6, t.pY4, t.pt8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
            <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.bgGreen200, t.itemsCenter]}>
              <TouchableOpacity onPress={() => this.showModal()}>
                <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                  <Text style={[ t.textXl]}> Monthly Expense Breakdown</Text>
                </Item>
                <Item style={[t.pX6, t.pY2, t.pt8,t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                  <Text style={[t.textSm]} onPress={() => this.showModal()}>As we enter the new financical year, take some time to review your business needs and ensure long term sustainability</Text>
                </Item>
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
                    <ExpensesDetails/>
                  </ScrollView>
                </View>
              </Modal>
            </View>
          </Item>
          <ExpenseChart/>
        </ScrollView>
      </View>
    )
  }
}