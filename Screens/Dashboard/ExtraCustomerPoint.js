import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Portal } from 'react-native-paper';
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
    <>
      <Portal>
        <Modal 
          visible={visible} 
          transparent 
          animationType="fade"
        >
          <View style={styles.overlay}>
            <View style={[styles.modalContainer, { 
              width: '80%', 
              height: '80%',
              margin: 'auto',
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              marginTop: "3%",
              elevation: 5,
            }]}>
              {/* Scrollable Content */}
              <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <View style={styles.heading}>
                    <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10 }}>Extra Customer Point</Text>
                  </View>
                  <Divider />
                  
                  {/* Profile Card */}
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

                  {/* Redeem Form Section */}
                  <View style={styles.formRow}>
                    {/* Left Column */}
                    <View style={[styles.formCol, { marginRight: 12 }]}>
                      <Text style={styles.label}>Extra Points</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Extra Points"
                        value={redeemPoints}
                        onChangeText={setRedeemingPoints}
                        keyboardType="numeric"
                        maxLength={6}
                        placeholderTextColor="#999"
                      />
                      <Text style={styles.helperText}>Enter a value that is smaller or equal to {totalPoints}.</Text>
                    </View>
                    {/* Right Column */}
                    <View style={styles.formCol}>
                      <Text style={styles.label}>Staff Name</Text>
                      <DropDown
                        ext_lbl="name"
                        ext_val="staff_id"
                        data={staffList}
                        placeholder="Select Staff"
                        onChange={setStaffName}
                        style={[MyStyles.dropdown, {maxHeight: 47, justifyContent: 'center', marginBottom: 30, borderColor: '#ced4da', borderWidth: 1}]} 

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
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.charCount}>
                      <Text style={{ color: remainingChars === 0 ? 'blue' : '#222', fontWeight: 'bold' }}>{200 - remainingChars}</Text>/200
                    </Text>
                  </View>
                  <Divider />
                </ScrollView>
              </View>

              {/* Fixed Bottom Action Buttons */}
              <View style={styles.fixedBottom}>
                <View style={styles.actionRow}>
                  <Button mode="contained" style={[styles.actionButton, styles.submit]} labelStyle={styles.actionLabel} onPress={handleSubmit}>
                    <Text style={{ fontSize: 12 }}>ADD POINTS</Text>
                  </Button>
                  <Button mode="contained" style={[styles.actionButton, styles.back]} labelStyle={styles.actionLabel} onPress={onBack}>
                    <Text style={{ fontSize: 12 }}>BACK</Text>
                  </Button>
                  <Button mode="contained" style={[styles.actionButton, styles.close]} labelStyle={styles.actionLabel} onPress={onClose}>
                    <Text style={{ fontSize: 12 }}>CLOSE</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default ExtraCustomerPoint;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
  },
  fixedBottom: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 10,
    elevation: 0,
    backgroundColor: '#e4e6ef',
    height: 38,
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#3699fe',
  },
  redeemButton: {
    backgroundColor: '#f64e60',
  },
  expireButton: {
    backgroundColor: '#f64e60',
  },
  tabButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  customerInfo: {
    backgroundColor: "#fdfdfd",
    elevation: 3,
    borderRadius: 10,
    padding: 5,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customerName: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#888",

    marginLeft: 8,
  },
  // customerNameContainer: {
  //   textAlign: "center",
  // },
  customerPhone: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#888",
    // textAlign: "center",
  },
  pointsBox: {
    backgroundColor: "#ffa500",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  profileMobile: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#b0b0b0',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  profilePointsBadge: {
    backgroundColor: '#ffba3c',
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginLeft: 16,
  },
  profilePointsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  formCol: {
    flex: 1,
    minWidth: 120,
    flexShrink: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    color: '#222',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 4,
    backgroundColor: '#fafbfc',
    color: '#222',
  },
  helperText: {
    fontSize: 13,
    color: '#b0b0b0',
    marginBottom: 8,
    marginLeft: 2,
  },
  remarkSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fafbfc',
    color: '#222',
    minHeight: 10,
    maxHeight: 100,
    marginBottom: 2,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: 'blue',
    fontWeight: '500',
    marginTop: 2,
    marginLeft: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
    flexWrap: 'wrap',
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
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
