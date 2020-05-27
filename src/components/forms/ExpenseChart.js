import React from 'react';
import {View} from 'react-native';
import { t } from 'react-native-tailwindcss';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

class ExenseChart extends React.PureComponent{
    render() {

        const data = [ 14, 80, 100, 55 ]

        return (
            <View style={[t.h48, t.p5]}>
                <BarChart
                    style={[t.flex1]}
                    data={data}
                    gridMin={0}
                    svg={{ fill: 'rgb(134, 65, 244)' }}
                />
                <XAxis
                    style={{ marginTop: 10 }}
                    data={ data }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => index }
                    labelStyle={ { color: 'black' } }
                />
            </View>
        )
    }
}

export default ExenseChart;