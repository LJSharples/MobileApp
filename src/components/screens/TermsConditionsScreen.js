import React from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ImageBackground
} from 'react-native'
import {
    Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';

const background = require('../images/background.png')

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

    handleRoute = async (destination) => {
        await this.props.navigation.navigate(destination)
    }

    render(){
        return (
            <ImageBackground source={background} style= {[ t.flex1]}>
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
                                <Text style={[ t.text2xl, t.textWhite]}>Terms & Conditions</Text>
                            </Item>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.textXl, t.textWhite]}>Manage all your services in one place</Text>
                            </Item>
                        </View>
                    </Item>
                    <Item style={[t.itemsCenter, t.justifyCenter, t.borderTransparent, t.mT2]}>
                        <TouchableOpacity 
                            onPress={() => this.handleRoute('SignIn')}
                            style={[t.p4, t.roundedLg, t.bgGray500, t.itemsCenter, t.w10_12]}
                            >
                            <Text style={[t.textWhite, t.textLg]}>Back to login</Text>
                        </TouchableOpacity>
                    </Item>
                </ScrollView>
            </ImageBackground>
        )
    }
}