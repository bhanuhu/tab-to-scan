import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
const { width } = Dimensions.get('window');

// Sample record structure (not enforced in JS)
const CustomerPointsModal = ({ visible, data, onClose }) => {

  const [searchText, setSearchText] = useState('');
  /**
 * Converts a datetime string to a date string in 'yyyy-MM-dd' format using date-fns.
 * @param dateTime - An ISO 8601 datetime string (e.g., "2025-08-04T15:30:00Z")
 * @returns A formatted date string (e.g., "2025-08-04")
 */
  function formatToDate(dateTime) {
    try {
      const parsedDate = parseISO(dateTime);
      return format(parsedDate, 'dd-MM-yyyy');
    } catch (error) {
      console.error('Invalid date format:', dateTime);
      return '';
    }
  }

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const lower = searchText.toLowerCase();

    return data?.filter((item) => {
      const formattedDateTime = item?.date_time
        ? format(new Date(item.date_time), "dd-MM-yyyy")
        : "";

      const formattedExpireDate = item?.expire_date
        ? format(new Date(item.expire_date), "dd-MM-yyyy")
        : "";

      return (
        item?.mobile?.toLowerCase().includes(lower) ||
        item?.type?.toLowerCase().includes(lower) ||
        item?.remark?.toLowerCase().includes(lower) ||
        item?.staff_name?.toLowerCase().includes(lower) ||
        item?.points?.toString().includes(lower) ||
        formattedDateTime.toLowerCase().includes(lower) ||
        formattedExpireDate.toLowerCase().includes(lower)
      );
    });
  }, [searchText, data]);
  // Table rendering is now inline in the return block below.

  return (
    <Portal>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalContentContainer}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.title}>Customer Expired Point</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Field */}
            <TextInput
              placeholder="Search by mobile, type, or remark..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />

            {/* Table */}
            <View style={styles.tableWrapper}>
              {/* Table Header */}
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.headerCell]}>Mobile</Text>
                <Text style={[styles.cell, styles.headerCell]}>Type</Text>
                <Text style={[styles.cell, styles.headerCell]}>Remark</Text>
                <Text style={[styles.cell, styles.headerCell]}>Staff Name</Text>
                <Text style={[styles.cell, styles.headerCell]}>Points</Text>
                <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                <Text style={[styles.cell, styles.headerCell]}>Expired Date</Text>
              </View>
              
              {/* Table Data - scrollable */}
              <ScrollView style={styles.tableBodyScroll}>
                {Array.isArray(filteredData) && filteredData.length > 0 ? (
                  filteredData.map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.row,
                        idx % 2 === 0 ? styles.rowEven : styles.rowOdd,
                      ]}
                    >
                      <Text style={styles.cell}>{item.mobile}</Text>
                      <Text style={styles.cell}>{item.type}</Text>
                      <Text style={styles.cell}>{item.remark}</Text>
                      <Text style={styles.cell}>{item.staff_name}</Text>
                      <Text style={styles.cell}>{item.points}</Text>
                      <Text style={[styles.cell, styles.dateCell]}>{formatToDate(item.date_time)}</Text>
                      <Text style={[styles.cell, styles.expiredCell]}>{formatToDate(item.expire_date)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noData}>No records found.</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default CustomerPointsModal;

const styles = StyleSheet.create({
  modalContentContainer: {
    backgroundColor: 'transparent',
    width: '80%',
    alignSelf: 'center',
    margin: 0,
    padding: 0,
    height: '95%',
    maxHeight: 600,
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
  searchInput: {
    height: 40,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    margin: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
  },
  modalHeader: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#22223b',
  },
  closeBtn: {
    padding: 8,
  },
  close: {
    fontSize: 24,
    color: '#aaa',
  },
  tableWrapper: {
    flex: 1,
    margin: 8,
    borderWidth: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  tableBodyScroll: {
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    width: '100%',
  },
  headerRow: {
    backgroundColor: '#f8faff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#222',
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#2196f3',
    fontSize: 17,
    textAlign: 'left',
    backgroundColor: '#f8faff',
  },
  rowEven: {
    backgroundColor: '#fff',
  },
  rowOdd: {
    backgroundColor: '#f4f5f7',
  },
  dateCell: {
    color: 'green',
    fontWeight: '500',
    textAlign: 'left',
  },
  expiredCell: {
    color: 'red',
    fontWeight: '500',
    textAlign: 'left',
  },
  noData: {
    padding: 18,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
