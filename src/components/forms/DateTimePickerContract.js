import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import {
  Item
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { t } from 'react-native-tailwindcss';
import { FontAwesome5 } from '@expo/vector-icons';

export const DateTimePickerContract = (props) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [highlight, showHighlight] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate);
    props.onChange('contractDate', currentDate);
    props.highlightInput('contractDate_highlight');
    showHighlight(true);
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
    <View style={[t.mT2, t.bgGray100, t.roundedLg]}>
      <View>
        <Button onPress={showDatepicker} title="Select Contract End Date" color="#000000"/>
      </View>
      <Item style={[t.alignCenter, t.justifyCenter, t.borderTransparent]}>
        {highlight ? <FontAwesome5 name="check" size={24}  color="green" /> : null }
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

export default DateTimePickerContract;