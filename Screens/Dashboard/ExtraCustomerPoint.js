import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Portal, Modal } from 'react-native-paper';
const { width } = Dimensions.get('window');
import { Divider } from 'react-native-paper';
import { postRequest } from '../../Services/RequestServices';
import DropDown from '../../Components/DropDown';
import MyStyles from '../../Styles/MyStyles';
const ExtraCustomerPoint = ({
  token,
  cusomerId,
  visible,
  onClose,
  onBack,
  totalPoints,
  name,
  mobile,
  data,
  redeemPoints,
  expiredPoints,
  staffList,
}) => {
  const [redeemingPoints, setRedeemingPoints] = useState('');
  const [staffName, setStaffName] = useState('');
  const [remark, setRemark] = useState('');

  const remainingChars = 200 - remark.length;

  const [visibleActivePoints, setVisibleActivePoints] = useState(false);
  const [visibleRedeemPoints, setVisibleRedeemPoints] = useState(false);
  const [visibleExpiredPoints, setVisibleExpiredPoints] = useState(false);

  const handleSubmit = () => {
    const payload = {
      customer_id: cusomerId,
      mobile: mobile,
      full_name: name,
      extra_point: redeemingPoints,
      remark: remark,
      staff_name: staffName,
    };
  
    const endpoint = 'customervisit/insert/extraPoint';
  
    postRequest(endpoint, payload, token)
      .then((response) => {
        alert("Add Extra Point Successfully");
      })
      .catch((error) => {
        console.error('Request failed:', error);
      });
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose} 
        contentContainerStyle={styles.modalContentContainer}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Extra Customer Point</Text>
          </View>
          
          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Customer Info */}
            <View style={styles.customerInfo}>
              <View style={styles.customerNameContainer}>
                <Text style={styles.customerName}>{name?.toUpperCase()}</Text>
              </View>
              <View style={styles.customerPhoneContainer}>
                <Text style={styles.customerPhone}>{mobile}</Text>
              </View>
              <View style={styles.pointsBox}>
                <Text style={styles.pointsText}>TOTAL POINTS: {totalPoints}</Text>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.formRow}>
                <View style={[styles.formCol, { marginRight: 12 }]}>
                  <Text style={styles.label}>Extra Points</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Extra Points"
                    value={redeemingPoints}
                    onChangeText={setRedeemingPoints}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.helperText}>Enter a value that is smaller or equal to {totalPoints}.</Text>
                </View>
                
                <View style={styles.formCol}>
                  <Text style={styles.label}>Staff Name</Text>
                  <DropDown
                    ext_lbl="name"
                    ext_val="staff_id"
                    data={staffList}
                    placeholder="Select Staff"
                    onChange={setStaffName}
                    style={[styles.dropdown, { marginBottom: 16 }]}
                  />
                </View>
              </View>

              {/* Remark Section */}
              <View style={styles.remarkSection}>
                <Text style={styles.label}>Remark</Text>
                <TextInput
                  style={styles.remarkInput}
                  placeholder="Type here..."
                  value={remark}
                  onChangeText={setRemark}
                  maxLength={200}
                  multiline
                  placeholderTextColor="#999"
                />
                <Text style={styles.charCount}>
                  <Text style={{ color: remainingChars === 0 ? 'red' : '#666', fontWeight: '500' }}>
                    {200 - remainingChars}
                  </Text>/200
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footer}>
            <View style={styles.actionRow}>
              <Button 
                mode="contained" 
                style={[styles.actionButton, styles.submit]} 
                labelStyle={styles.actionLabel} 
                onPress={handleSubmit}
              >
                ADD POINTS
              </Button>
              <Button 
                mode="contained" 
                style={[styles.actionButton, styles.back]} 
                labelStyle={styles.actionLabel} 
                onPress={onBack}
              >
                BACK
              </Button>
              <Button 
                mode="contained" 
                style={[styles.actionButton, styles.close]} 
                labelStyle={styles.actionLabel} 
                onPress={onClose}
              >
                CLOSE
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ExtraCustomerPoint;

const styles = StyleSheet.create({
  modalContentContainer: {
    backgroundColor: 'transparent',
    width: '80%',
    alignSelf: 'center',
    margin: 0,
    padding: 0,
    bottom: '5%',
    height: '100%',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  customerInfo: {
    backgroundColor: "#fdfdfd",
    elevation: 3,
    borderRadius: 10,
    padding: 8,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  customerPhoneContainer: {
    marginBottom: 12,
  },
  customerPhone: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  pointsBox: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'center',
  },
  pointsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formCol: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    color: '#212529',
    backgroundColor: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    height: 47,
    justifyContent: 'center',
    paddingBottom: 8,
  },
  remarkSection: {
    marginBottom: 16,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    color: '#212529',
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  actionButton: {
    borderRadius: 8,
    minWidth: 90,
    height: 35,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  submit: {
    backgroundColor: '#191b28',
  },
  back: {
    backgroundColor: '#22d1c3',
  },
  close: {
    backgroundColor: '#f64e60',
  },
  actionLabel: {
  },

  header: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  name: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#999',
    fontSize: 18,
  },
  mobile: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#999',
    fontSize: 16,
  },
  pointsBox: {
    backgroundColor: '#ffa500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  pointsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  charCount: {
    textAlign: 'right',
    color: 'blue',
    marginTop: 2,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  submit: {
    backgroundColor: '#1c1c2c',
  },
  back: {
    backgroundColor: '#1abc9c',
  },
  close: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
