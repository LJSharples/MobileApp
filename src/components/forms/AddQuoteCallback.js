import React, { Component } from "react";
import { Image, View, TouchableOpacity, TextInput, Modal, Text, StyleSheet } from "react-native";
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import { CheckBox } from 'react-native-elements';
import DateTimePickerForm from '../forms/DateTimePickerForm';
import { FontAwesome5 } from '@expo/vector-icons'; 

const arrow = require('../images/arrow.png')


export class AddQuoteCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: "",
      displayModal: false
    };
  }

  static getDerivedStateFromProps = props => {
    const { getTotalSteps, getCurrentStep, getState } = props;
    const state = getState();
    console.log(state)
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep()
    };
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    next();
  };

  cancel = () => {
    this.onChange( "status", "Cancel" );
    this.setState({ displayModal: true});
  };

  confirmCancel(){
    const { next } = this.props;
    this.setState({ displayModal: false})
    this.nextStep();
  }

  abort(){
    this.setState({ displayModal: false});
  }

  saveState(key, value) {
      const { saveState } = this.props;
      saveState({ [key]: value});
  }

  onChange = (key, value, highlight) =>{
    const { saveState } = this.props;
    saveState({ [key]: value});
    this.verifyState(highlight);
  }

  verifyState = (highlight) => {
    if(highlight){
      this.setState({ verify: false})
    }
  }

  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <View style={[t.flex1, t.itemsCenter, t.alignCenter, t.mT6]}>
        <View>
          <Text
            style={[ t.textWhite, t.textXl]}
          >{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>

        <DateTimePickerForm onChange={this.onChange}/>

        <View style={[t.flexRow, t.mT6, t.justifyAround ]}>
          <TouchableOpacity onPress={this.props.back} style={[ t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
            <Image
              source={arrow}
              style={[styles.btnImage, styles.backBtn]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
          <TouchableOpacity
            style={[t.mT4, t.itemsCenter, t.justifyCenter, t.borderTransparent, t.w9_12, t.pX2, t.pY2,t.roundedLg, t.bgWhite]}
            onPress={this.nextStep}>
            <Text style={[ t.textBlue100, t.textXl, t.p2, t.textCenter]}>
              Add Quote
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[t.mT2, t.itemsCenter, t.justifyCenter, t.borderTransparent, t.w9_12, t.pX2, t.pY2,t.roundedLg, t.bgWhite]}
            onPress={this.cancel}>
            <Text style={[ t.textBlue100, t.textXl, t.p2, t.textCenter]}>
              Cancel
            </Text>
          </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.displayModal}
          onRequestClose={() => {
              Alert.alert("Modal has been closed.");
          }}
        >
        <View style={[ t.flex1, t.justifyCenter, t.alignCenter, t.mT5]}>
          <View style={styles.modalView}>
            <Item style={[ t.mT2, t.alignCenter, t.justifyCenter, t.contentEnd, t.borderTransparent]}>
                <Text style={[ t.text2xl, t.textBlue600]}>Are you sure you wish to cancel this request</Text>
            </Item>
            <Item style={[ t.mT2, t.alignCenter, t.justifyCenter, t.contentEnd,t.wFull, t.borderTransparent]}>
                <TouchableOpacity
                    style={[ t.pX3, t.pY4, t.pt8, t.roundedLg, t.mT12, t.bgBlue100]}
                    onPress={() =>
                        this.abort()
                    }
                >
                    <Text style={[ t.text2xl, t.textWhite]}>Cancel</Text>
                </TouchableOpacity>
                <Item style={[ t.mL1]}/>
                <TouchableOpacity
                    style={[ t.pX3, t.pY4, t.pt8, t.roundedLg, t.mT12, t.bgBlue100]}
                    onPress={() =>
                        this.confirmCancel()
                    }
                >
                    <Text style={[ t.text2xl, t.textWhite]}>Confirm</Text>
                </TouchableOpacity>
            </Item>
          </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    btnImage: {
      width: "40%",
      height: "40%"
    },
    backBtn: {
      transform: [{ rotate: "180deg" }]
    },
    modalView: {
      margin: 5,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
  });
export default AddQuoteCallback;