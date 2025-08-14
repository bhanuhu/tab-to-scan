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

      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{
          backgroundColor: "rgba(255,255,255,0.85)",
          width: "70%",
          maxHeight: "90%",
          minHeight: "90%",
          marginLeft: "auto",
          marginBottom: "auto",
          marginRight: "auto",
          borderRadius: 2,
        }}>
        <View style={styles.customerInfo}>
          <View style={styles.customerNameContainer}>
          <Text style={styles.customerName}>{customer.name}</Text>
          </View>
          <View style={styles.customerPhoneContainer}>
          <Text style={styles.customerPhone}>{customer.phone}</Text>
          </View>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsText}>TOTAL POINT: {totalPoints}</Text>
          </View>
        </View>

        <DataTable style={{ borderBottomWidth: 0 }}>
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

        </DataTable>

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
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
    minHeight: "60%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  customerInfo: {
    backgroundColor: "#fdfdfd",
    width: "95%",
    marginLeft: 18,
    elevation: 5,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    marginTop: 15,
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
  customerPhone: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#888",
  
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
    marginTop: 16,
  },
});

export default CustomerRedeemModal;

