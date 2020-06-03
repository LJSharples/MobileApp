import React from 'react';
import { Text } from 'react-native-svg';
import { t } from 'react-native-tailwindcss';
import { PieChart } from 'react-native-svg-charts';

class ServiceExpense extends React.PureComponent{
    render() {

        const data = [
            {
                key: 1,
                amount: 100,
                svg: { fill: '#600080' },
            },
            {
                key: 2,
                amount: 125,
                svg: { fill: '#c61aff' }
            },
            {
                key: 3,
                amount: 45,
                svg: { fill: '#ecb3ff' }
            }
        ]

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
            <PieChart
                style={[t.h48]}
                valueAccessor={({ item }) => item.amount}
                data={data}
                spacing={0}
                outerRadius={'95%'}
            >
                <Labels/>
            </PieChart>
        )
    }
}

export default ServiceExpense;