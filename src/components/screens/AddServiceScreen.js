import React from 'react'
import {
  View,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import {
  Item
} from 'native-base'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { addService } from '../../graphql/mutations';
import { t } from 'react-native-tailwindcss';
import AnimatedMultistep from "react-native-animated-multistep";

import Header from "../forms/Header";
import AddServiceProvider from '../forms/AddServiceProvider';
import AddServiceContract from '../forms/AddServiceContract';
import AddServiceCosts from '../forms/AddServiceCosts';
import AddServiceCallback from '../forms/AddServiceCallback';

const allSteps = [
  {name: "Step 1", component: AddServiceProvider},
  {name: "Step 2", component: AddServiceContract},
  {name: "Step 3", component: AddServiceCosts},
  {name: "Step 4", component: AddServiceCallback}
]

const background = require('../images/background.png')
const success = {uri: "https://i.pinimg.com/originals/e8/06/52/e80652af2c77e3a73858e16b2ffe5f9a.gif"}

export default class addServiceScreen extends React.Component {
    state = {
        service_name: '',
        current_supplier: '',
        contractDate: '',
        contract_length: '',
        callback_time: '',
        callback_date: '',
        cost_year: '',
        cost_month: '',
        uploaded_documents: [],
        permission: false,
        user_name: '',
        displayModal: false,
        isLoading : true
    };

    async componentDidMount(){
      let user = await Auth.currentAuthenticatedUser();
      this.setState({ user_name: user.username})
      this.props.navigation.addListener('didFocus', () => {
        console.log("LOAD")
        this.setState({ isLoading: false});
      })
    }

    handleRoute = async (destination) => {
      this.setState({
        displayModal: false,
        service_name: '',
        current_supplier: '',
        contractDate: '',
        contract_length: '',
        callback_time: '',
        callback_date: '',
        cost_year: '',
        cost_month: '',
        uploaded_documents: []
      })
      await this.props.navigation.navigate(destination)
    }

    fileUploadKey = (key) => {
      this.setState(prevState => ({
          uploaded_documents: [...prevState.uploaded_documents, key]
      }))
    }

    submitService = async (finalState) => {
      console.log("HERE")
      var status = "CURRENT";
      if(finalState.permission){
          status = "LEAD"
      }

      const data = {
        user_name: this.state.user_name,
        status: status,
        email: this.state.email,
        service_name: finalState.service_name,
        callback_time: finalState.callback_time,
        contract_end: finalState.contractDate,
        contract_length: finalState.contract_length,
        current_supplier: finalState.current_supplier,
        cost_year: finalState.cost_year,
        cost_month: finalState.cost_month,
        uploaded_documents: finalState.uploaded_documents,
        permission: finalState.permission
      }
      console.log(data)
      try {
          const re = await API.graphql(graphqlOperation(addService, data));
          console.log("Success");
          this.setState({
            displayModal: true,
            service_name: '',
            current_supplier: '',
            contractDate: '',
            contract_length: '',
            callback_time: '',
            callback_date: '',
            cost_year: '',
            cost_month: '',
            uploaded_documents: []
          })
      } catch (err) {
          console.log("Error:")
          console.log(err);
      }
    }

    onNext = () => {
      console.log("Next");
    };
  
    /* define the method to be called when you go on back step */
  
    onBack = () => {
      console.log("Back");
    };
  
    /* define the method to be called when the wizard is finished */
  
    finish = finalState => {
      console.log("HERE")
      console.log(finalState);
      if(finalState.status === "Cancel"){
        console.log("CANCEL")
        console.log(finalState)
        this.setState({ isLoading: true});
        this.handleRoute('Services')
      } else {
        console.log("SUBMIT")
        this.setState({ isLoading: true});
        this.submitService(finalState)
      }
    };

    render() {
        return (
          <View source={background} style= {[ t.flex1]}>
            <Header/>
            <ImageBackground source={background} style= {[ t.flex1]}>
              <Item style={[ t.mT8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textWhite]}>Add A Service</Text>
              </Item>
                {this.state.isLoading ? (
                  <AnimatedMultistep
                    steps={allSteps}
                    onFinish={this.finish}
                    onBack={this.onBack}
                    onNext={this.onNext}//fadeInLeft
                    comeInOnNext="fadeInRight"
                    OutOnNext="fadeOutRight"
                    comeInOnBack="fadeInRight"
                    OutOnBack="fadeOutRight"
                  />
                ) : (
                  <AnimatedMultistep
                    steps={allSteps}
                    onFinish={this.finish}
                    onBack={this.onBack}
                    onNext={this.onNext}//fadeInLeft
                    comeInOnNext="fadeInRight"
                    OutOnNext="fadeOutRight"
                    comeInOnBack="fadeInRight"
                    OutOnBack="fadeOutRight"
                  />
                )}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.displayModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
              >
                <ImageBackground source={success}  style= {[ t.flex1]}>
                  <Item style={[ t.mT48, t.alignCenter, t.justifyCenter, t.contentEnd,t.wFull, t.borderTransparent]}>
                      <Text style={[ t.text2xl, t.textWhite]}>Your request was successfully sent</Text>
                  </Item>
                  <Item style={[ t.mT64, t.alignCenter, t.justifyCenter, t.contentEnd,t.wFull, t.borderTransparent]}>
                      <TouchableOpacity
                          style={[ t.pX3, t.pY4, t.pt8, t.roundedLg, t.mT12, t.bgWhite]}
                          onPress={() =>
                              this.handleRoute('Services')
                          }
                      >
                          <Text style={[ t.text2xl, t.textBlue600]}>Close</Text>
                      </TouchableOpacity>
                  </Item>
                </ImageBackground>
              </Modal>
            </ImageBackground>
          </View>
        )
    }
}