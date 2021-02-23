import React, {useState} from 'react';
import {View, Button, Platform, Text} from 'react-native';
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.onChange('callback_time', currentDate)
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
        <Text style={[t.textXl]}>{date.toLocaleDateString()}{''}</Text><FontAwesome5 name="check" size={24}  color="green" />
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