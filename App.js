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
import SettingsScreen from './src/components/screens/SettingsScreen'
import ProfileScreen from './src/components/screens/ProfileScreen'
import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen';

// screen imports
import WelcomeScreen from './src/components/screens/WelcomeScreen'
import SignUpScreen from './src/components/screens/SignUpScreen'
import SignInScreen from './src/components/screens/SignInScreen'
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen'
import ServicesScreen from './src/components/screens/ServicesScreen';
import ExpensesScreen from './src/components/screens/ExpensesScreen';

const configurations = {
  Dashboard: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Dashboard',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons style={{ fontSize: 26, color: tintColor }} name="ios-home" />
      ),
    },
  },
  Services: {
    screen: ServicesScreen,
    navigationOptions: {
      tabBarLabel: 'Services',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 26, color: tintColor }}
          name="ios-power"
        />
      ),
    },
  },
  My_Account: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'My Account',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 26, color: tintColor }}
          name="ios-person"
        />
      ),
    },
  },
  Expenses: {
    screen: ExpensesScreen,
    navigationOptions: {
      tabBarLabel: 'Annual Expenses',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 26, color: tintColor }}
          name="ios-cash"
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
    activeTintColor: '#87CEFA',
    inactiveTintColor: '#87CEFA',
    style: {
      backgroundColor: '#FFFAFA'
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 12,
      color: '#87CEFA'
    },
    indicatorStyle: {
      height: 0,
    },
    showIcon: true,
  },
};

// Bottom App tabs
const AppTabNavigator = createMaterialTopTabNavigator(configurations, options);

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let headerTitle = routeName;
  return {
    headerTitle,
  };
};

const AppStackNavigator = createStackNavigator({
  Header: {
    screen: AppTabNavigator,
    // Set the header icon
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
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
  Dashboard: HomeScreen,
  Services: ServicesScreen,
  My_Account: ProfileScreen,
  Expenses: ExpensesScreen,
});

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: () => ({
      title: `Welcome to Managed Bills`, // for the header screen
      headerBackTitle: 'Back',
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
      title: `Log In`,
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
