import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import RedeemVoucher from './RedeemVoucher';
import { Modal, Portal } from 'react-native-paper';
import Points from './Points';
import ExtraCustomerPoint from './ExtraCustomerPoint';
import CustomModal from '../../Components/CustomModal';

const RedeemModal = ({ redeem, points, voucherList, visible, onClose, redeemPoints, expiredPoints,token ,staffList}) => {
    const [visibleVoucher, setVisibleVoucher] = React.useState(false);
    const [visiblePoints, setVisiblePoints] = React.useState(false);
    const [visibleExtra, setVisibleExtra] = React.useState(false);
   

    if (!visible) return null;
  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.container}>
          {/* Fixed Header */}
          <View style={styles.headerSection}>
            <Text style={styles.header}>Customer Redeem Point System</Text>
            <View style={styles.divider} />

            <View style={styles.pointsContainer}>
              <Button style={styles.badge} onPress={() => {setVisibleVoucher(true)}}>
                <Text style={styles.buttonText}>VOUCHERS : {redeem[0]?.voucher_count||0}</Text>
              </Button>
              <Button style={styles.badge} onPress={() => {setVisiblePoints(true)}}>
                <Text style={styles.buttonText}>POINTS : {points[0]?.total_points||0}</Text>
              </Button>
            </View>
          </View>


      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>PROFILE</Text>
        <View style={styles.divider} />
        <View style={styles.profileContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.label}>Date Of Birth</Text>
            <Text style={styles.label}>Date Of Anniversary</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>{voucherList[0]?.full_name}</Text>
            <Text style={styles.value}>{voucherList[0]?.dob}</Text>
            <Text style={styles.value}>{voucherList[0]?.doa}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Category Name</Text>
            <Text style={styles.label}>Total Visit</Text>
            <Text style={styles.label}>Last Visit</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>{voucherList[0]?.category_name}</Text>
            <Text style={styles.value}>{voucherList[0]?.visit_count}</Text>
            <Text style={styles.value}>{voucherList[0]?.last_visit}</Text>
          </View>
        </View>
      </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.scrollContent}>
            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>PROFILE</Text>
              <View style={styles.divider} />
              <View style={styles.profileContent}>
                <View style={styles.row}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.label}>Date Of Birth</Text>
                  <Text style={styles.label}>Date Of Anniversary</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.value}>{voucherList[0]?.full_name}</Text>
                  <Text style={styles.value}>{voucherList[0]?.dob}</Text>
                  <Text style={styles.value}>{voucherList[0]?.doa}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <Text style={styles.label}>Category Name</Text>
                  <Text style={styles.label}>Total Visit</Text>
                  <Text style={styles.label}>Last Visit</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.value}>{voucherList[0]?.category_name}</Text>
                  <Text style={styles.value}>{voucherList[0]?.visit_count}</Text>
                  <Text style={styles.value}>{voucherList[0]?.last_visit}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footer}>
            <View style={styles.bottomButtons}>
              <Button 
                mode="contained" 
                style={[styles.button, styles.extraButton]} 
                onPress={() => {setVisibleExtra(true)}}
              >
                <Text style={styles.buttonText}>EXTRA</Text>
              </Button>
              <Button
                mode="contained"
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>CLOSE</Text>
              </Button>
            </View>
          </View>
    </View>
  </Modal>
    <Points staffList={staffList} visible={visiblePoints} cusomerId={voucherList[0]?.customer_id} token={token} expiredPoints={expiredPoints} redeemPoints={redeemPoints} data={points} onClose={() => {setVisiblePoints(false); onClose()}} onBack={() => {setVisiblePoints(false)}} totalPoints={points[0]?.total_points} name={voucherList[0]?.full_name} mobile={voucherList[0]?.mobile} />
  <RedeemVoucher visible={visibleVoucher} totalPoints={points[0]?.total_points} redeem={redeem} customer={{name:voucherList[0]?.full_name,phone:voucherList[0]?.mobile,points:points[0]?.total_points}} onBack={() => {setVisibleVoucher(false)}} onClose={() => {setVisibleVoucher(false); onClose()}} />
    <ExtraCustomerPoint staffList={staffList} token={token} cusomerId={voucherList[0]?.customer_id} visible={visibleExtra} redeem={redeem} name={voucherList[0]?.full_name} mobile={voucherList[0]?.mobile} totalPoints={points[0]?.total_points} onClose={() => {setVisibleExtra(false); onClose()}} onBack={() => {setVisibleExtra(false)}}/>
</Portal>

  );
};

export default RedeemModal;

const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      width: '80%',
      maxWidth: 700,
      height: '90%',
      maxHeight: 350,
      alignSelf: 'center',
      borderRadius: 10,
      overflow: 'scroll',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
    },
    headerSection: {
      padding: 8,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'left',
      color: '#1a1a40',
      marginBottom: 12,
    },
    scrollContent: {
      flex: 1,
      padding: 8,
      paddingBottom: 80, // Space for the fixed footer
      overflow: 'scroll',
      margin: 8,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 8,
      paddingTop: 8,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
      zIndex: 10,
    },
    landscapeContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
      pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
      },
      bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
      },
      extraButton: {
        backgroundColor: '#1abc9c',
        minWidth: 100,
      },
      closeButton: {
        backgroundColor: '#e74c3c',
        minWidth: 100,
      },
    badge: {
      backgroundColor: "#3d66f2",
      borderRadius: 6,
      
      borderWidth: 1,
      borderColor: '#1e40af',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
      margin: 2,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 10,
      paddingHorizontal:8,
      paddingVertical: 6,
    },
    profileCard: {
      backgroundColor: "#535c65",
      borderRadius: 10,
      padding: 8,
      margin: 8,
      marginTop: 8,
      overflow: 'scroll',
    },
    profileTitle: {
      fontStyle: "italic",
      fontWeight: "600",
      color: "#d3d3d3",
      marginBottom: 4,
      marginLeft: 4,
      fontSize: 12,
      textTransform: 'uppercase',
    },
    profileContent: {
      backgroundColor: "#6c757d",
      padding: 8,
      borderColor: '#adb5bd',
      borderWidth: 2,
      margin: 4,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    label: {
      flex: 1,
      color: "#dee2e6",
      fontSize: 10,
      fontWeight: "500",
    },
    value: {
      flex: 1,
      color: "#fff",
      fontSize: 12,
      fontWeight: "700",
      textAlign: "left",
    },
    divider: {
      height: 1,
      backgroundColor: "#adb5bd",
      marginBottom: 4,
    },
    button: {
      borderRadius: 6,
      paddingHorizontal: 8,
      minWidth: 100,
    },
  });
  
