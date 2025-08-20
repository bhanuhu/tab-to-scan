import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import DropDown from "../../Components/DropDown";
import CustomModal from "../../Components/CustomModal";
import MyStyles from "../../Styles/MyStyles"; // Custom style file
import { postRequest, uploadImage } from "../../Services/RequestServices";
import { serviceUrl, imageUrl } from "../../Services/Constants";


const InterestRequirement = ({
  modal,
  setModal,
  payloadData,
  setPayloadData,
  image,
  setImage,
  token,
  imageUrl,
  serviceUrl,
  setCategory,
  setUpload,
  setCheckIn,
  pickImage,
  handleUpload,
  subCategories,
  setSelectedCategories,
  selectedCategories,
}) => {
  return (
    <CustomModal
        visible={modal.uploadNext}
        content={
          <View style={{ height: "100%" }}>
            <ScrollView>
              <View style={[MyStyles.row, { justifyContent: "space-around", flexWrap: 'wrap' }]}>
  {payloadData.map((payload, index) => (
    <View key={index} style={{ flex: 0.30, marginBottom: 20, overflowX: "hidden"}}>
      <Text
        style={{
          backgroundColor: "#eee",
          textAlign: "center",
          paddingVertical: 6,
          fontWeight: "bold",
          color: "#999",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          marginBottom: 6,
        }}
      >
        Category{'\n'}
        <Text style={{ fontSize: 18, color: "#333" }}>
          {payload.category_name}
        </Text>
      </Text>

      {/* Sub Category Dropdown */}
      <DropDown
        data={
          subCategories[payload.category_id] || []
        }
        placeholder="Sub Category"
        value={payload.sub_category}
        onChange={(text) =>
          setPayloadData((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], sub_category: text };
            return updated;
          })
        }
        style={MyStyles.dropdown}
      />

      {/* Remarks Input */}
      <TextInput
        mode="outlined"
        label="Remarks"
        style={{ backgroundColor: "#fff", marginBottom: 10 }}
        value={payload.remarks}
        onChangeText={(text) =>
          setPayloadData((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], remarks: text };
            return updated;
          })
        }
      />

    
    </View>
  ))}
</View>


            </ScrollView>

            {/* Bottom Buttons */}
            <View
              style={[
                MyStyles.row,
                {
                  justifyContent: "space-between",
                  marginTop: 10,
                  gap: 8,
                  padding: 10,
                },
              ]}
            >
              <Button
                mode="contained"
                color="#DC143C"
                uppercase={false}
                compact
                onPress={() => {
                  setModal({ ...modal, upload: false, uploadNext: false, checkIn: false });
                  setUpload(null);
                  setCheckIn(false);
                  setPayloadData([]);
                  setSelectedCategories({});
                  setImage([]);
                }}
                style={MyStyles.button}
              >
                CANCEL
              </Button>
              <Button mode="contained" onPress={() => {
                setModal({ ...modal, upload: true, uploadNext: false, checkIn: false });
              }} color="#007BFF" compact style={MyStyles.button}>
                BACK
              </Button>
              <Button mode="contained" color="#007BFF" style={MyStyles.button} compact 
              onPress={async () => {
                if (!Array.isArray(payloadData) || payloadData.length === 0) {
                  Alert.alert('Error', 'No data to upload.');
                  return;
                }
              
                let allSuccessful = true;
              
                try {
                  for (let item of payloadData) {
                    const payload = {
                      tran_id: 0,
                      customer_id: item?.customer_id || 0,
                      mobile: item?.mobile || '',
                      full_name: item?.full_name || '',
                      remarks: item?.remarks || '',
                      sku: '', // You can set item?.sku here if needed
                      image_path: '', // Set appropriate image if available
                      appointment_date: '', // Fill if available
                      payment: '', // Fill if needed
                      sub_category: item?.sub_category || '',
                      interest: item?.interest || 'Requirement',
                      staff_id: item?.staff_id || '1069',
                      category_id: item?.category_id || '2180',
                    };
              
                    const resp = await postRequest('customervisit/insertCustomerUpload', payload, token);
              
                    if (!(resp?.status === 200 && resp?.data && resp?.data[0]?.valid)) {
                      allSuccessful = false;
                      console.error("Upload failed for:", payload);
                    }
                  }
              
                  if (allSuccessful) {
                    Alert.alert('Success', 'All uploads successful!');
                    setModal({ ...modal, upload: false, uploadNext: false, checkIn: false });
                    setCheckIn(false);
                    setUpload(null);
                    setPayloadData([]);
                    setSelectedCategories({});
                    setImage([]);
                  } else {
                    Alert.alert('Partial Success', 'Some uploads failed. Please check logs.');
                  }
              
                } catch (error) {
                  console.error("Upload error:", error);
                  Alert.alert('Error', 'Network or server error.');
                  setSelectedCategories({});
                  setPayloadData([]);
                  setImage([]);
                }
              }}
              
              
              >
                CONTINUE
              </Button>
            </View>
          </View>
        }
      />
  )}
export default InterestRequirement;
