import React, { Component } from "react";
import { Image, View, TouchableOpacity, Modal, Text, StyleSheet } from "react-native";
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
          contractDate: '',
          picturesTaken: 0,
          contract: false,
          upload: false,
          verify: true,
          displayModal: false,
          uploaded_documents: []
      };
  }

  static getDerivedStateFromProps = props => {
    const { getTotalSteps, getCurrentStep, getState } = props;
    const state = getState();
    var pass = true
    if(state.contract !== "" && state.contractDate !== ""){
      pass=false
    }
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
      contract: state.contract_length,
      contractDate: state.contractDate,
      verify: pass
    };
  };

  nextStep = () => {
    const { next } = this.props;
    next();
  };
  saveState = (key, value, highlight) => {
    const { saveState, getState } = this.props;
    const state = getState();
    saveState({ [key]: value});
    this.setState({ [highlight]: true});
    this.verifyState(state)
  }

  onChange = (key, value, highlight) =>{
    const { saveState, getState } = this.props;
    const state = getState();
    saveState({ [key]: value});
    this.verifyState(state)
  }

  verifyState = (state) => {
    if(state.contract !== "" && state.contractDate !== ""){
      console.log("CLEARED")
      this.setState({ verify: false})
    }
  }

  modal = () => {
    this.setState(prevState => ({
      displayModal: !prevState.displayModal
    }))
    this.saveState('uploaded_documents', this.state.uploaded_documents, 'upload')
  }

  fileUploadKey = (key) => {
    this.setState(prevState => ({
        uploaded_documents: [...prevState.uploaded_documents, key]
    }))
    console.log(this.state.uploaded_documents);
    this.setState({ picturesTaken: this.state.picturesTaken + 1 })
    console.log("HERE")
    console.log(key)
  }


  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <View style={[t.flex1, t.itemsCenter, t.alignCenter, t.mT5]}>
        <View>
          <Text
            style={[ t.textWhite, t.textXl]}
          >{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>
        <View style={[ t.mT2, t.w3_4, t.flexRow]}>
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
              containerStyle={{height: 50, width: "100%"}}
              labelStyle={{
                fontSize: 18,
                textAlign: 'center'
              }}
              style={{ backgroundColor: '#fafafa' }}
              dropDownStyle={{ backgroundColor: '#fafafa', height: 240 }}
              dropDownMaxHeight={240}
              onChangeItem={item => this.saveState('contract_length', item.value, "contract")}
          />
          <View style={[t.wPx]}/>
          <View> 
            {this.state.contract ? 
              <Image
                style={[ t.w10, t.h10, t.mL2, t.mT2]}
                  source={check}
                  resizeMode="cover"
                /> : null } 
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.displayModal}
          onRequestClose={() => {
              Alert.alert("Modal has been closed.");
          }}
        >
          <FileUpload modal={this.modal} fileUploadKey={this.fileUploadKey}/>
        </Modal>
        <TouchableOpacity
          style={[t.itemsCenter, t.justifyCenter, t.mT2, t.borderTransparent, t.w9_12, t.pX2, t.pY2,t.roundedLg, t.bgWhite]}
          onPress={this.modal}>
          <Text style={[ t.textBlue100, t.textLg, t.p2, t.textCenter]}>
            Add Picture
          </Text>
          <Text style={[ t.textBlue100, t.p2, t.textCenter]}>
            Pictures Taken: {this.state.picturesTaken}
          </Text>
        </TouchableOpacity>
        <DateTimePickerContract onChange={this.onChange}/>
        <View style={[t.flexRow, t.mT3, t.justifyAround ]}>
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
    btnImage: {
      width: "40%",
      height: "40%"
    },
    backBtn: {
      transform: [{ rotate: "180deg" }]
    },
  });
export default AddServiceContract;