import React, { useState } from "react";
import { View, ScrollView, Image, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import DropDown from "../../Components/DropDown";
import CustomModal from "../../Components/CustomModal";
import { postRequest, uploadImage } from "../../Services/RequestServices";
import MyStyles from "../../Styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';

const UploadModal = ({ modal, setModal, token, upload, setUpload, category, setCheckIn }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  return (
    <CustomModal
      visible={modal.upload}
      content={
        <View style={{ height: "100%" }}>
          <ScrollView>
            <View style={[MyStyles.row, { justifyContent: "space-around" }]}>
              {["scooter", "motorcycle", "bike"].map((catkey) =>
                category[catkey] ? (
                  <View key={catkey} style={{ flex: 0.3 }}>
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
                        {catkey.toUpperCase()}
                      </Text>
                    </Text>

                    {/* Image Picker Button */}
                    <Button
                      mode="contained"
                      compact
                      style={{ marginBottom: 10 }}
                      buttonColor="#1abc9c"
                      textColor="#fff"
                      onPress={async () => {
                        try {
                          const images = await ImagePicker.openPicker({
                            multiple: true,
                            width: 300,
                            height: 400,
                            cropping: true,
                            compressImageQuality: 0.2,
                            includeBase64: true,
                          });
                          
                          if (images && images.length > 0) {
                            const formattedImages = images.map(img => ({
                              uri: img.path,
                              width: img.width,
                              height: img.height,
                              mime: img.mime
                            }));
                            setSelectedImages(formattedImages);
                          }
                      } catch (error) {
                        console.log('ImagePicker Error: ', error);
                        if (error.code !== 'E_PICKER_CANCELLED') {
                          Alert.alert('Error', 'Failed to pick images');
                        }
                      }
                    }}
                  >
                    Add Images
                  </Button>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                      {selectedImages.map((img, index) => (
                        <Image
                          key={index}
                          source={{ uri: img.uri }}
                          style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
                        />
                      ))}
                    </ScrollView>

                    <Button
                      mode="contained"
                      compact
                      style={{ marginBottom: 10 }}
                      buttonColor="#3498db"
                      textColor="#fff"
                      onPress={async () => {
                        if (!selectedImages || selectedImages.length === 0) {
                          console.warn("No images selected");
                          return;
                        }

                        const formData = new FormData();

                        selectedImages.forEach((image, index) => {
                          formData.append("images", {
                            uri: image.uri,
                            name: `photo_${index}.jpg`,
                            type: "image/jpeg",
                          });
                        });

                        try {
                          const response = await uploadImage("/upload", formData, token);
                          console.log("Upload success:", response);
                        } catch (err) {
                          console.warn("Upload failed:", err);
                        }
                      }}
                    >
                      Submit
                    </Button>

                    <TextInput
                      mode="outlined"
                      label="SKU"
                      style={{ backgroundColor: "#fff", marginBottom: 10 }}
                      onChangeText={(text) => setUpload({ ...upload, sku: text })}
                    />

                    <Button
                      mode="contained"
                      compact
                      style={{ marginBottom: 10 }}
                      buttonColor="#007BFF"
                      onPress={async () => {
                        try {
                          const payload = {
                            branch_id: upload.branch_id,
                            sku: upload.sku,
                          };

                          const response = await postRequest("customervisit/SkuImage", payload, token);
                          if (response?.status === 200 && response?.valid === false) {
                            alert("No Image Found");
                          } else {
                            console.warn("❌ Failed to fetch image:", response?.message || "Unknown error");
                          }
                        } catch (error) {
                          console.error("🚨 Error fetching image:", error);
                        }
                      }}
                    >
                      FETCH IMAGE
                    </Button>

                    <DropDown
                      data={
                        catkey === "scooter"
                          ? [
                              { label: "JUPITER", value: "JUPITER" },
                              { label: "PEP", value: "PEP" },
                            ]
                          : [
                              { label: "APACHE", value: "APACHE" },
                              { label: "SPORTS", value: "SPORTS" },
                            ]
                      }
                      placeholder="Sub Category"
                      style={MyStyles.dropdown}
                      onChangeText={(text) => setUpload({ ...upload, subCategory: text })}
                    />

                    <TextInput
                      mode="outlined"
                      label="Remarks"
                      style={{ backgroundColor: "#fff", marginTop: 10 }}
                      onChangeText={(text) => setUpload({ ...upload, remarks: text })}
                    />

                    <TextInput
                      mode="outlined"
                      label="Payment"
                      style={{ backgroundColor: "#fff", marginTop: 10 }}
                      onChangeText={(text) => setUpload({ ...upload, payment: text })}
                    />
                  </View>
                ) : null
              )}
            </View>
          </ScrollView>

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
              }}
              style={MyStyles.button}
            >
              CANCEL
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setModal({ ...modal, upload: true, uploadNext: false, checkIn: false });
              }}
              color="#007BFF"
              compact
              style={MyStyles.button}
            >
              BACK
            </Button>
            <Button
              mode="contained"
              color="#007BFF"
              style={MyStyles.button}
              compact
              onPress={async () => {
                const payload = {
                  tran_id: 0,
                  customer_id: upload?.customer_id || 0,
                  mobile: upload?.mobile || "",
                  full_name: upload?.full_name || "",
                  remarks: upload?.remarks || "",
                  sku: upload?.sku || "",
                  image_path: !upload?.image_path
                    ? category.scooter
                      ? "image-3c8744d8-9bd3-493a-bfb4-8c72cd086b18.png"
                      : "image-4301b3d1-b65e-483d-a1c2-470f005e9a7c.jpg"
                    : upload?.image_path,
                  appointment_date: upload?.appointment_date || "",
                  payment: upload?.payment || "",
                  sub_category: upload?.sub_category || "",
                  interest: upload?.interest || "Yes",
                  staff_id: upload?.staff_id || "1069",
                  category_id: upload?.category_id || "2180",
                };
                try {
                  const resp = await postRequest("customervisit/insertCustomerUpload", payload, token);
                  if (resp?.status === 200 && resp?.data?.[0]?.valid) {
                    Alert.alert("Success", "Upload successful!");
                    setModal({ ...modal, upload: false, uploadNext: false, checkIn: false });
                    setCheckIn(false);
                    setUpload(null);
                  } else {
                    Alert.alert("Error", resp.error || "Upload failed.");
                  }
                } catch (e) {
                  Alert.alert("Error", "Network or server error.");
                }
              }}
            >
              CONTINUE
            </Button>
          </View>
        </View>
      }
    />
  );
};

export default UploadModal;
