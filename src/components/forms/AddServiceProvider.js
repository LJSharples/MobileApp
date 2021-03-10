import React, { Component } from "react";
import { Image, View, TouchableOpacity, TextInput, Text, StyleSheet } from "react-native";
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';

const arrow = require('../images/arrow.png')
const check = require('../images/pngegg.png')

class AddServiceProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSteps: "",
            currentStep: "",
            currentSupplier: "",
            service_name: "",
            supplier: false,
            service: false,
            verify: true
        };
    }

    static getDerivedStateFromProps = props => {
        const { getTotalSteps, getCurrentStep, getState } = props;
        const state = getState();
        var pass = true
        if(state.service !== "" && state.supplier !== ""){
          pass=false
        }
        return {
            totalSteps: getTotalSteps(),
            currentStep: getCurrentStep(),
            currentSupplier: state.current_supplier,
            service_name: state.service_name,
            verify: pass
        };
    };

    nextStep = () => {
        const { next, getState } = this.props;
        // Save state for use in other steps
        const result = getState();
        console.log(result);
        // Go to next step
        next();
    };

    goBack() {
        const { back } = this.props;
        // Go to previous step
        back();
    }

    saveState(key, value, highlight) {
        const { saveState, getState } = this.props;
        saveState({ [key]: value});
        const state = getState();
        //do highlight
        this.setState({ [highlight]: true});
        this.verifyState(state);
    }

    verifyState = (state) => {
      if(state.service !== "" && state.supplier !== ""){
        this.setState({ verify: false})
      }
    }

  render() {
    const { currentStep, totalSteps, currentSupplier } = this.state;
    return (
      <View style={[t.flex1, t.itemsCenter, t.alignCenter, t.contentCenter, t.mT6]}>
        <View>
            <Text
            style={[ t.textWhite, t.textXl]}
            >{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>
        <View style={[ t.mT2, t.w3_4, t.flexRow]}>
          <DropDownPicker
              items={[
                  { label: 'Electricity', value: 'Electric' },
                  { label: 'Gas', value: 'Gas' },
                  { label: 'Oil', value: 'Oil' },
                  { label: 'Water', value: 'Water' },
                  { label: 'Energy Reduction', value: 'Energy Reduction' },
                  { label: 'Waste Management', value: 'Waste Management' },
                  { label: 'Business Rates Review', value: 'Business Rates Review' },
                  { label: 'Fuel Cards', value: 'Fuel Cards' },
                  { label: 'Telecomms & Broadband', value: 'Telecomms & Broadband' },
                  { label: 'Cyber Security', value: 'Cyber Security' },
                  { label: 'Printers', value: 'Printers' },
                  { label: 'Merchant Services', value: 'Merchant Services' },
                  { label: 'Insolvency', value: 'Insolvency' },
              ]}
              defaultValue={this.state.service_name}
              placeholder="Please Select a Service"
              placeholderStyle={{
                  fontSize: 18,
                  textAlign: 'center'
              }}
              containerStyle={{height: 50, width: "100%"}}
              labelStyle={{
                fontSize: 18,
                textAlign: 'center'
              }}
              style={{backgroundColor: '#fafafa'}}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              dropDownMaxHeight={350}
              onChangeItem={item => this.saveState('service_name', item.value, "service")}
            />
          <View style={[t.wPx]}/>
          <View> 
            {this.state.service ? 
              <Image
                style={[ t.w10, t.h10, t.mL2, t.mT2]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </View>
        <Item style={[ t.mT2, t.borderTransparent, t.w3_4, t.z0]}>
          <View style={[t.roundedLg, t.bgWhite, t.wFull, t.pX4, t.pY4, t.pt8]}>
            <TextInput
              style={[ t.textLg, t.textCenter]}
              placeholder="Who is your current supplier?"
              placeholderTextColor="black"
              onChangeText={text => this.saveState('current_supplier', text, "supplier")}
              value={currentSupplier}
            />
          </View>
          <View style={[t.wPx]}/>
          <View> 
            {this.state.supplier ? 
              <Image
                  style={[ t.w10, t.h10, t.mL2]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </Item>
    
        <View style={[t.flexRow, t.mT6, t.justifyAround ]}>
          <Item style={[t.mL3]}/>
          <TouchableOpacity disabled={this.state.verify} onPress={this.nextStep} style={[t.mL24, t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter]}>
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
  });
export default AddServiceProvider;