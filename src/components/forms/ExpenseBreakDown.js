import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native'
import {
  Item,
} from 'native-base'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';
import { PieChart, BarChart, Grid } from 'react-native-svg-charts';

// Service colors and icons
import serviceIcons from '../ServiceIcons';
import serviceColors from '../ServiceColours';

const values = {
    Gas: "109.62",
    Electric: "301.87",
    Water: "121.38",
}

export default class ExpenseDetails extends React.Component {

    render(){

        const data = [
            {
                key: 1,
                amount: 50,
                svg: { fill: '#600080' },
            },
            {
                key: 2,
                amount: 50,
                svg: { fill: '#9900cc' }
            },
            {
                key: 3,
                amount: 40,
                svg: { fill: '#c61aff' }
            },
            {
                key: 4,
                amount: 95,
                svg: { fill: '#d966ff' }
            },
            {
                key: 5,
                amount: 35,
                svg: { fill: '#ecb3ff' }
            }
        ]

        const data2 = [50, 10, 40, 95, 85];

        const Labels = ({ slices, height, width }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <Text
                        key={index}
                        x={pieCentroid[ 0 ]}
                        y={pieCentroid[ 1 ]}
                        fill={'white'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={24}
                        stroke={'black'}
                        strokeWidth={0.2}
                    >
                        {data.amount}
                    </Text>
                )
            })
        }

        return (
            <View style={[t.flex1]}>
                <ScrollView
                    style={[t.hFull]}>
                    <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            <Text style={[t.textXl, t.itemsCenter, t.pE8]}>{this.props.selectedMonth} {this.props.selectedYear} - £{this.props.monthCost}</Text>
                        </Item>
                    </View>
                    <View style={[t.roundedLg, t.itemsCenter, t.roundedLg]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                        <BarChart
                            style={{ flex: 1, marginLeft: 8 }}
                            data={data}
                            horizontal={true}
                            svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
                            contentInset={{ top: 10, bottom: 10 }}
                            spacing={0.2}
                            gridMin={0}
                            >
                            <Grid direction={Grid.Direction.VERTICAL}/>
                        </BarChart>
                        </Item>
                    </View>
                    <View style={[t.roundedLg, t.itemsCenter, t.roundedLg]}>
                        <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                            <Text style={[t.textXl, t.itemsCenter, t.pE8]}>{this.props.updateNotice}</Text>
                        </Item>
                    </View>
                    <Item style={[t.pX3, t.pY2, t.pt4, t.alignCenter, t.justifyCenter, t.bgWhite, t.wFull, t.hFull, t.mT5,]}>
                        <View style={[t.pX3, t.pY2, t.pt4, t.roundedLg, t.w1_2, t.wFull, t.hFull, t.mT5]}>
                            <Item style={[t.pX2, t.pY2, t.pt4, t.itemsStart, t.justifyStart, t.borderTransparent]}>
                                <Text style={[ t.textXl]}> All Services</Text>
                            </Item>
                            <View rounded>
                                {
                                    this.props.services.map((s, i) => 
                                        <>
                                            <View style={[t.roundedLg, t.itemsCenter, t.roundedLg, t.mT2]} backgroundColor={serviceColors[s.name]}>
                                            <Item style={[t.pX2, t.pY2, t.pt4, t.borderTransparent]}>
                                                <FontAwesome5 name={serviceIcons[s.name]} size={24} color="black" style={[t.pE8]}/>
                                <Text key={i} style={[t.textXl, t.itemsCenter, t.pE8]}>{s.name} - £{values[s.name]}</Text>
                                            </Item>
                                            </View>
                                        </>
                                    )
                                }
                            </View>
                        </View>
                    </Item>
                </ScrollView>
            </View>
        )
    }
}