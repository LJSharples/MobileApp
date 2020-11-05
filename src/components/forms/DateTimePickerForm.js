import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { t } from 'react-native-tailwindcss';

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
    <View style={[t.mT2, t.bgGray100, t.roundedLg]}>
      <View>
        <Button onPress={showDatepicker} title="Select Callback Date" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Select Callback Time" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          style={[t.flex1]}
        />
      )}
    </View>
  );
};

export default DateTimePickerForm;