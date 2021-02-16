import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal
} from 'react-native'
import {
  Item
} from 'native-base'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { addService } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';
import SuccessUpload from "../forms/SuccessUpload";
import Header from "../forms/Header";

const background = require('../images/background.png')

export default class addCustomerScreen extends React.Component {
    state = {
        routes: [
            'Home',
            'Services',
            'Expenses',
            'Quote',
            'Account'
        ],
        email: '',
        user_name: '',
        displayModal: false
    };

    async componentDidMount(){
      let user = await Auth.currentAuthenticatedUser();
      this.setState({ user_name: user.username})
    }

    _onRefresh = () => {
      this.setState({refreshing: true});
      this.componentDidMount().then(() => {
        this.setState({refreshing: false});
      });
    }
    
    handleRoute = async (destination) => {
      this.setState({
        displayModal: false
      })
      await this.props.navigation.navigate(destination)
    }

    onChangeText = (key, value) => {
      this.setState({ [key]: value})
      this.verifyInput(key);
    }; 
    
    verifyInput = (key) => {
      if(key !== ""){
        var joined = this.state.submitted.concat(key);
        this.setState({ submitted: joined })
      }
    } 

    submitService = async () => {
      const data = {
        user_name: this.state.user_name,
        email: this.state.email,
      }
      console.log(data)
      try {
          console.log("Success");
          this.setState({
            email: '',
            success: true
          })
          this.setState({
            displayModal: true
          })
      } catch (err) {
          console.log("Error:")
      }
    }


    render() {
        return (
          <View source={background} style= {[ t.flex1]}>
            <Header/>
            <ImageBackground source={background}  style= {[ t.flex1]}>
                <ScrollView
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                    <Item style={[ t.mT8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                      <Text style={[ t.text2xl, t.textWhite]}>Invite Your Customer</Text>
                    </Item>
                    <View style={[ t.flex1, t.justifyCenter, t.alignCenter]}>
                      <Item style={[t.pX1, t.pY1, t.pt2, t.alignCenter, t.justifyCenter, t.wFull, t.hFull, t.mT5,]}>
                        <View style={[t.pX1, t.pY1, t.pt2, t.roundedLg, t.wFull, t.hFull, t.mT2]}>
                          <Item style={[ t.mT8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                            <Text style={[ t.textXl, t.textCenter, t.textWhite]}>Enter the email address of your customer and they will receive a link to register. Once registered they will be affiliated to your account.</Text>
                          </Item>
                          <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2, t.bgGray100, t.z0]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            <TextInput style={[ t.textLg]} placeholder="email"
                              placeholderTextColor="black"
                              onChange={event => this.onChangeText('email', event)}
                              value={this.state.current_supplier}/> 
                            </Item>
                          </View>
                          
                          <Item style={[ t.mT2, t.borderTransparent]}>
                            <View style={[t.roundedLg, t.bgWhite, t.w5_12]}>
                              <TouchableOpacity 
                                onPress={() => {
                                  this.handleRoute('Customers');
                                }}
                                style={[ t.pX3, t.pY4, t.pt8, t.roundedLg,]}>
                                <Text style={[ t.textRed600, t.textLg, t.textCenter, t.p2]}>Cancel</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={[t.w2_12]}/>
                            <View style={[t.roundedLg, t.bgWhite, t.w5_12]}>
                              <TouchableOpacity 
                                onPress={() => {
                                  this.submitService();
                                }}
                                style={[ t.pX3, t.pY4, t.pt8, t.roundedLg,]}>
                                <Text style={[ t.textBlue600, t.textXl, t.textCenter, t.p2]}>Send Invite</Text>
                              </TouchableOpacity>
                            </View>
                          </Item>
                          <Modal
                              animationType="slide"
                              transparent={true}
                              visible={this.state.displayModal}
                              onRequestClose={() => {
                                  Alert.alert("Modal has been closed.");
                              }}
                          >
                            <SuccessUpload handleRoute={this.handleRoute}/>
                          </Modal>
                        </View>
                      </Item>                        
                  </View>
                </ScrollView>
            </ImageBackground>
          </View>
        )
    }
}