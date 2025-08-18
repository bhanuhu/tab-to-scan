import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function FollowUpDateTimePicker({
  value = new Date(),
  onChange,
  mode = 'datetime',
  is24Hour = false,
  display = 'default',
  style,
  flex,
}) {
  const [show, setShow] = useState(false);
  const [currentMode, setCurrentMode] = useState('date');
  const [internalDate, setInternalDate] = useState(value);

  useEffect(() => {
    setInternalDate(value);
  }, [value]);

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (selectedDate) {
      const newDate = selectedDate || internalDate;
      setInternalDate(newDate);

      if (currentMode === 'date' && mode === 'datetime') {
        // After date is selected, show time picker on Android
        setCurrentMode('time');
        if (Platform.OS === 'ios') return;
        setTimeout(() => setShow(true), 100);
      } else {
        // When time is selected or in single mode, update the parent
        if (onChange) {
          onChange(newDate);
        }
        setCurrentMode('date'); // Reset for next time
      }
    } else {
      setCurrentMode('date'); // Reset if cancelled
    }
  };

  const showPicker = () => {
    setCurrentMode('date');
    setShow(true);
  };

  const handleDone = () => {
    setShow(false);
    if (onChange) {
      onChange(internalDate);
    }
  };

  return (
    <View style={[styles.container, style, { flex }]}>
      <TouchableOpacity onPress={showPicker} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {moment(internalDate).format('DD/MM/YYYY hh:mm A')}
        </Text>
      </TouchableOpacity>

      {show && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent
            animationType="slide"
            visible={show}
            onRequestClose={() => setShow(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={internalDate}
                  mode={mode}
                  is24Hour={is24Hour}
                  display={display}
                  onChange={handleChange}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => setShow(false)}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.doneButton]} 
                    onPress={handleDone}
                  >
                    <Text style={{color: '#fff'}}>Done</Text>
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
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#f17022',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  dateText: {
    color: '#333',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
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
    marginLeft: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  doneButton: {
    backgroundColor: '#f17022',
  },
});
