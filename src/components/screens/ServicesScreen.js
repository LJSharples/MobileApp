import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native'
import {
  Item
} from 'native-base'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { API, graphqlOperation } from 'aws-amplify';
import { createService } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';
import CollapsibleList from "react-native-collapsible-list";

// Service colors and icons
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

//modal components
import ServiceData from '../forms/ServiceDetails';
import CostData from '../forms/CostDeatils';
import CallbackData from '../forms/CallbackDetails';

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
}`;

export default class ServicesScreen extends React.Component {
  state = {
    username: '',
    company_name: '',
    newService: '',
    isHidden: false,
    modalVisible: false,
    services: [],
    contracts: [],
    currentStep: 1,
    serviceType: '',
    contractLength: '',
    costType: '',
    switchValue: true,
    callbackMinutes: '',
    callbackHour: ''
  };

  showModal(){
    this.setState({ modalVisible: true})
  }

  hideModal(){
    this.setState({ modalVisible: false});
    this.setState({ makeRequest: false });
    this.setState({ currentStep: 1});
  }

  toggleSwitch(value){
    this.setState({ switchValue: value });
  };

  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  async submitRequest(){
    const serviceDetails = {
      input: {
        business: this.state.company_name,
        name: this.state.newService,
        provider: this.state.serviceProvider, 
      }
    }
    try {
      const result = await API.graphql(graphqlOperation(createService, serviceDetails));

      const newRecord = result.data.createService
      //add to existing services.
      this.setState(prevState => ({
        services: [...prevState.services, newRecord]
      }))

      console.log("Request submitted");
      console.log(this.state.services)
    } catch (err){
      console.log(err)
    }
    this.hideModal()
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
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  // Test current step with ternary
  // _next and _previous functions will be called on button click
  _next() {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }
    
  _prev() {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
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
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgYellow400, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]} onPress={() => this.showModal()}>
                <Text style={[ t.textXl]}> Utilities</Text>
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
                              onPress={() => this.hideModal()} 
                              >
                              <Ionicons name="ios-close"/>
                            </TouchableOpacity>
                          </Item>
                        </View>
                      </Item>
                      <ServiceData
                        currentStep={this.state.currentStep}
                        handleChange={this.onChangeText}
                        serviceType={this.state.serviceType}/>
                      <CostData
                        currentStep={this.state.currentStep}
                        handleChange={this.onChangeText}
                        contractLength={this.state.contractLength}
                        costType={this.state.switchValue}
                        toggleSwitch={this.toggleSwitch}/>
                      <CallbackData
                        currentStep={this.state.currentStep}
                        handleChange={this.onChangeText}/>
                      <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgRed400, t.wAuto, t.itemsCenter]}>
                          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                          <TouchableOpacity
                              onPress={() => this._prev()} 
                              >
                                <Text>Previous</Text>
                            </TouchableOpacity>
                          </Item>
                        </View>
                        <View style={[t.w5]}/>
                        <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgGreen400, t.itemsCenter]}>
                          <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <TouchableOpacity onPress={() => this._next()}>
                                <Text>Next</Text>
                            </TouchableOpacity>
                          </Item>
                        </View>
                      </Item>
                    </ScrollView>
                  </View>
                </Modal>
              </Item>
            </View> 
            <View style={[t.w5]}/>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgIndigo300, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl]}> General Office</Text>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgRed400, t.wAuto, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl]}> Telecoms & IT</Text>
              </Item>
            </View>
            <View style={[t.w5]}/>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgGreen400, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl]}> Finance</Text>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                <Text style={[ t.textXl]}> All Services</Text>
              </Item>
              <View rounded>
                {
                  this.state.services.map((s, i) => 
                    <>
                      <CollapsibleList
                        numberOfVisibleItems={1}
                        buttonContent={
                          <View>
                            <Text>Show</Text>
                          </View>
                        }
                      >
                        <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.name]}>
                          <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            <FontAwesome5 name={serviceIcons[s.name]} size={24} color="black" style={[t.pE8]}/>
                            <Text key={i} style={[t.textXl, t.itemsCenter, t.pE8]}>{s.name}</Text>
                          </Item>
                        </View>
                        <View style={[t.roundedLg, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.name]}>
                          <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            { s.contracts.items.map((unit, key2) => {
                              return <Text key={key2}>{unit.contractStart} - {unit.contractEnd}: Total length: {unit.length}</Text>
                            })}
                          </Item>
                        </View>
                      </CollapsibleList>
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

const styles = StyleSheet.create({
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10
  }
})