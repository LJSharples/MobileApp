import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';

export default class AffiliateTab extends React.Component {
    state = {
        isLoading: true,
        affiliateData: {}
    }
    componentDidMount() {
        if(this.props.url === '' || this.props.requestOptions === ''){
            this.setState({ isLoading: false });
        } else {
            fetch(this.props.url, this.props.requestOptions)
            .then(response => response.json())
            .then(result => {
              this.setState({affiliateData: result})
            })
            .catch(error => console.log('error', error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
        }
    }
    
    render(){
        const { affiliateData, isLoading } = this.state
        return (
            <ScrollView>
                {isLoading ? <ActivityIndicator/> : (
                    <View>
                        <View style={[t.mT2, t.alignCenter, t.justifyCenter, t.wFull, t.h54, t.borderTransparent, t.pX3, t.pY2, t.pt4, t.wFull]}>
                            <Item style={[t.pX3, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Text style={[ t.text4xl, t.textWhite, t.fontMedium]}>Affiliate Dashboard</Text>
                            </Item>
                            <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.textXl, t.textWhite]}>Your Affiliate ID is: {affiliateData.affiliate_id}</Text>
                            </Item>
                        </View>
                        <Item style={[t.borderTransparent]}>
                            <Item style={[t.w7_12, t.borderTransparent]}/>
                            <Item style={[t.w5_12, t.wFull, t.borderTransparent]}>
                            <TouchableOpacity 
                                onPress={() => this.handleRoute('AddQuote')}
                                style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                <Text style={[ t.textBlue100, t.textXl, t.fontBold, t.p2]}>Add Lead</Text>
                            </TouchableOpacity>
                            </Item>
                        </Item>
                        <Item style={[t.mT2, t.wFull, t.h54, t.borderTransparent, t.pX3, t.pY4, t.pt8, t.wFull, t.itemsStart, t.justifyStart]}>
                            <Text style={[ t.textXl, t.textWhite]}>Your Total Customers: {affiliateData.referrals}</Text>
                        </Item>
                        <Item style={[t.borderTransparent]}>
                            <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX2, t.pY2]}>
                                <TouchableOpacity 
                                    onPress={() => this.handleRoute('AddCustomer')}
                                    style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                    <Text style={[ t.textBlue100, t.textXl, t.textCenter, t.fontBold]}>Add Customer</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[t.wPx]}/>
                            <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX2, t.pY2]}>
                                <TouchableOpacity 
                                    onPress={() => this.handleRoute('Customers')}
                                    style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                    <Text style={[ t.textBlue100, t.textXl, t.textCenter, t.fontBold]}>My Customers</Text>
                                </TouchableOpacity>
                            </View>
                        </Item>
                        <Item style={[t.mT2,t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent,t.wFull, t.h54, t.pX3, t.pY4, t.pt8,]}>
                            <Text style={[ t.textXl, t.textWhite]}>Your Total Affiliates: 0</Text>
                        </Item>
                        <Item style={[t.borderTransparent]}>
                            <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX2, t.pY2]}>
                            <TouchableOpacity 
                                onPress={() => this.handleRoute('AddAffiliate')}
                                style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                <Text style={[ t.textBlue100, t.textXl, t.textCenter, t.fontBold]}>Add Affiliate</Text>
                            </TouchableOpacity>
                            </View>
                            <View style={[t.wPx]}/>
                            <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX2, t.pY2]}>
                            <TouchableOpacity 
                                onPress={() => this.handleRoute('Affiliates')}
                                style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                <Text style={[ t.textBlue100, t.textXl, t.textCenter, t.fontBold]}>My Affiliates</Text>
                            </TouchableOpacity>
                            </View>
                        </Item>
                        <Item style={[t.mT2, t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent, t.wFull, t.h54, t.pX3, t.pY4, t.pt8]}>
                            <Text style={[ t.textXl, t.textWhite]}>Your Affiliate Commission:</Text>
                        </Item>
                        <Item style={[t.borderTransparent]}>
                            <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt8]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}>Current Earnings: £{affiliateData.earnings}</Text>
                            </View>
                            <View style={[t.wPx]}/>
                            <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2, t.pt6]}>
                            <Text style={[ t.textWhite, t.textXl, t.textCenter]}>Unpaid Earnings: £{affiliateData.unpaid_earnings}</Text>
                            </View>
                        </Item>
                        <Item style={[t.borderTransparent]}>
                            <View style={[t.roundedLg, t.w6_12, t.pX2, t.pY2]}>
                            </View>
                            <View style={[t.wPx]}/>
                            <View style={[t.roundedLg, t.bgWhite, t.w6_12, t.pX2, t.pY2]}>
                                <TouchableOpacity 
                                    onPress={() => this.handleRoute('AffiliateExpenses')}
                                    style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                    <Text style={[ t.textBlue100, t.textXl, t.textCenter, t.fontBold]}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        </Item>
                    </View>
                )}
            </ScrollView>
        )
    }
}