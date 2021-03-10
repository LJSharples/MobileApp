import React, { Component } from "react";
import { Image, View, TouchableOpacity, TextInput, Text, StyleSheet } from "react-native";
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerContract from '../forms/DateTimePickerContract';

const arrow = require('../images/arrow.png')
const check = require('../images/pngegg.png')

export class AddServiceCosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: "",
      month: "",
      year: "",
      year_h: false,
      month_h: false,
      verify: true
    };
  }

  static getDerivedStateFromProps = props => {
    const { getTotalSteps, getCurrentStep, getState } = props;
    const state = getState();
    var pass = true
    if(state.cost_month !== "" && state.cost_year !== ""){
      pass=false
    }
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
      month: state.cost_month,
      year: state.cost_year,
      verify: pass
    };
  };

  nextStep = () => {
    const { next } = this.props;
    next();
  };

  saveState(key, value, highlight) {
      const { saveState, getState } = this.props;
      const state = getState();
      saveState({ [key]: value});
      this.setState({ [highlight]: true});
      this.verifyState(state)
  }

  verifyState = (state) => {
    if(state.cost_year !== "" && state.cost_month !== ""){
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

        <Item style={[ t.mT2, t.borderTransparent, t.w3_4, t.z0]}>
          <View style={[t.roundedLg, t.bgWhite, t.wFull, t.pX4, t.pY4, t.pt8]}>
            <TextInput style={[ t.textLg, t.textCenter]} placeholder="Year Cost"
                placeholderTextColor="black"
                onChangeText={text => this.saveState('cost_year', text, "year_h")}
                keyboardType = 'numeric'
                value={this.state.year}/>
          </View>
          <View style={[t.wPx]}/>
          <View> 
            {this.state.year_h ? 
              <Image
              style={[ t.w10, t.h10, t.mL1]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </Item>

        <Item style={[ t.mT2, t.borderTransparent, t.w3_4, t.z0]}>
          <View style={[t.roundedLg, t.bgWhite, t.wFull, t.pX4, t.pY4, t.pt8]}>
                <TextInput style={[ t.textLg, t.textCenter]} placeholder="Month Cost"
                placeholderTextColor="black"
                onChangeText={text => this.saveState('cost_month', text, "month_h")}
                keyboardType = 'numeric'
                value={this.state.month}/>
          </View>
          <View style={[t.wPx]}/>
          <View> 
            {this.state.month_h ? 
              <Image
              style={[ t.w10, t.h10, t.mL1]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </Item>

        <View style={[t.flexRow, t.mT6, t.justifyAround ]}>
          <TouchableOpacity onPress={this.props.back} style={[ t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
            <Image
              source={arrow}
              style={[styles.btnImage, styles.backBtn]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity disabled={this.state.verify} onPress={this.nextStep} style={[ t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
            <Image
              source={arrow}
              style={styles.btnImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    input: {
      width: "80%",
      borderColor: "#fff",
      borderWidth: 2,
      borderRadius: 6,
      paddingHorizontal: 8,
      marginTop: "6%"
    },
    btnImage: {
      width: "40%",
      height: "40%"
    },
    backBtn: {
      transform: [{ rotate: "180deg" }]
    },
  });
export default AddServiceCosts;