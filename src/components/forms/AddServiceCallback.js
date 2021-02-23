import React, { Component } from "react";
import { Image, View, TouchableOpacity, TextInput, Text, StyleSheet } from "react-native";
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import { CheckBox } from 'react-native-elements';
import DateTimePickerForm from '../forms/DateTimePickerForm';
import { FontAwesome5 } from '@expo/vector-icons'; 

const arrow = require('../images/arrow.png')


export class AddServiceCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: "",
      permission: false
    };
  }

  static getDerivedStateFromProps = props => {
    const { getTotalSteps, getCurrentStep, getState } = props;
    const state = getState();
    console.log(state)
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
      permission: state.permission
    };
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    next();
  };

  cancel = () => {
    this.onChange( "status", "Cancel" );
    this.nextStep();
  };

  saveState(key, value) {
      const { saveState } = this.props;
      saveState({ [key]: value});
  }

  onChange = (key, value) =>{
    const { saveState } = this.props;
    saveState({ [key]: value});
  }
  toggleChecked = () => {
    this.saveState("permission", !this.state.permission);
  }

  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <View style={[styles.container]}>
        <View>
          <Text
            style={[ t.textWhite, t.textXl]}
          >{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>

        <DateTimePickerForm onChange={this.onChange}/>

        <View style={[ t.mT2, t.itemsCenter, t.bgGray100]}>
            <CheckBox
              center
              title='Permission To Share Details'
              textStyle={[ t.textLg, t.fontMedium]}
              checked={this.state.permission}
              onPress={() => this.toggleChecked()}
            />
        </View>

        <View style={[styles.btnContainer, styles.marginAround]}>
          <TouchableOpacity onPress={this.props.back} style={styles.btnStyle}>
            <Image
              source={arrow}
              style={[styles.btnImage, styles.backBtn]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.nextStep} style={styles.btnStyle}>
            <FontAwesome5 name="plus" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={[styles.btnContainer, styles.marginAround]}>
          <Item style={[t.mL3]}/>
          <TouchableOpacity onPress={this.cancel} style={[t.mL24, t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter]}>
            <FontAwesome5 name="minus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      marginTop: "6%"
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: "6%"
    },
    input: {
      width: "80%",
      borderColor: "#fff",
      borderWidth: 2,
      borderRadius: 6,
      paddingHorizontal: 8,
      marginTop: "6%"
    },
    btnStyle: {
      borderColor: "#fff",
      borderWidth: 2,
      borderRadius: 100,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center"
    },
    btnImage: {
      width: "40%",
      height: "40%"
    },
    backBtn: {
      transform: [{ rotate: "180deg" }]
    },
    marginAround: {
      width: "40%",
      justifyContent: "space-between"
    },
  });
export default AddServiceCallback;