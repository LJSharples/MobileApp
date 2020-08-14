import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native'
import {
  Item
} from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createService } from '../../graphql/mutations';
import { getServices } from '../../graphql/queries'
import { t } from 'react-native-tailwindcss';

// Service colors, icons and components
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';
import ServiceModal from '../forms/ServicesModal';

export default class ServicesScreen extends React.Component {
  state = {
    company_name: '',
    newService: '',
    isHidden: false,
    modalVisible: false,
    services: [],
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

  onInput = (key, event) => {
      console.log(key);
      console.log(event.target.value);
      this.setState({ [key]: event.target.value})
      console.log(this.state);
  };

  async submitService(){
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
    this.setState({ callBack: new Date()}) 
    const serviceData = await API.graphql(graphqlOperation(getServices, {
      user_name: user.username
    }))
    this.setState({ services: serviceData.data["getServices"].items });
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
                <ServiceModal show={this.state.modalVisible} onClose={this.hideModal} onInput={this.onInput} submitLead={this.submitService}>
                </ServiceModal>
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
                      <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.service_name]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                          <FontAwesome5 name={serviceIcons[s.service_name]} size={24} color="black" style={[t.pE8]}/>
                          <Text key={i} style={[t.textXl, t.itemsCenter, t.pE8]}>{s.service_name}</Text>
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