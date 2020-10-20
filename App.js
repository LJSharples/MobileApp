import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native';
import { 
  createAppContainer, 
  createSwitchNavigator
} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';

import Amplify from '@aws-amplify/core';
import awsConfig from './src/aws-exports';
Amplify.configure(awsConfig);

import HomeScreen from './src/components/screens/HomeScreen'
import ServicesScreen from './src/components/screens/ServicesScreen';
import ExpensesScreen from './src/components/screens/ExpensesScreen';
import SettingsScreen from './src/components/screens/SettingsScreen'
import ProfileScreen from './src/components/screens/ProfileScreen'
import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen';

// screen imports
import WelcomeScreen from './src/components/screens/WelcomeScreen'
import SignUpScreen from './src/components/screens/SignUpScreen'
import SignInScreen from './src/components/screens/SignInScreen'
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen'
import NotificationsScreen from './src/components/screens/NotificationsScreen';

const configurations = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons 
          style={{ fontSize: 20, color: tintColor }} 
          name="ios-home" 
        />
      ),
    },
  },
  Services: {
    screen: ServicesScreen,
    navigationOptions: {
      tabBarLabel: 'Services',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 20, color: tintColor }}
          name="ios-power"
        />
      ),
    },
  },
  Account: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'My Account',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 20, color: tintColor }}
          name="ios-person"
        />
      ),
    },
  },
  Expenses: {
    screen: ExpensesScreen,
    tabBarLabel: 'Money',
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 20, color: tintColor }}
          name="ios-card"
        />
      ),
    },
  },
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: {
      tabBarLabel: 'Notices',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 20, color: tintColor }}
          name="ios-mail"
        />
      ),
    },
  },
};

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: true,
  },
  tabBarOptions: {
    showLabel: true,
    upperCaseLabel: false,
    activeTintColor: '#367bb0',
    inactiveTintColor: '#c2daed',
    style: {
      backgroundColor: '#d3e6f6'
    },
    labelStyle: {
      fontSize: 12,
      fontFamily: 'Trebuchet MS',
      fontWeight: '500',
      margin: 0,
      padding: 0,
      color: '#367bb0',
    },
    showIcon: true,
  },
};

// Bottom App tabs
const AppTabNavigator = createMaterialTopTabNavigator(configurations, options);


const AppStackNavigator = createStackNavigator({
  Header: {
    screen: AppTabNavigator,
    // Set the header icon
    navigationOptions: ({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 10 }}>
            <Ionicons size={24} name="md-menu" />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
});

// App stack for the drawer
const AppDrawerNavigator = createDrawerNavigator({
    Pages: AppStackNavigator, // defined above
    Home: HomeScreen,
    Services: ServicesScreen,
    Account: {
      screen: ProfileScreen,
      navigationOptions: () => ({
        title: 'My Account',
      }),
    },
    Expenses: {
      screen: ExpensesScreen,
      navigationOptions: () => ({
        title: 'My Money',
      }),
    },
    Notifications: {
      screen: NotificationsScreen,
      navigationOptions: () => ({
        title: 'Notices',
      }),
    },
  },{
    drawerBackgroundColor: "#d3e6f6",
    drawerType:'slide',
    contentOptions: {
      activeTintColor: '#367bb0',
      itemsContainerStyle: {
        marginVertical: 0,
      },
      activeBackgroundColor:"#d3e6f6",
    },
});

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: () => ({
      headerBackTitle: 'Back',
      headerShown: false
    }),
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: () => ({
      title: `Register an account`,
    }),
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: `Login`,
      headerShown: false
    }),
  },
  ForgetPassword: {
    screen: ForgetPasswordScreen,
    navigationOptions: () => ({
      title: `Create a new password`,
    }),
  },
});

// Application nav stack
const appNav = createSwitchNavigator({
  Authloading: AuthLoadingScreen,
  Auth: AuthStackNavigator, // the Auth stack
  App: AppDrawerNavigator, // the App stack
});

const AppContainer = createAppContainer(appNav);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
