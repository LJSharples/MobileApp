import React from 'react';
import {View} from 'react-native';
import { Text } from 'react-native-svg';
import { t } from 'react-native-tailwindcss';
import { BarChart, XAxis, Grid, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

class ExenseChart extends React.PureComponent{
    render() {

        const data = [ 14, 80, 100, 55 ]

        return (
            
            <View style={[ t.pX6,  t.p5, t.wAuto, t.borderTransparent ]}>
                <View style={[ t.h48, t.bgRed300, t.roundedLg]}>
                    <BarChart
                        style={[ t.flex1 ]}
                        data={data}
                        gridMin={0}
                        svg={{ fill: 'rgb(134, 65, 244)' }}
                    >
                        <Grid 
                        style={[t.bgRed300]}/>
                    </BarChart>
                    <XAxis
                        style={[ t.mT3 ]}
                        data={data}
                        xAccessor={({ index }) => index}
                        scale={scale.ScaleBand}
                        formatLabel={(_, index) => data[index]}
                    />
                </View>
            </View>
        )
    }
}

export default ExenseChart;