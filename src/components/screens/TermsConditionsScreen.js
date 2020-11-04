import React from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity
  } from 'react-native'
  import {
    Item
  } from 'native-base'
  import { t } from 'react-native-tailwindcss';

export default class TermsConditionsScreen extends React.Component {
    state = {
        refreshing: false
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.componentDidMount().then(() => {
          this.setState({refreshing: false});
        });
    }

    render(){
        return (
            <View style= {[ t.flex1, t.bgBlue200]}>
                <ScrollView
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                    <Item style={[ t.mT5,t.alignCenter, t.borderTransparent]}>
                        <View style={[t.pX3, t.pY4, t.pt8, t.wFull]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.text2xl, t.textBlue600]}>Terms & Conditions</Text>
                            </Item>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.textXl, t.textBlue600]}>Manage all your services in one place</Text>
                            </Item>
                        </View>
                    </Item>
                </ScrollView>
            </View>
        )
    }
}