import React from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import {
  Item,
  Input,
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import DropDownPicker from 'react-native-dropdown-picker';

// Load the app logo
const logo = require('../images/managedbill-corporate-logo.png')

export default class RegisterCompanyDetails extends React.Component {

    update = (k, v)=> {
        this.props.onUpdate(k, v.nativeEvent['text']);
    }

    updateIndustry = (k) => {
        this.props.onUpdate(Object.keys(k)[0], k.industrySector);
    }

    render(){
        if(this.props.currentStep !== 3){
            return null;
        }

        return (
            <View style={[ t.bgBlue900]}>
                <View style={[t.bgWhite, t.hFull ]}>
                    <Item style={[ t.mT16, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <Image 
                        source={logo}
                        style={[ t.objectContain]}
                        />
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                            <Text style={[t.textLg, t.textGray200, t.textCenter, t.fontLight]}>Signup and managed your business services in a hassle free way.</Text>
                        </View>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="companyName"
                                name="companyName"
                                placeholder="Company Name"
                                value={this.props.companyName}
                                onChange={(value) => this.update('companyName', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <Input
                                style={[t.alignCenter, t.bgGray100]}
                                id="companyNumber"
                                name="companyNumber"
                                placeholder="Company number (Optional)"
                                value={this.props.companyNumber}
                                onChange={(value) => this.update('companyNumber', value)}/>
                        </Item>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent]}>
                        <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.w5_6, t.borderTransparent]}>
                            <DropDownPicker
                                items={[
                                    { label: 'Aerospace and Defence', value: 'Aerospace and Defence' },
                                    { label: 'Alternative Investment Funds', value: 'Alternative Investment Funds' },
                                    { label: 'Asset and Wealth Management', value: 'Asset and Wealth Management' },
                                    { label: 'Automotive', value: 'Automotive' },
                                    { label: 'Banking and Capital Markets', value: 'Banking and Capital Markets' },
                                    { label: 'Business Services', value: 'Business Services' },
                                    { label: 'Capital Projects and Infrastructure', value: 'Capital Projects and Infrastructure' },
                                    { label: 'Charities', value: 'Charities' },
                                    { label: 'Chemicals', value: 'Chemicals' },
                                    { label: 'Education', value: 'Education' },
                                    { label: 'Engineering and Construction', value: 'Engineering and Construction' },
                                    { label: 'Financial Services', value: 'Financial Services' },
                                    { label: 'Forest, Paper and Packaging', value: 'Forest, Paper and Packaging' },
                                    { label: 'Government and Public Services', value: 'Government and Public Services' },
                                    { label: 'Healthcare', value: 'Healthcare' },
                                    { label: 'Hospitality and Leisure', value: 'Hospitality and Leisure' },
                                    { label: 'Insurance', value: 'Insurance' },
                                    { label: 'Manufacturing', value: 'Manufacturing' },
                                    { label: 'Media and Entertainment', value: 'Media and Entertainment' },
                                    { label: 'Mining and Metals', value: 'Mining and Metals' },
                                    { label: 'Oil and Gas', value: 'Oil and Gas' },
                                    { label: 'Pharmaceutical and Life Sciences', value: 'Pharmaceutical and Life Sciences' },
                                    { label: 'Power and Utilities', value: 'Power and Utilities' },
                                    { label: 'Private Equity', value: 'Private Equity' },
                                    { label: 'Real Estate', value: 'Real Estate' },
                                    { label: 'Retail and Consumer', value: 'Retail and Consumer' },
                                    { label: 'Sovereign Investment Funds', value: 'Sovereign Investment Funds' },
                                    { label: 'Technology', value: 'Technology' },
                                    { label: 'Telecommunications', value: 'Telecommunications' },
                                    { label: 'Transport and Logistics', value: 'Transport and Logistics' },
                                    { label: 'Other / Not listed', value: 'Other / Not listed' },
                                ]}
                                placeholder="Which industry are you part of?"
                                containerStyle={{height: 40, width: 285}}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => this.updateIndustry({
                                    industrySector: item.value
                                })}
                            />
                        </Item>
                    </Item>
                </View>
            </View>
        )
    }
}