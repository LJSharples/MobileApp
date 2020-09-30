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
import { Ionicons } from '@expo/vector-icons';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'



export default class NotificationsScreen extends React.Component {
  state = {
      notices: [
        {
          "Header": "Update",
          "brief": "Advanced notice"
        },
        {
          "Header": "New",
          "brief": "New procedure"
        }
      ],
  };

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
          {
            this.state.notices.map((s, i) => 
              <Item key={i} style={[t.pX6, t.pY4, t.pt8, t.alignCenter, t.justifyCenter, t.wFull, t.borderTransparent]}>
                <View style={[t.pX6, t.pY4, t.pt8, t.roundedLg, t.bgIndigo200, t.itemsCenter]}>
                  <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                    <Ionicons name="ios-bulb" style={[ t.text2xl]}> {s.Header}</Ionicons>
                  </Item>
                  <Item style={[t.pX6, t.pY2, t.pt8,t.itemsCenter, t.justifyCenter]}>
                    <Text style={[t.textSm]}>{s.brief}</Text>
                  </Item>
                </View>
              </Item>
            )
          }
          
          
        </ScrollView>
      </View>
    )
  }
}