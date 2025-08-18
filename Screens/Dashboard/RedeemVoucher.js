import React from "react";
import { View, Alert, FlatList, StyleSheet, Text } from "react-native";
import { Modal, Portal, DataTable, Button } from "react-native-paper";
import moment from "moment";

const CustomerRedeemModal = ({
  visible,
  onBack,
  redeem,
  customer,
  onClose,
  totalPoints,
}) => {
  const filteredRedeem = Array.isArray(redeem)
  ? redeem.filter(item => item)
  : [];
  


  return (
    <Portal>

      <Modal 
        visible={visible} 
        onDismiss={onClose} 
        contentContainerStyle={styles.modalContainer}
      >
         <View style={styles.customerInfo}>
          <View style={styles.customerNameContainer}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerPhone}>{customer.phone}</Text>
          </View>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsText}>TOTAL POINT: {totalPoints}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.dataTableContainer}>
          <DataTable.Header>
            {["Voucher", "Details", "Offer", "Issue Date", "Expiry Date", "Action"].map((col) => (
              <DataTable.Title key={col} style={styles.cellHeader}>
                <Text style={styles.headerText}>{col}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {filteredRedeem.length > 0 ? (
            <FlatList
              data={filteredRedeem}
              renderItem={({ item }) => (
                <DataTable.Row style={{ borderBottomWidth: 1, borderColor: '#e0e0e0' }}>
                  <DataTable.Cell style={styles.cell}>{item.voucher_name}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.details}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.amount}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    {moment(item.redeem_start_date).format("DD/MM/YYYY")}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Text style={{ color: item.IsvoucherExpire === "true" ? "red" : "green" }}>
                      {moment(item.redeem_end_date).format("DD/MM/YYYY")}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Button mode="contained" compact color="#ffba3c" onPress={() => {}}>
                      Redeem
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No vouchers available</Text>
            </View>
          )}

          </View>
        </View>

        <View style={styles.footer}>
        <Button
            mode="contained"
            color="#DC143C"
            onPress={onBack}
            compact
            style={{ marginRight: 8 }}
          >
            Back
          </Button>
          <Button
            mode="contained"
            color="#DC143C"
            onPress={onClose}
            compact
            style={{ marginRight: 8 }}
          >
            Close
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    width: '80%',
    maxWidth: 1000,
    height: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    maxHeight: 600,
    overflow: 'hidden',
    padding: 0,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  customerInfo: {
    backgroundColor: "#f8f9fa",
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
    marginVertical:8
  },
  customerNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 0.6,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
  },
  pointsBox: {
    backgroundColor: "#ffa500",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  pointsText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cellHeader: {
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    padding: 4,
  },
  headerText: {
    color: "#0818A8",
    fontWeight: "bold",
    fontSize: 12,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
    paddingBottom: 60, // Space for footer
  },
  dataTableContainer: {
    flex: 1,
  },
});

export default CustomerRedeemModal;

