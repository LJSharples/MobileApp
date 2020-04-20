import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  Modal,
  FlatList,
  Switch
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
import { listServices } from '../../graphql/queries';
import { createService } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';

// Modal data
import utilityData from '../utilitiesData';

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
}`;

export default class ServicesScreen extends React.Component {
  state = {
    username: '',
    company_name: '',
    newService: '',
    isHidden: false,
    modalVisible: false,
    modalVisibleService: false,
    makeRequest: false,
    serviceProvider: '',
    contractEndDate: '',
    partnerCallBack: '',
    callBack: '',
    services: [],
    contracts: [],
  };

  showModal(){
    this.setState({ modalVisible: true})
  }

  showModalService(){
    this.setState({ modalVisibleService: true})
  }

  hideModal(){
    this.setState({ modalVisible: false});
    this.setState({ makeRequest: false });
  }

  hideModalService(){
    this.setState({ modalVisibleService: false});
  }

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

  async getService(service){
    const utilData = await utilityData
    try {
      const new_service = await utilData.filter(
        obj => obj.service === service
      )[0].service
      this.setState({ newService: new_service });
      this.setState({ makeRequest: true});
    } catch (err){
      console.log(err)
    }
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  makeRequest(){
    if(this.state.makeRequest == true){
      return (
        <View>
            
        </View>
      );
    } else {
      return null;
    }
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
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgYellow400, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]} onPress={() => this.showModal()}>
                <Text style={[ t.textXl]}> Utilities</Text>
                <Modal
                  animationType="slide" // fade
                  transparent={false}
                  visible={this.state.modalVisible}>
                  <View style={[ t.flex1 ]}>
                    <ScrollView>
                      <TouchableOpacity
                        onPress={() => this.hideModal()} 
                        >
                        <Ionicons name="ios-close"/>
                      </TouchableOpacity>
                      <Text >Request Quote </Text>
                      <View style={{ flex: 10, paddingTop: 10 }}>
                      <Text style={{fontSize: 20, padding: 15,}}>Which of the following services do you want to reciecve a quote for?</Text>
                        <FlatList
                          data={utilityData}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={
                            ({ item }) =>
                              <TouchableWithoutFeedback 
                                onPress={() => this.getService(item.service)}>
                                <View 
                                  style={
                                    [ 
                                      {
                                        flexDirection: 'row', 
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                      }
                                    ]
                                  }>
                                  <Text style={{fontSize: 20}}>
                                    {item.service} - {item.brief}
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                          }
                        />
                      </View>
                      <View>
                        {this.makeRequest()}
                      </View>
                    </ScrollView>
                  </View>
                </Modal>
              </Item>
            </View> 
            <View style={[t.w5]}/>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgIndigo300, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text style={[ t.textXl]}> General Office</Text>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgRed400, t.wAuto, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text style={[ t.textXl]}> Telecoms & IT</Text>
              </Item>
            </View>
            <View style={[t.w5]}/>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.bgGreen400, t.itemsCenter]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text style={[ t.textXl]}> Finance</Text>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
            <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
              <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                <Text style={[ t.textXl]}> All Services</Text>
              </Item>
              <View rounded>
                {
                  this.state.services.map((s, i) => 
                    <>
                      <View style={[t.roundedLg, t.w1_2, t.bgYellow500, t.wAuto, t.mT2, t.itemsCenter]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                          <Text key={i} onPress={() => this.showModalService()}>{s.name}</Text>
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