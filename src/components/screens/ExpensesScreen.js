import React from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ImageBackground
} from 'react-native'
import {
  Item
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import { FontAwesome5 } from '@expo/vector-icons';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getServices } from '../../graphql/queries'
import CollapsibleList from "react-native-collapsible-list";
import PieChart from '../forms/PieChartDisplay';
import PieChartYear from '../forms/PieChartDisplayYear';
import PieChartSavings from '../forms/PieChartDisplaySavings';
import Header from "../forms/Header";
import NavBar from "../forms/NavBar";

const background = require('../images/background.png')

export default class ExpensesScreen extends React.Component {
  state ={
    curTab: 2,
    activeTab: 2,
    annualCost: 0,
    monthlyCost: 0,
    moneySaved: 0,
    chevron1: false,
    chevron2: false,
    chevron3: false,
    refreshing: false,
    services: [],
    activeServices: [],
    savings: [],
    routes: [
      'Home',
      'Services',
      'Expenses',
      'Quote',
      'Account'
    ]
  }

  _handlePress = (index) => {
    this.setState({ curTab: index})
    this.handleRoute(this.state.routes[index]);
  }

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }

  async componentDidMount(){
    let user = await Auth.currentAuthenticatedUser();
    const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
    const savings = [];
    const activeServices = [];
    let sum = userServices.data["getServices"].items.reduce(function(prev, current) {
        if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
            if(!isNaN(parseFloat(current.cost_year))){
                return prev + +parseFloat(current.cost_year) 
            }
        }
        return prev
    }, 0);

    let sum2 = userServices.data["getServices"].items.reduce(function(prev, current) {
        if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
            if(!isNaN(parseFloat(current.cost_month))){
                return prev + +parseFloat(current.cost_month) 
            }
        }
        return prev
    }, 0);

    let sum3 = userServices.data["getServices"].items.reduce(function(prev, current) {
        if(current.status === "CURRENT" || current.status === "LIVE" || current.status === "Live" || current.status === "Live Contract"){
            if(!isNaN(parseFloat(current.savings))){
                return prev + +parseFloat(current.savings) 
            }
        }
        return prev
    }, 0);
    this.setState({annualCost: sum.toFixed(2)})
    this.setState({monthlyCost: parseFloat(sum2).toFixed(2)})
    this.setState({moneySaved: parseFloat(sum3).toFixed(2)})

    userServices.data["getServices"].items.map(lead => {
        if(lead.status === "CURRENT" || lead.status === "LIVE" || lead.status === "Live" || lead.status === "Live Contract"){
            var date = new Date(lead.contract_end);
            if(isNaN(date)){
                date = new Date()
            }
            var dateString = date.toLocaleString();
            const newValue = {
                service_name: lead.service_name,
                contract_length: lead.contract_length,
                contract_end: dateString.substring(0, 10),
                cost_year: lead.cost_year,
                cost_month: lead.cost_month,
                savings: lead.savings
            }
            activeServices.push(newValue);
            if(lead.savings){
                savings.push(newValue);
            }
        }
    })
    this.setState({
        activeServices: activeServices,
        savings: savings,
        services: userServices.data["getServices"].items
    })
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  swapChevron1 = () => {
    this.setState(prevState => ({
      chevron1: !prevState.chevron1
    }));    
  }

  swapChevron2 = () => {
    this.setState(prevState => ({
      chevron2: !prevState.chevron2
    }));    
  }

  swapChevron3 = () => {
    this.setState(prevState => ({
      chevron3: !prevState.chevron3
    }));    
  }

  render() {
    //costs per month
    const water = [];
    const gas = [];
    const elec = [];
    const oil = [];
    const energyReduction = [];
    const wasteManagement = [];
    const businessRatesReview = [];
    const fuelCards = [];
    const telecommsBroadband = [];
    const cyberSecurity = [];
    const printers = [];
    const merchantServices = [];
    const insolvency = [];
    //cost per year
    const waterYear = [];
    const gasYear = [];
    const elecYear = [];
    const oilYear = [];
    const energyReductionYear = [];
    const wasteManagementYear = [];
    const businessRatesReviewYear = [];
    const fuelCardsYear = [];
    const telecommsBroadbandYear = [];
    const cyberSecurityYear = [];
    const printersYear = [];
    const merchantServicesYear = [];
    const insolvencyYear = [];
    this.state.services.map(lead => {
        if(lead.status === "CURRENT" || lead.status === "Live" || lead.status === "LIVE" || lead.status === "Live Contract"){
            if (lead.service_name === "Gas" && lead.cost_month) {
                gas.push(parseFloat(lead.cost_month));
                gasYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Electric" && lead.cost_month) {
                elec.push(parseFloat(lead.cost_month));
                elecYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Water" && lead.cost_month) {
                water.push(parseFloat(lead.cost_month));
                waterYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Oil" && lead.cost_month) {
                oil.push(parseFloat(lead.cost_month));
                oilYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Energy Reduction" && lead.cost_month) {
                energyReduction.push(parseFloat(lead.cost_month));
                energyReductionYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Waste Management" && lead.cost_month) {
                wasteManagement.push(parseFloat(lead.cost_month));
                wasteManagementYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Business Rates Review" && lead.cost_month) {
                businessRatesReview.push(parseFloat(lead.cost_month));
                businessRatesReviewYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Fuel Cards" && lead.cost_month) {
                fuelCards.push(parseFloat(lead.cost_month));
                fuelCardsYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Telecomms & Broadband" && lead.cost_month) {
                telecommsBroadband.push(parseFloat(lead.cost_month));
                telecommsBroadbandYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Cyber Security" && lead.cost_month) {
                cyberSecurity.push(parseFloat(lead.cost_month));
                cyberSecurityYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Printers" && lead.cost_month) {
                printers.push(parseFloat(lead.cost_month));
                printersYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Merchant Services" && lead.cost_month) {
                merchantServices.push(parseFloat(lead.cost_month));
                merchantServicesYear.push(parseFloat(lead.cost_year));
            } else if(lead.service_name === "Insolvency" && lead.cost_month) {
                insolvency.push(parseFloat(lead.cost_month));
                insolvencyYear.push(parseFloat(lead.cost_year));
            }
        }
    });
    //do summary 
    const gasTotal = gas.reduce((result, number) => result+number, 0);        
    const elecTotal = elec.reduce((result, number) => result+number, 0);
    const waterTotal = water.reduce((result, number) => result+number, 0);
    const oilTotal = oil.reduce((result, number) => result+number, 0);
    const energyReductionTotal = energyReduction.reduce((result, number) => result+number, 0);
    const wasteManagementTotal = wasteManagement.reduce((result, number) => result+number, 0);
    const businessRatesTotal = businessRatesReview.reduce((result, number) => result+number, 0);
    const fuelCardsTotal = fuelCards.reduce((result, number) => result+number, 0);
    const telecommsTotal = telecommsBroadband.reduce((result, number) => result+number, 0);
    const cyberSecurityTotal = cyberSecurity.reduce((result, number) => result+number, 0);
    const printersTotal = printers.reduce((result, number) => result+number, 0);
    const merchantServicesTotal = merchantServices.reduce((result, number) => result+number, 0);
    const insolvencyTotal = insolvency.reduce((result, number) => result+number, 0);
    const monthTotals = [
        gasTotal, 
        elecTotal, 
        waterTotal,
        oilTotal, 
        energyReductionTotal,
        wasteManagementTotal,
        businessRatesTotal,
        fuelCardsTotal,
        telecommsTotal,
        cyberSecurityTotal,
        printersTotal,
        merchantServicesTotal,
        insolvencyTotal
    ];
    const gasTotalYear = gasYear.reduce((result, number) => result+number, 0);        
    const elecTotalYear = elecYear.reduce((result, number) => result+number, 0);
    const waterTotalYear = waterYear.reduce((result, number) => result+number, 0);
    const oilTotalYear = oilYear.reduce((result, number) => result+number, 0);
    const energyReductionTotalYear = energyReductionYear.reduce((result, number) => result+number, 0);
    const wasteManagementTotalYear = wasteManagementYear.reduce((result, number) => result+number, 0);
    const businessRatesTotalYear = businessRatesReviewYear.reduce((result, number) => result+number, 0);
    const fuelCardsTotalYear = fuelCardsYear.reduce((result, number) => result+number, 0);
    const telecommsTotalYear = telecommsBroadbandYear.reduce((result, number) => result+number, 0);
    const cyberSecurityTotalYear = cyberSecurityYear.reduce((result, number) => result+number, 0);
    const printersTotalYear = printersYear.reduce((result, number) => result+number, 0);
    const merchantServicesTotalYear = merchantServicesYear.reduce((result, number) => result+number, 0);
    const insolvencyTotalYear = insolvencyYear.reduce((result, number) => result+number, 0);
    const yearTotals = [
        gasTotalYear, 
        elecTotalYear, 
        waterTotalYear,
        oilTotalYear, 
        energyReductionTotalYear,
        wasteManagementTotalYear,
        businessRatesTotalYear,
        fuelCardsTotalYear,
        telecommsTotalYear,
        cyberSecurityTotalYear,
        printersTotalYear,
        merchantServicesTotalYear,
        insolvencyTotalYear
    ];
    const labelsData = [
        'Gas',
        'Electric',
        'Water',
        'Oil',
        'Energy Reduction',
        'Waste Management',
        'Business Rates',
        'Fuel Cards',
        'Telecoms & Broadband',
        'Cyber Security',
        'Printers',
        'Merchant Services',
        'Insolvency'
    ]
    const newLabels = []
    const data = [];
    const data2 = [];
    const data3 = [];
    const colors = [
        '#fc8181',
        '#fcc981',
        '#90cdf4',
        '#d490f4',
        '#fbd38d',
        '#dafb8d',
        '#9ffb8d',
        '#fb8dea',
        '#8dcffb',
        '#8dfbac',
        '#fb8dd1',
        '#ffb8e8',
        '#97e8bb'
    ]

    const NewMonthTotal = monthTotals.filter(function(e, index){
        if(e > 0){
            //get index and value from existing labels and add to new 
            let newLabel = labelsData[index];
            newLabels.push(newLabel);
            let entry = {
                key: data.length + 1,
                value: e,
                label: newLabel,
                svg: { fill: colors[index] },
            }
            data.push(entry)
            return e
        }
    });

    const NewYearTotal = yearTotals.filter(function(e, index){
        if(e > 0){
            //get index and value from existing labels and add to new 
            let newLabel = labelsData[index];
            newLabels.push(newLabel);
            let entry = {
                key: data2.length + 1,
                value: e,
                label: newLabel,
                svg: { fill: colors[index] },
            }
            data2.push(entry)
            return e
        }
    });
    const NewSavingsTotal = this.state.savings.map((anObjectMapped) => {
        if(anObjectMapped.savings > 0){
            //get index and value from existing labels and add to new 
            var index = labelsData.findIndex(obj => obj === anObjectMapped.service_name)
            let entry = {
                key: data3.length + 1,
                value: Number(anObjectMapped.savings),
                label: anObjectMapped.service_name,
                svg: { fill: colors[index] },
            }
            data3.push(entry)
            return anObjectMapped.savings
        }
    });

    return (
        <View source={background} style= {[ t.flex1]}>
            <Header/>
            <ImageBackground source={background} style= {[ t.flex1]}>
                <ScrollView
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                    <View style={[t.mT5,t.alignCenter, t.borderTransparent,t.pX3, t.pY4, t.pt8, t.wFull]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Text style={[ t.text3xl, t.fontSemibold, t.textWhite]}>Expenses</Text>
                        </Item>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Text style={[ t.textXl, t.textWhite]}>Manage your expenses</Text>
                        </Item>
                    </View>
                    <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <CollapsibleList
                            numberOfVisibleItems={0}
                            wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600]}
                            buttonPosition="top"
                            onToggle={() => {
                            this.swapChevron1();
                            }}
                            buttonContent={
                                <View style={[ t.p3, t.flex1]}>
                                    <Text style={[ t.textWhite, t.fontMedium, t.textXl, t.p2]}>Monthly Expenses
                                        {'                              '} 
                                        { this.state.chevron1 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                                    <Text style={[ t.textLg]}>{'                     '} £{this.state.monthlyCost}</Text>
                                    </Text>
                                </View>
                            }
                        >
                            <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                                <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Service</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Contract End Date</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Cost Month</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Contract Length</Text>
                                        </Item>
                                    </View>
                                </View>
                                {
                                this.state.activeServices.map((anObjectMapped, index) => { // This will render a row for each data element.
                                    return (
                                    <View key={index} style={[ t.flex1, t.selfStretch, t.flexRow]}>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>{anObjectMapped.service_name}</Text>
                                            </Item>
                                        </View>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>{anObjectMapped.contract_end}</Text>
                                            </Item>
                                        </View>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>£{anObjectMapped.cost_month}</Text>
                                            </Item>
                                        </View>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>{anObjectMapped.contract_length}</Text>
                                            </Item>
                                        </View>
                                    </View>
                                    )
                                })
                                }
                                <View style={[ t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                                    <PieChart data={data}/>
                                </View>
                            </View>
                        </CollapsibleList>
                    </Item>
                    <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <CollapsibleList
                        numberOfVisibleItems={0}
                        wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600]}
                        buttonPosition="top"
                        onToggle={() => {
                        this.swapChevron2();
                        }}
                        buttonContent={
                            <View style={[ t.p3, t.flex1]}>
                                <Text style={[ t.textWhite, t.fontMedium, t.textXl, t.p2]}>Annual Expenses 
                                    {'                                 '} 
                                    { this.state.chevron2 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                                    <Text style={[ t.textLg]}>{'                     '} £{this.state.annualCost}</Text>
                                </Text>
                            </View>
                        }
                        >
                            <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                                <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Service</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Contract End Date</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Cost Year</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text style={[ t.fontBold]}>Contract Length</Text>
                                        </Item>
                                    </View>
                                </View>
                                {
                                this.state.activeServices.map((anObjectMapped, index) => { // This will render a row for each data element.
                                    return (
                                    <View key={index} style={[ t.flex1, t.selfStretch, t.flexRow]}>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>{anObjectMapped.service_name}</Text>
                                            </Item>
                                        </View>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>{anObjectMapped.contract_end}</Text>
                                            </Item>
                                        </View>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>£{anObjectMapped.cost_year}</Text>
                                            </Item>
                                        </View>
                                        <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                            <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                                <Text>{anObjectMapped.contract_length}</Text>
                                            </Item>
                                        </View>
                                    </View>
                                    )
                                })
                                }
                                <View style={[ t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                                    <PieChartYear data={data2}/>
                                </View>
                            </View>
                        </CollapsibleList>
                    </Item>
                    <Item style={[ t.mT4, t.alignCenter, t.justifyCenter, t.borderTransparent]}>
                        <CollapsibleList
                        numberOfVisibleItems={0}
                        wrapperStyle={[ t.roundedLg, t.bgWhite, t.flex1, t.bgGray600]}
                        buttonPosition="top"
                        onToggle={() => {
                        this.swapChevron3();
                        }}
                        buttonContent={
                            <View style={[ t.p3, t.flex1]}>
                                <Text style={[ t.textWhite, t.fontMedium, t.textXl, t.p2]}>Savings To Date 
                                    {'                                   '} 
                                    { this.state.chevron3 == false ? <FontAwesome5 name="chevron-up" size={24} color="white" /> : <FontAwesome5 name="chevron-down" size={24} color="white" />}
                                    <Text style={[ t.textLg]}>{'                     '} £{this.state.moneySaved}</Text>
                                </Text>
                            </View>
                        }
                        >
                        <View style={[ t.p3, t.borderB, t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                            <View style={[ t.flex1, t.selfStretch, t.flexRow]}>
                                <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                        <Text style={[ t.fontBold]}>Service</Text>
                                    </Item>
                                </View>
                                <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                        <Text style={[ t.fontBold]}>Contract End Date</Text>
                                    </Item>
                                </View>
                                <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                        <Text style={[ t.fontBold]}>Savings</Text>
                                    </Item>
                                </View>
                                <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                    <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                        <Text style={[ t.fontBold]}>Contract Length</Text>
                                    </Item>
                                </View>
                            </View>
                            {
                            this.state.savings.map((anObjectMapped, index) => { // This will render a row for each data element.
                                return (
                                <View key={index} style={[ t.flex1, t.selfStretch, t.flexRow]}>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text>{anObjectMapped.service_name}</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text>{anObjectMapped.contract_end}</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text>£{anObjectMapped.savings}</Text>
                                        </Item>
                                    </View>
                                    <View style={[t.pX1, t.pY2, t.pt4, t.roundedLg, t.w1_4]}>
                                        <Item style={[t.pX1, t.pY1, t.pt2, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                            <Text>{anObjectMapped.contract_length}</Text>
                                        </Item>
                                    </View>
                                </View>
                                )
                            })
                            }
                            <View style={[ t.flex1, t.bgWhite, t.alignCenter, t.justifyCenter]}>
                                <PieChartSavings data={data3}/>
                            </View>
                        </View>
                        </CollapsibleList>
                    </Item>
                </ScrollView>
                <NavBar activeTab={[0,0,1,0,0]} index={this.state.activeTab} _handlePress={this._handlePress}/>
            </ImageBackground>
        </View>
    )
  }
}