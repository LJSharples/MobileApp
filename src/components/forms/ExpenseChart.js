import React, { Component } from 'react';
import {View} from 'react-native';
import { Text } from 'react-native-svg'
import { t } from 'react-native-tailwindcss';
import { PieChart } from 'react-native-svg-charts';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getServices } from '../../graphql/queries'

export default class ExpenseChart extends Component{
    state ={
        services: []
    }
    async componentDidMount(){
        let user = await Auth.currentAuthenticatedUser();
        const userServices = await API.graphql(graphqlOperation(getServices, { user_name: user.username}));
        this.setState({ services: userServices.data["getServices"].items});
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
            if(lead.status === "CUSTOMER DELETED"){
            } else {
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
        const data = [];
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
                data.push({
                    key: data.length + 1,
                    value: e,
                    label: newLabel,
                    svg: { fill: colors[index] }
                })
                return e
            }
        });  

        const LabelsDisplay = ({ slices, height, width }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <Text
                        key={index}
                        x={pieCentroid[ 0 ]}
                        y={pieCentroid[ 1 ]}
                        fill={'black'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={20}
                        stroke={'black'}
                        strokeWidth={0.2}
                    >
                        {data.label}
                    </Text>
                )
            })
        }

        return (
            
            <View style={[ t.pX6,  t.p5, t.wAuto, t.borderTransparent ]}>
                <PieChart
                    style={{ height: 200 }}
                    valueAccessor={({ item }) => item.value}
                    data={data}
                    spacing={0}
                    outerRadius={'95%'}
                >
                    <LabelsDisplay/>
                </PieChart>
            </View>
        )
    }
}