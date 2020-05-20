import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native'
import {
  Item,
} from 'native-base'
import { t } from 'react-native-tailwindcss';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

//custom queries
const ListServicesComp = `query listServices($company: String!){
  listServices(filter:{
    business:{
      contains:$company
    }
  }){
    items{
      name, provider contracts {
        items{
          id eac length contractStart contractEnd
        }
      }
    }
  }
}`

export default class NotificationsScreen extends React.Component {
    state = {
        username: '',
        company_name: '',
        year: '2020',
        services: [],
    };

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    return (
      <View style={[t.flex1]}>
        <ScrollView
        style={[t.hFull]}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
          <View style={[t.bgWhite, t.roundedLg, t.pB4 ]}>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.borderTransparent]}>
                <Text style={[t.text2xl]}>
                  Annual Expenses
                </Text>
            </Item>
          </View>
        </ScrollView>
      </View>
    )
  }
}