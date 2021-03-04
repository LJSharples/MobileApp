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
                console.log(JSON.parse(result))
                this.setState({affiliateData: JSON.parse(result)})
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
                            <Text style={[ t.text3xl, t.textWhite, t.fontMedium]}>Affiliate Dashboard</Text>
                            </Item>
                            <Item style={[t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.textXl, t.textWhite]}>Your Affiliate ID is: {affiliateData.affiliate_id}</Text>
                            </Item>
                        </View>
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Item style={[t.w3_5, t.borderTransparent]}/>
                            <Item style={[t.w3_6,, t.borderTransparent]}>
                            <TouchableOpacity 
                                onPress={() => this.props.handleRoute('AddQuote')}
                                style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                <Text style={[ t.textBlue100, t.pX8, t.textXl, t.fontBold, t.p2]}>Add Lead</Text>
                            </TouchableOpacity>
                            </Item>
                            <Item style={[t.wPx]}/>
                        </Item>
                        <Item style={[t.mT2, t.wFull, t.h54, t.borderTransparent, t.pX3, t.pY4, t.pt8, t.wFull, t.itemsStart, t.justifyStart]}>
                            <Text style={[ t.textXl, t.textWhite]}>Number Of Referrals: {affiliateData.referrals}</Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Item style={[t.w3_5, t.borderTransparent]}/>
                            <Item style={[t.w3_6,, t.borderTransparent]}>
                                <TouchableOpacity 
                                    onPress={() => this.props.handleRoute('Customers')}
                                    style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                    <Text style={[ t.textBlue100, t.textXl, t.fontBold, t.p2]}>My Customers</Text>
                                </TouchableOpacity>
                            </Item>
                            <Item style={[t.w1_6, t.wFull, t.borderTransparent]}/>
                            <Item style={[t.wPx]}/>
                        </Item>
                        <Item style={[t.mT2,t.pX4, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent,t.wFull, t.h54, t.pX3, t.pY4, t.pt8,]}>
                            <Text style={[ t.textXl, t.textWhite]}>Your Total Affiliates: 0</Text>
                        </Item>
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Item style={[t.w3_5, t.borderTransparent]}/>
                            <Item style={[t.w3_6, t.borderTransparent]}>
                                <TouchableOpacity 
                                    onPress={() => this.props.handleRoute('Affiliates')}
                                    style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                    <Text style={[ t.textBlue100, t.pX4, t.textXl, t.fontBold, t.p2]}>My Affiliates</Text>
                                </TouchableOpacity>
                            </Item>
                            <Item style={[t.wPx]}/>
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
                        <Item style={[t.pX4, t.pY2, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Item style={[t.w3_5, t.borderTransparent]}/>
                            <Item style={[t.w3_6,, t.borderTransparent]}>
                            <TouchableOpacity 
                                onPress={() => this.props.handleRoute('AffiliateExpenses')}
                                style={[ t.p1, t.roundedLg, t.bgWhite]}>
                                <Text style={[ t.textBlue100, t.textXl, t.pX4,t.fontBold, t.p2]}>View Details</Text>
                            </TouchableOpacity>
                            </Item>
                            <Item style={[t.wPx]}/>
                        </Item>
                    </View>
                )}
            </ScrollView>
        )
    }
}