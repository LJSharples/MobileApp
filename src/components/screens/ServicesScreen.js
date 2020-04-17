import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
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
}`

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
        <ScrollView style={[t.hFull]}>
          <Item style={[t.pX1, t.pY1, t.pT4, t.alignCenter, t.justifyCenter]}>
            <View style={[t.pX4, t.pB4, t.roundedLg, t.bgYellow500, t.w5_12, t.itemsCenter, t.h16]}>
              <Item style={[t.pX1, t.pY1, t.pt2]} onPress={() => this.showModal()}>
                <Text style={[t.textCenter, t.textXl]} >Utilities</Text>
                {/* Modal for country code and flag */}
                <Modal
                  animationType="slide" // fade
                  transparent={false}
                  visible={this.state.modalVisible}>
                  <View style={{ flex: 1 }}>
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
            <View style={[t.pX4, t.pB4, t.roundedLg, t.bgIndigo300, t.itemsCenter, t.h16]}>
              <Item style={[t.pX1, t.pY1, t.pt2, t.alignCenter]}>
                <Text style={[t.textCenter, t.textXl]}>General Office</Text>
              </Item>
            </View>
          </Item>
          <Item style={[t.pX1, t.pY1, t.pT4, t.alignCenter, t.justifyCenter]}>
            <View style={[t.w5]}/>
            <View style={[t.pX4, t.pB4, t.roundedLg, t.bgRed400, t.w5_12, t.itemsCenter, t.h16]}>
              <Item style={[t.pX1, t.pY1, t.pt2]}>
                <Text style={[t.textCenter, t.textXl, t.overflowHidden, t.flexWrap]}>Telecoms & IT</Text>
              </Item>
            </View>
            <View style={[t.w5]}/>
            <View style={[t.pX4, t.pB4, t.roundedLg, t.bgGreen200, t.w5_12, t.itemsCenter, t.h16]}>
              <Item style={[t.pX1, t.pY1, t.pt2]}>
                <Text style={[t.textCenter, t.textXl]}>Finance</Text>
              </Item>
            </View>
            <View style={[t.w5]}/>
          </Item>
          <Item style={[t.hFull, t.bgWhite, t.mT5]}>
            <View rounded>
              {
                this.state.services.map((s, i) => 
                  <>
                    <Text key={i} onPress={() => this.showModalService()}>{s.name} - {s.provider}</Text>
                  </>
                )
              }
            </View>
          </Item>
        </ScrollView>
      </View>
    )
  }
}