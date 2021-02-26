import React, { Component } from "react";
import { Image, View, TouchableOpacity, TextInput, Text, StyleSheet } from "react-native";
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerContract from '../forms/DateTimePickerContract';
import FileUpload from '../forms/FileUpload';

const arrow = require('../images/arrow.png')
const check = require('../images/pngegg.png')

class AddServiceContract extends Component {
  constructor(props) {
      super(props);
      this.state = {
          totalSteps: "",
          currentStep: "",
          key: '',
          value: '',
          contract: false,
          upload: false,
          uploaded_documents: []
      };
  }

  static getDerivedStateFromProps = props => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep()
    };
  };

  nextStep = () => {
    const { next } = this.props;
    next();
  };
  saveState = (key, value, highlight) => {
    const { saveState } = this.props;
    saveState({ [key]: value});
    this.setState({ [highlight]: true});
  }

  onChange = (key, value) =>{
    const { saveState } = this.props;
    saveState({ [key]: value});
  }

  fileUploadKey = (key) => {
    this.setState(prevState => ({
        uploaded_documents: [...prevState.uploaded_documents, key]
    }))
    this.saveState('uploaded_documents', this.state.uploaded_documents, 'upload')
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
        <Item style={[ t.mT2, t.borderTransparent, t.w3_4, t.z10]}>
          <View style={[t.roundedLg, t.bgWhite, t.wFull, t.pX4, t.pY4, t.pt8]}>
            <DropDownPicker
              items={[
                  { label: '12 Months', value: '12 Months' },
                  { label: '18 Months', value: '18 Months' },
                  { label: '24 Months', value: '24 Months' },
                  { label: '36 Months', value: '36 Months' },
                  { label: '48 Months', value: '48 Months' },
                  { label: '60 Months', value: '60 Months' },
              ]}                      
              placeholder="Enter Contract Length"
              placeholderStyle={{
                  fontSize: 18,
                  textAlign: 'center'
              }}
              containerStyle={{height: 50, width: 280}}
              labelStyle={{
                fontSize: 18,
                textAlign: 'center'
              }}
              style={{ backgroundColor: '#fafafa' }}
              dropDownStyle={{ backgroundColor: '#fafafa', height: 220 }}
              dropDownMaxHeight={220}
              onChangeItem={item => this.saveState('contract_length', item.value, "contract")}
          />
          </View>
          <View style={[t.wPx]}/>
          <View> 
            {this.state.contract ? 
              <Image
              style={[ t.w10, t.h10, t.mL1]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </Item>
        <DateTimePickerContract onChange={this.onChange}/>
        <View style={[t.flexRow, t.mT6, t.justifyAround ]}>
          <TouchableOpacity onPress={this.props.back} style={[ t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
            <Image
              source={arrow}
              style={[styles.btnImage, styles.backBtn]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.nextStep} style={[ t.borderWhite, t.border2, t.roundedFull, t.w16, t.h16, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
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
    btnImage: {
      width: "40%",
      height: "40%"
    },
    backBtn: {
      transform: [{ rotate: "180deg" }]
    },
  });
export default AddServiceContract;