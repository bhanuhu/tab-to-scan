import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function FollowUpDateTimePicker({
  value,
  mode = 'date',
  is24Hour = true,
  display = Platform.OS === 'android' ? 'default' : 'spinner',
  visible = true,
  style,
  flex,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [internalDate, setInternalDate] = useState(value || new Date());
  const [formattedDate, setFormattedDate] = useState(moment(value || new Date()).format('DD-MM-YYYY HH:mm'));
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    if (value) {
      setInternalDate(value);
      setFormattedDate(moment(value).format('DD-MM-YYYY HH:mm'));
    }
  }, [value]);

  const handleChange = (event, selectedDate) => {
    const currentDate = selectedDate || internalDate;
    setInternalDate(currentDate);
    setFormattedDate(moment(currentDate).format('DD-MM-YYYY HH:mm'));

    if (onChange) {
      onChange(event, currentDate);
    }

    if (Platform.OS === 'android') {
      setShowPicker(false);
      // Move from date to time picker automatically if mode is 'datetime'
      if (mode === 'datetime' && currentMode === 'date') {
        setTimeout(() => {
          setCurrentMode('time');
          setShowPicker(true);
        }, 300);
      }
    }
  };
  

  const showMode = (pickerMode) => {
    setCurrentMode(pickerMode);
    setShowPicker(true);
  };

  const showDatepicker = () => showMode('date');
  const showTimepicker = () => showMode('time');

  if (!visible) return null;

  return (
    <View style={[styles.container, style, flex && { flex }]}>
      <Pressable style={styles.dateTimeButton} onPress={showDatepicker}>
        <Text style={styles.selectedDate}>{formattedDate}</Text>
      </Pressable>

      {showPicker && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent
            animationType="slide"
            visible={showPicker}
            onRequestClose={() => setShowPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={internalDate}
                  mode={currentMode}
                  is24Hour={is24Hour}
                  display={display}
                  onChange={handleChange}
                  minimumDate={new Date()}
                  style={styles.picker}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowPicker(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.doneButton]} onPress={() => setShowPicker(false)}>
                    <Text style={[styles.buttonText, { color: '#fff' }]}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={internalDate}
            mode={currentMode}
            is24Hour={is24Hour}
            display={display}
            onChange={handleChange}
            minimumDate={new Date()}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  dateTimeButton: {
    padding: 12,
  },
  selectedDate: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#e0e0e0' },
  doneButton: { backgroundColor: '#f17022' },
  buttonText: { color: 'white', fontWeight: '600', textAlign: 'center' },
  picker: { width: '100%' },
});
