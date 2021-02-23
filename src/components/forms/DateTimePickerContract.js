import React, {useState} from 'react';
import {View, Button, Platform, Text} from 'react-native';
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
  const [display, showDisplay] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.onChange('contractDate', currentDate);
    //time delay 3-5 seconds
    showDisplay(true);
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
        <Button onPress={showDatepicker} title="Select Contract End Date" color="#000000"/> 
        {display ? 
            <Item style={[t.alignCenter, t.justifyCenter, t.itemsCenter, t.mT2, t.borderTransparent]}>
              <Text style={[t.textXl]}>{date.toLocaleDateString()}{'   '}</Text><FontAwesome5 name="check" size={24}  color="green" />
            </Item> 
          : 
          null
        }
      </View>
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