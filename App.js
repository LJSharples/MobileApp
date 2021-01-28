import React from 'react'
import {
  View,
  Image,
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
import QuoteScreen from './src/components/screens/QuoteScreen';
import CustomersScreen from "./src/components/screens/CustomersScreen";
import AffiliatesScreen from './src/components/screens/AffiliatesScreen';
import AffiliateExpensesScreen from './src/components/screens/AffiliateExpensesScreen';
import ProfileScreen from './src/components/screens/ProfileScreen'
import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen';

// screen imports
import WelcomeScreen from './src/components/screens/WelcomeScreen'
import SignUpScreen from './src/components/screens/SignUpScreen'
import SignInScreen from './src/components/screens/SignInScreen'
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen'
import NotificationsScreen from './src/components/screens/NotificationsScreen';
import AddServiceScreen from './src/components/screens/AddServiceScreen';
import AddQuoteScreen from './src/components/screens/AddQuoteScreen';
import AddAffiliateScreen from './src/components/screens/AddAffiliateScreen';
import AddCustomerScreen from './src/components/screens/AddCustomerScreen';
import TermsConditionsScreen from './src/components/screens/TermsConditionsScreen'

import addQuoteScreen from './src/components/screens/AddQuoteScreen';

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
  AddServices: {
    screen: AddServiceScreen,
    navigationOptions: {
      tabBarLabel: 'Add Service',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons 
          style={{ fontSize: 20, color: tintColor }} 
          name="ios-home" 
        />
      ),
    }
  },
  Customers: {
    screen: CustomersScreen,
    navigationOptions: {
      tabBarLabel: 'Customers',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 20, color: tintColor }}
          name="ios-power"
        />
      ),
    },
  },
  AddCustomer: {
    screen: AddCustomerScreen,
    navigationOptions: {
      tabBarLabel: 'Add Customer',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons 
          style={{ fontSize: 20, color: tintColor }} 
          name="ios-home" 
        />
      ),
    }
  },
  Affiliates: {
    screen: AffiliatesScreen,
    navigationOptions: {
      tabBarLabel: 'Affiliates',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 20, color: tintColor }}
          name="ios-power"
        />
      ),
    },
  },
  AddAffiliate: {
    screen: AddAffiliateScreen,
    navigationOptions: {
      tabBarLabel: 'Add Affiliate',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons 
          style={{ fontSize: 20, color: tintColor }} 
          name="ios-home" 
        />
      ),
    }
  },
  AddQuote: {
    screen: AddQuoteScreen,
    navigationOptions: {
      tabBarLabel: 'Add Quote',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons 
          style={{ fontSize: 20, color: tintColor }} 
          name="ios-home" 
        />
      ),
    }
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
  Quote: {
    screen: QuoteScreen,
    navigationOptions: {
      tabBarLabel: 'Get Quote',
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
  AffiliateExpenses: {
    screen: AffiliateExpensesScreen,
    tabBarLabel: 'Affiliate Income',
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
      headerTitle: (
        <Image
          resizeMode="contain"
          source={require('./src/components/images/managedbill-corporate-logo.png')}
        />
      ),
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
    Home: HomeScreen,
    Services: ServicesScreen,
    Customers: CustomersScreen,
    Affiliates: AffiliatesScreen,
    AddAffiliate: {
      screen: AddAffiliateScreen,
      navigationOptions: () => ({
        title: 'Add Affiliate',
      }),
    },
    AddCustomer: {
      screen: AddCustomerScreen,
      navigationOptions: () => ({
        title: 'Add Customer',
      }),
    },
    AddServices: {
      screen: AddServiceScreen,
      navigationOptions: () => ({
        title: 'Add Service',
      }),
    },
    AddQuote: {
      screen: addQuoteScreen,
      navigationOptions: () => ({
        title: 'Add Quote',
      }),
    },
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
    AffiliateExpenses: {
      screen: AffiliateExpensesScreen,
      navigationOptions: () => ({
        title: 'Affiliate Income',
      }),
    },
    Quote: {
      screen: QuoteScreen,
      navigationOptions: () => ({
        title: 'Get Quote',
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
      headerShown: false
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
  TermsConditions: {
    screen: TermsConditionsScreen,
    navigationOptions: () => ({
      headerShown: false
    })
  }
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
