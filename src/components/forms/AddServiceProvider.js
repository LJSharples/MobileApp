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
            service: false
        };
    }

    static getDerivedStateFromProps = props => {
      console.log(props)
        const { getTotalSteps, getCurrentStep, getState } = props;
        const state = getState();
        return {
            totalSteps: getTotalSteps(),
            currentStep: getCurrentStep(),
            currentSupplier: state.current_supplier,
            service_name: state.service_name
        };
    };
    
    handleRoute = async () => {
      await this.props.navigation.navigate("Services")
    }

    nextStep = () => {
        const { next, saveState, getState } = this.props;
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
        const { saveState } = this.props;
        saveState({ [key]: value});
        //do highlight
        this.setState({ [highlight]: true});
    }

    render() {
    const { currentStep, totalSteps, currentSupplier } = this.state;
    return (
        <View style={[styles.container]}>
        <View>
            <Text
            style={[ t.textWhite, t.textXl]}
            >{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>
        
        <Item style={[ t.mT2, t.borderTransparent, t.w3_4, t.z10]}>
          <View style={[t.roundedLg, t.bgWhite, t.wFull, t.pX4, t.pY4, t.pt8]}>
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
              placeholder="Please Select a Service"
              placeholderStyle={{
                  fontSize: 18,
                  textAlign: 'center'
              }}
              containerStyle={{height: 50, width: 280}}
              labelStyle={{
                fontSize: 18,
                textAlign: 'center'
              }}
              style={{backgroundColor: '#fafafa'}}
              dropDownStyle={{ backgroundColor: '#fafafa', height: 350 }}
              dropDownMaxHeight={350}
              onChangeItem={item => this.saveState('service_name', item.value, "service")}
            />
          </View>
          <View style={[t.wPx]}/>
          <View> 
            {this.state.service ? 
              <Image
                style={[ t.w10, t.h10, t.mL1]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </Item>
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
                  style={[ t.w10, t.h10, t.mL1]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </Item>
    
        <View style={[styles.btnContainer, styles.marginAround]}>
          <Item style={[t.mL3]}/>
          <TouchableOpacity onPress={this.nextStep} style={[t.mL24, t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter]}>
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
    marginAround: {
      width: "40%",
      justifyContent: "space-between"
    },
  });
export default AddServiceProvider;