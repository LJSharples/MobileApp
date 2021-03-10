import React, {useState} from 'react';
import {View, Button, Platform, Text, Image} from 'react-native';
import {
  Item
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { t } from 'react-native-tailwindcss';
import { FontAwesome5 } from '@expo/vector-icons';

export const DateTimePickerForm = (props) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const check = require('../images/pngegg.png')

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.onChange('callback_time', currentDate, true)
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={[t.mT2, t.bgGray100, t.roundedLg, t.w4_5]}>
      <View>
        <Button onPress={showDatepicker} title="Select Callback Date" color="#000000"/>
      </View>
      <View>
        <Button onPress={showTimepicker} title="Select Callback Time" color="#000000"/>
      </View>
      <Item style={[t.alignCenter, t.justifyCenter, t.borderTransparent]}>
        <Text style={[t.textXl]}>{date.toLocaleDateString()}{''}</Text><Image
              style={[ t.w10, t.h10, t.mL1]}
                  source={check}
                  resizeMode="cover"
                />
      </Item> 
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DateTimePickerForm;