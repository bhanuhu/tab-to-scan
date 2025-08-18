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
import ActivePoints from './ActivePoints';
import RedeemPoints from './RedeemPoints';
import ExpirePoints from './ExpirePoints';  
const { width } = Dimensions.get('window');
import { postRequest } from '../../Services/RequestServices';
import DropDown from '../../Components/DropDown';
import MyStyles from '../../Styles/MyStyles';

const Points = ({
  visible,
  onClose,
  onBack,
  totalPoints,
  name,
  mobile,
  data,
  redeemPoints,
  expiredPoints,
  cusomerId,
  token,
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
        full_name: name,
        mobile: mobile,
        redeemPoint: redeemingPoints,
        remark: remark,
        staff_name: staffName,
      };
    
      const endpoint = 'customervisit/insertPointRedeem02';
    
      postRequest(endpoint, payload, token)
        .then((response) => {
          // handle success UI here
          alert("Add Extra Point Successfully");
        })
        .catch((error) => {
          console.error('Request failed:', error);
          // handle error UI here
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
          {/* Header with Tabs */}
          <View style={styles.header}>
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                style={[styles.tabButton, styles.activeButton]}
                labelStyle={styles.tabButtonLabel}
                onPress={() => setVisibleActivePoints(true)}
              >
                <Text style={{ fontSize: 12 }}>Active Points</Text>
              </Button>
              <Button
                mode="contained"
                style={[styles.tabButton, styles.redeemButton]}
                labelStyle={[styles.tabButtonLabel, { color: '#222' }]}
                onPress={() => setVisibleRedeemPoints(true)}
              >
                <Text style={{ fontSize: 12 }}>Redeem Points</Text>
              </Button>
              <Button
                mode="contained"
                style={[styles.tabButton, styles.expireButton]}
                labelStyle={styles.tabButtonLabel}
                onPress={() => setVisibleExpiredPoints(true)}
              >
                <Text style={{ fontSize: 12 }}>Expired Points</Text>
              </Button>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >

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
<View style={{ overflow: 'scroll' }}>
              {/* Redeem Form Section */}
              <View style={styles.formRow}>
                {/* Left Column */}
                <View style={[styles.formCol, { marginRight: 12 }]}>
                  <Text style={styles.label}>Redeem Points</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Redeem Points"
                    value={redeemingPoints}
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
                  <View style={styles.formCol}>
                    <DropDown
                      ext_lbl="name"
                      ext_val="staff_id"
                      data={staffList}
                      placeholder="Select Staff"
                      onChange={setStaffName}
                      value={staffName}
                      style={[MyStyles.dropdown, {maxHeight: 47, justifyContent: 'center', marginBottom: 30, borderColor: '#ced4da', borderWidth: 1}]} 
                      // placeholderStyle={{
                      //   color: '#999',
                      //   fontSize: 15,
                      //   padding: 0,
                      //   margin: 0,
                      // }}
                    />
                  </View>
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
</View>
              {/* Action Buttons Row */}
              {/* <View style={styles.actionRow}>
                <Button mode="contained" style={[styles.actionButton, styles.submit]} labelStyle={styles.actionLabel} onPress={handleSubmit}>
                  <Text style={{ fontSize: 12 }}>SUBMIT</Text>
                </Button>
                <Button mode="contained" style={[styles.actionButton, styles.back]} labelStyle={styles.actionLabel} onPress={onBack}>
                  <Text style={{ fontSize: 12 }}>BACK</Text>
                </Button>
                <Button mode="contained" style={[styles.actionButton, styles.close]} labelStyle={styles.actionLabel} onPress={onClose}>
                  <Text style={{ fontSize: 12 }}>CLOSE</Text>
                </Button>
              </View> */}
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.footer}>
              <Button
                mode="contained"
                style={[styles.actionButton, styles.submit]}
                labelStyle={styles.actionLabel}
                onPress={handleSubmit}
                disabled={!redeemingPoints || !staffName}
              >
                <Text style={{ fontSize: 12 }}>SUBMIT</Text>
              </Button>
              <Button 
                mode="contained" 
                style={[styles.actionButton, styles.back]} 
                labelStyle={styles.actionLabel} 
                onPress={onBack}
              >
                <Text style={{ fontSize: 12 }}>BACK</Text>
              </Button>
              <Button 
                mode="contained" 
                style={[styles.actionButton, styles.close]} 
                labelStyle={styles.actionLabel} 
                onPress={onClose}
              >
                <Text style={{ fontSize: 12 }}>CLOSE</Text>
              </Button>
            </View>
          </View>
      <RedeemPoints 
        visible={visibleRedeemPoints} 
        onClose={() => setVisibleRedeemPoints(false)} 
        data={redeemPoints} 
      />
      <ExpirePoints 
        visible={visibleExpiredPoints} 
        onClose={() => setVisibleExpiredPoints(false)} 
        data={expiredPoints} 
      />
      <ActivePoints 
        visible={visibleActivePoints} 
        onClose={() => setVisibleActivePoints(false)} 
        data={data} 
      />
    </Modal>
    </Portal>
  );
};

export default Points;

const styles = StyleSheet.create({
  modalContentContainer: {
    backgroundColor: 'transparent',
    width: '80%',
    alignSelf: 'center',
    margin: 0,
    padding: 0,
    height: '100%',
    maxHeight: 400,
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
  header: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 8,
    paddingBottom: 0,
    flexGrow: 1,
    minHeight: '80%',
  },
  footer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    width: '100%',
    position: 'relative',
    bottom: 0,
  },
  // Removed duplicate modalContainer style
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 450,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 10,
    elevation: 0,
    backgroundColor: '#e4e6ef',
    height: 35,
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#3699fe',
  },
  redeemButton: {
    backgroundColor: '#e4e6ef',
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
    padding: 8,
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
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 4,
    backgroundColor: '#fafbfc',
    color: '#ced4da',
  },
  helperText: {
    fontSize: 13,
    color: '#b0b0b0',
    marginBottom: 8,
    marginLeft: 2,
  },
  remarkSection: {
    marginTop: 8,
    marginBottom: 2,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
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
    marginTop: 2,
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: 8,
    minWidth: 90,
    marginHorizontal: 2,
    marginBottom: 2,
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
    padding: 8,
    borderRadius: 10,
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
    borderColor: '#d6d6d6',
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
    marginTop: 8,
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
