import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import {
  Container,
  Item,
  Icon,
  Input,
  DatePicker
} from 'native-base'
import { t } from 'react-native-tailwindcss';

// Load the app logo
const logo = require('../images/office.png')

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
      <View style={[ t.bgGray300, t.h]}>
        <View style={[t.bgWhite, t.hAuto, t.roundedLg, t.pB4 ]}>
          <Item>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg]}>
                <Text style={[t.text2xl]}>
                  Annual Expenses
                </Text>
              </View>
            </Item>
          </Item>
        </View>
        <View style={[ t.h3]}></View>
        <View style={[t.bgWhite, t.hAuto, t.roundedLg, t.pB4 ]}>
          <Item>
            <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter]}>
              <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.itemsCenter]}>
                <Text style={[t.text2xl]}>
                  Monthly Breakdown for: {this.state.year}
                </Text>
                <Text>
                    Your annual expenses are broken down to each month:
                </Text>
                {
                    this.state.services.map((s, i) => 
                    <>
                        <Text key={i}>{s.name} - {s.provider}</Text>
                    </>
                    )
                }
              </View>
            </Item>
          </Item>
        </View>
      </View>
    )
  }
}