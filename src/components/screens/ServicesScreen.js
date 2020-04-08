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
    console.log("Request submitted");
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
    this.setState({ contracts: serviceData.data.listServices.items[0].contracts.items})
  }

  makeRequest(){
    if(this.state.makeRequest == true){
      return (
        <View style={{flex: 1}}>
            <Item style={styles.section}>
              <View style={styles.logoContainer}>
                <Item style={styles.itemStyle}>
                  <Text>Request quote for: {this.state.newService}</Text>
                </Item>
                <Item style={styles.itemStyle}>
                    <Ionicons name="ios-business" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Service provider'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref='SecondInput'
                      onSubmitEditing={(event) => {this.refs.ThirdInput._root.focus()}}
                      onChangeText={value => this.onChangeText('serviceProvider', value)}
                    />
                  </Item>
                <Item style={styles.itemStyle}>
                    <Ionicons name="md-calendar" style={styles.iconStyle} />
                    <DatePicker
                      defaultDate={new Date()}
                      minimumDate={new Date()}
                      locale={"en"}
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"default"}
                      placeHolderText="Enter Contract End Date"
                      textStyle={{ color: "green" }}
                      placeHolderTextStyle={{ color: "#d3d3d3" }}
                      onDateChange={value => this.onChangeText('contractEndDate', value)}
                      disabled={false}
                      />
                  </Item>
                <Item style={styles.itemStyle}>
                  <Ionicons name="ios-mail" style={styles.iconStyle} />
                  <Text>Request a call from our partners</Text>
                </Item>
                <Item style={styles.itemStyle, styles.valueCentered}>
                    <Switch 
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={this.state.partnerCallBack ? "#2f82ec" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={value => this.onChangeText('partnerCallBack', value)}
                      value={this.state.partnerCallBack}
                    />
                  </Item>
                <Item style={styles.itemStyle}>
                  <Ionicons name="ios-mail" style={styles.iconStyle} />
                  <Text>Select Call back date and time</Text>
                </Item>
                <Item style={styles.itemStyle, styles.valueCentered}>
                <DatePicker
                  defaultDate={new Date()}
                  minimumDate={new Date()}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Select callback date"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={value => this.onChangeText('callBack', value)}
                  disabled={false}
                  />
              </Item>
                <TouchableOpacity
                  onPress={() => this.hideModal()} 
                  style={styles.submitButtonStyle}>
                  <Text style={styles.textStyle}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </Item>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <ScrollView>
              <Item style={styles.spacer}>
                <View rounded style={styles.utilitiesContainer}>
                  <Text name="ios-power" style={styles.iconStyle} onPress={() => this.showModal()}> Utilities</Text>
                  {/* Modal for country code and flag */}
                  <Modal
                      animationType="slide" // fade
                      transparent={false}
                      visible={this.state.modalVisible}>
                      <View style={{ flex: 1 }}>
                        <ScrollView>
                          <TouchableOpacity
                            onPress={() => this.hideModal()} 
                            style={styles.closeButtonStyle}>
                            <Ionicons name="ios-close" style={styles.closeIconStyle}/>
                          </TouchableOpacity>
                          <Text style={styles.closeHeaderStyle}>Request Quote </Text>
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
                                          styles.countryStyle, 
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
                </View>
                <View rounded style={styles.generalOfficeContainer}>
                  <Text style={styles.iconStyle}> General Office</Text>
                </View>
              </Item>
              <Item style={styles.spacer}>
                <View rounded style={styles.telecomsContainer}>
                  <Text name="ios-power" style={styles.iconStyle}> Telecoms & IT</Text>
                </View>
                <View rounded style={styles.financeContainer}>
                  <Text name="ios-people" style={styles.iconStyle}> Finance</Text>
                </View>
              </Item>
              <Item style={styles.spacer}>
                <View rounded style={styles.mainContainer}>
                  <Text style={styles.iconStyle}>All Services</Text>
                  {
                    this.state.services.map((s, i) => 
                    <>
                      <Text key={i} onPress={() => this.showModalService()} style={styles.serviceContainer}>{s.name} - {s.provider}</Text>
                      </>
                    )
                  }
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
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  utilitiesContainer: {
    backgroundColor: '#E0B9E3',
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10
  },
  generalOfficeContainer: {
    backgroundColor: '#B9E3E0',
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10
  },
  telecomsContainer: {
    backgroundColor: '#C6E3B9',
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10
  },
  financeContainer: {
    backgroundColor: '#B9B9E3',
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10
  },
  serviceContainer: {
    backgroundColor: '#408C45',
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10
  },
  mainContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  iconStyle: {
    fontSize: 20,
    marginRight: 15
  },
  closeIconStyle: {
    fontSize: 30,
    paddingLeft: 25,
    paddingTop: 20,
    marginRight: 15,
    alignItems: 'flex-end', 
  },
  closeHeaderStyle:{
    fontSize: 25, 
    paddingTop: 5, 
    marginLeft: 15,
    color: '#39F',
    alignItems: "flex-start"
  },
  countryStyle: {
    flex: 1,
    borderTopColor: '#211f',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    marginRight: 5,
    alignItems: "flex-end"
  },
  submitButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center', 
    backgroundColor: '#b44666',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  valueCentered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10
  }
})