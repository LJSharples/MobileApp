import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import {
  Item,
} from 'native-base'
import { t } from 'react-native-tailwindcss';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getServices, getUserDetails } from '../../graphql/queries'
import { PieChart } from 'react-native-svg-charts'
import ExpenseChart from './ExpenseChart';


export default class ExpenseDetails extends React.Component {
    state = {
        userProfile: {},
        userCompany: {},
        rowVisible: false,
        services: [],
        annualCost: 0,
        monthlyCost: 0,
        moneySaved: 0,
        greeting: 'Hello'
    };

    async componentDidMount(){
        let user = await Auth.currentAuthenticatedUser();
        const userProfile = await API.graphql(graphqlOperation(getUserDetails, { user_name: user.username}));
        this.setState({ userProfile: userProfile.data["user"]});
        this.setState({ userCompany: userProfile.data["getCompany"]});
    
        const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
        this.setState({ services: userServices.data["getServices"].items});

        let sum = userServices.data["getServices"].items.reduce(function(prev, current) {
            return prev + +current.cost_year
        }, 0);
        this.setState({annualCost: sum})


        let sum2 = userServices.data["getServices"].items.reduce(function(prev, current) {
            return prev + +current.cost_month
        }, 0);
        this.setState({monthlyCost: sum2})

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
        userServices.data["getServices"].items.map(lead => {
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
            if(lead.new_cost_month && lead.new_cost_year){
                this.generateMoneySaved(lead.cost_year, lead.new_cost_year)
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

        const labelsData = [
            'Gas',
            'Electricity',
            'Water',
            'Oil',
            'Energy reduction',
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
        const NewMonthTotal = monthTotals.filter(function(e, index){
            if(e > 0){
                //get index and value from existing labels and add to new 
                let newLabel = labelsData[index];
                newLabels.push(newLabel);
                return e
            }
        });        
    }

    generateMoneySaved = (oldYear, newYear) => {
        if(newYear > oldYear){
            var money = oldYear - newYear
            this.setState({ moneySaved: this.state.moneySaved + money})
        }
    }


    expandRow(month, year){
        this.setState({
            rowVisible: true,
            selectedMonth: month,
            selectedYear: year
        })
    }

    closeRow(){
        this.setState({
            rowVisible: false
        })
    }

    render(){
        return (
            <View style={[t.flex1]}>
                <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
                    <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                            <Text style={[ t.textXl]}> Annual Costs: £{this.state.annualCost}</Text>
                        </Item>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart]}>
                            <Text style={[ t.textXl]}> Monthly Costs: £{this.state.monthlyCost}</Text>
                        </Item>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                            <Text>Your annual expenses are broken down to each month:</Text>
                        </Item>
                        <ExpenseChart/>
                    </View>
                </Item>
            </View>
        )
    }
}