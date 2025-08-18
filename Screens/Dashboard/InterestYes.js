import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import DropDown from "../../Components/DropDown";
import CustomModal from "../../Components/CustomModal";
import MyStyles from "../../Styles/MyStyles"; // Custom style file
import { postRequest, uploadImage } from "../../Services/RequestServices";
import { serviceUrl, imageUrl } from "../../Services/Constants";
import { TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { Platform, Linking } from "react-native";
import {ActivityIndicator} from "react-native";

const InterestYes = ({
  modal,
  setModal,
  payloadData,
  setPayloadData,
  categoryImages,
  setCategoryImages,
  token,
  imageUrl,
  serviceUrl,
  setCategory,
  setUpload,
  setCheckIn,
  pickImage,
  handleUpload,
  index = 0,
  interest
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const isMounted = useRef(true);


  const handleImageUpload = async (image, itemIndex = index, categoryType) => {
    if (!image || !image.uri) {
      console.log('No valid image selected');
      return;
    }
  
    const currentIndex = typeof index === 'number' ? index : 0;
  
    try {
      setIsUploading(true);
  
      const imageType = image.mimeType || 'image/jpeg';
      const formData = new FormData();
      formData.append('files', {
        uri: image.uri,
        type: imageType,
        name: image.fileName || `image_${Date.now()}.jpg`
      });
  
      console.log('📤 Uploading image:', {
        payloadIndex: itemIndex,
        imageType,
        uri: image.uri,
        fileName: image.fileName || 'generated_name.jpg',
        size: image.fileSize ? `${Math.round(image.fileSize / 1024)}KB` : 'unknown'
      });
  
      const response = await uploadImage("customervisit/UploadCustomerImage", formData, token);
  
      const uploadedImageUrl = response?.data?.url || response?.url || image.uri;
      if (!uploadedImageUrl) throw new Error('No URL returned from server');
  
      const itemIndexToUse = typeof itemIndex === 'number' ? itemIndex : currentIndex;
      const currentItem = { ...payloadData[itemIndexToUse] } || {};
  
      let finalCategoryType = image._category || 
                              currentItem.product_category?.toLowerCase() || 
                              (currentItem.category_id === '2180' ? 'scooter' : 
                               currentItem.category_id === '2181' ? 'motorcycle' : 'bike');
  
      console.log('🎯 Determined category for upload:', finalCategoryType);
  
      // Ensure image_path exists
      currentItem.image_path = currentItem.image_path || {};
  
      // Conditionally initialize category array
      if (!currentItem.image_path[finalCategoryType]) {
        currentItem.image_path[finalCategoryType] = { urls: [], main: null, last_updated: null };
      }
  
      // Add image URL to the category-specific array
      currentItem.image_path[finalCategoryType].urls = [
        ...(currentItem.image_path[finalCategoryType].urls || []),
        uploadedImageUrl
      ];
  
      // Update choose/add based on categoryType
      if (categoryType === 'choose') {
        currentItem.image_path.choose = uploadedImageUrl;
      } else {
        currentItem.image_path.add = [
          ...(currentItem.image_path.add || []),
          uploadedImageUrl
        ];
      }
  
      currentItem.image_path[finalCategoryType].main = uploadedImageUrl;
      currentItem.image_path[finalCategoryType].last_updated = new Date().toISOString();
  
      // Update the payload data state
      setPayloadData(prev => {
        const updated = [...prev];
        updated[itemIndexToUse] = currentItem;
        console.log('🚀 Updated Payload Data:', updated[itemIndexToUse]);
        return updated;
      });
  
      // Optionally update categoryImages state
      setCategoryImages(prev => ({
        ...prev,
        [finalCategoryType]: [...(prev[finalCategoryType] || []), uploadedImageUrl]
      }));
  
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', error.message || 'Failed to upload image');
    } finally {
      if (isMounted.current) setIsUploading(false);
    }
  };
  

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <CustomModal
        visible={modal.uploadNext}
        contentContainerStyle={{ maxHeight: 600 }}
        content={
          <View style={{ height: "100%" }}>
            <ScrollView>
              <View style={[MyStyles.row, { justifyContent: "space-around", flexWrap: 'wrap' }]}>
  {(payloadData || []).map((payload, index) => (
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
          {payload.category_id === "2180"
            ? "SCOOTER"
            : payload.category_id === "2181"
            ? "MOTORCYCLE"
            : "BIKE"}
        </Text>
      </Text>

      {/* Choose Files Button */}
      <Button
        mode="contained"
        compact
        style={{ flex: 1, marginBottom: 10 }}
        buttonColor="#1abc9c"
        textColor="#fff"
        onPress={async () => {
          try {
            // Check permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
              Alert.alert(
                'Permission Required',
                'Please allow access to your files to upload documents.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Open Settings', 
                    onPress: () => {
                      if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                      } else {
                        Linking.openSettings();
                      }
                    }
                  }
                ]
              );
              return;
            }

            // Show action sheet for file source selection
            Alert.alert(
              'Select File Source',
              'Choose how to add a file',
              [
                {
                  text: 'Take Photo',
                  onPress: async () => {
                    try {
                      const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        allowsEditing: false,
                        aspect: [4, 3],
                        quality: 0.8,
                        base64: false,
                        exif: false
                      });

                      if (!result.canceled && result.assets?.[0]) {
                        // For camera capture, use handleImageUpload
                        await handleImageUpload(result.assets[0],index,"choose");
                      }
                    } catch (error) {
                      console.error('Error taking photo:', error);
                      Alert.alert('Error', 'Failed to take photo');
                    }
                  }
                },
                {
                  text: 'Choose from Files',
                  onPress: async () => {
                    try {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        quality: 0.8,
                        base64: false,
                        exif: false,
                        selectionLimit: 1
                      });

                      if (!result.canceled && result.assets?.[0]) {
                        // For camera capture, use handleImageUpload
                        await handleImageUpload(result.assets[0],index,"choose");
                      }
                    } catch (error) {
                      console.error('Error picking file:', error);
                      Alert.alert('Error', 'Failed to pick file');
                    }
                  }
                },
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ]
            );
          } catch (error) {
            console.error('Error in file selection:', error);
            Alert.alert('Error', 'Failed to select file');
          }
        }}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Choose Files'}
      </Button>

      {/* Main Image Preview */}
      <Image
        source={{
          uri: `${payloadData[index]?.image_path?.choose
            ? payloadData[index].image_path.choose
            : payloadData[index]?.image_path?.url}`
        }}
        style={{
          height: 130,
          width: "100%",
          marginVertical: 10,
          resizeMode: "stretch",
        }}
      />
      
      {/* Additional Images */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
      >
        {categoryImages[payloadData[index]?.category_id === '2180' ? 'scooter' : 
                       payloadData[index]?.category_id === '2181' ? 'motorcycle' : 'bike']
                       ?.filter(uri => uri !== payloadData[index]?.image_path?.choose) // Don't show the main image in the list
                       .map((uri, idx) => (
          <View
            key={idx}
            style={{
              marginRight: 10,
              borderRadius: 8,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#ccc",
              position: "relative",
            }}
          >
            <Image
              source={{ uri }}
              style={{
                height: 100,
                width: 100,
                resizeMode: "cover",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                const categoryType = payloadData[index]?.category_id === '2180' ? 'scooter' : 
                                  payloadData[index]?.category_id === '2181' ? 'motorcycle' : 'bike';
                setCategoryImages(prev => ({
                  ...prev,
                  [categoryType]: prev[categoryType].filter((_, i) => i !== idx)
                }));
              }}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 12,
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, lineHeight: 20 }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Images Button */}
      <View style={MyStyles.row}>
        <Button
          mode="contained"
          compact
          style={{ backgroundColor: "#1abc9c" }}
          onPress={async () => {
            try {
              // Check permissions first
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              
              if (status !== 'granted') {
                Alert.alert(
                  'Permission Required',
                  'Please allow access to your photos to upload images.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Open Settings', 
                      onPress: () => {
                        if (Platform.OS === 'ios') {
                          Linking.openURL('app-settings:');
                        } else {
                          Linking.openSettings();
                        }
                      }
                    }
                  ]
                );
                return;
              }

              // Show action sheet for image source selection
              Alert.alert(
                'Select Image Source',
                'Choose how to add an image',
                [
                  {
                    text: 'Take Photo',
                    onPress: async () => {
                      try {
                        const result = await ImagePicker.launchCameraAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          aspect: [4, 3],
                          quality: 0.8,
                          base64: false,
                          exif: false
                        });

                        if (!result.canceled && result.assets?.[0]) {
                          await handleImageUpload(result.assets[0],index,"add");
                        }
                      } catch (error) {
                        console.error('Error taking photo:', error);
                        Alert.alert('Error', 'Failed to take photo');
                      }
                    }
                  },
                  {
                    text: 'Choose from Gallery',
                    onPress: async () => {
                      try {
                        const result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          aspect: [4, 3],
                          quality: 0.8,
                          base64: false,
                          exif: false,
                          selectionLimit: 1
                        });

                        if (!result.canceled && result.assets?.[0]) {
                          await handleImageUpload(result.assets[0],index,"add");
                        }
                      } catch (error) {
                        console.error('Error picking image:', error);
                        Alert.alert('Error', 'Failed to pick image');
                      }
                    }
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ]
              );
            } catch (error) {
              console.error('Error in image selection:', error);
              Alert.alert('Error', 'Failed to select image');
            }
          }}
          color="#1abc9c"
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{color: "white"}}>ADD IMAGES</Text>
          )}
        </Button>
        <View style={{ marginLeft: 4, alignItems: "center", justifyContent: "center"}}>
          <Button
            icon={({ color, size }) => (
              <Icon name="upload" size={16} color="#fff"/>
            )}
            style={{
              backgroundColor: "#3699fe",
              width: 40,
              minWidth: 0,
              alignSelf: "center",
              paddingLeft: 10, 
              alignItems: "center",
              justifyContent: "center",
            }}
            contentStyle={{ alignItems: "center", justifyContent: "center" }}
            textColor="#fff"
            onPress={handleUpload}
          />
        </View>
      </View>


      {/* SKU Input */}
      <TextInput
        mode="outlined"
        label="SKU"
        style={{ marginBottom: 10, borderColor: '#ccc'}}
        value={payloadData[index]?.sku}
        onChangeText={(text) =>
          setPayloadData((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], sku: text };
            return updated;
          })
        }
      />
      
      {payloadData[index]?.image_path?.sku ?
      <Image
        source={{uri: `${imageUrl}Images/${payloadData[index]?.image_path?.sku}`}}
        style={{
          height: 130,
          width: "100%",
          marginVertical: 10,
          resizeMode: "contain",
        }}
      />:null}
      {/* Fetch Button */}
      <Button
        mode="contained"
        compact
        style={{ flex: 1, marginBottom: 10, width: "100%", backgroundColor: '#369aff', alignSelf: 'center' }}
        textColor="#fff"
        onPress={() => {
          if (!payloadData[index] || !payloadData[index].sku) {
            console.warn("SKU not available for this index");
            return;
          }
        
          const payload = {
            branch_id: "2057",
            sku: payloadData[index].sku,
          };
        
          postRequest("customervisit/SkuImage", payload, token)
            .then((response) => {
        
              // Check if image_path is valid
              if (response?.data?.image_path) {
                setPayloadData((prev) => {
                  const updated = [...prev];
                  updated[index] = {
                    ...updated[index],
                    image_path: {
                      ...updated[index]?.image_path,
                      sku: response.data.image_path,
                    },
                  };
                
                  return updated;
                }
              );
              } else {
                console.warn("Image path not found in response");
              }
            })
            .catch((error) => {
              console.error("Fetch error:", error);
            });
        }}
        
      >
        FETCH IMAGE
      </Button>

      {/* Sub Category Dropdown */}
      <DropDown
        data={
          payload.category_id === "2180"
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

      {/* Payment Input */}
      <TextInput
  mode="outlined"
  label="Payment"
  style={{ backgroundColor: "#fff", marginBottom: 10 }}
  value={payload.payment}
  keyboardType="numeric" // 👈 ensures numeric keyboard on mobile
  onChangeText={(text) => {
    const numericText = text.replace(/[^0-9]/g, ''); // 👈 strips non-numeric characters
    setPayloadData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], payment: numericText };
      return updated;
    });
  }}
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
                  setCategory({
                    scooter: false,
                    motorcycle: false,
                    bike: false,
                  });
                  const categoryType = payloadData[index]?.category_id === '2180' ? 'scooter' : 
                                     payloadData[index]?.category_id === '2181' ? 'motorcycle' : 'bike';
                  setCategoryImages(prev => ({
                    ...prev,
                    [categoryType]: []
                  }));
                }}
                style={MyStyles.button}
              >
                CANCEL
              </Button>
              <Button mode="contained" onPress={() => {
                setModal({ ...modal, upload: true, uploadNext: false, checkIn: false })
                ;
              }} compact style={{...MyStyles.button, backgroundColor: '#3699fe'}}>
                BACK
              </Button>
              <Button mode="contained"  style={{...MyStyles.button, backgroundColor: '#3699fe'}} compact 
              onPress={async () => {
                if (!Array.isArray(payloadData) || payloadData.length === 0) {
                  Alert.alert('Error', 'No data to upload.');
                  return;
                }
              
                try {
                  let allSuccessful = true;
              
                  for (let item of payloadData) {
                    const { image_path } = item;
              
                    // Collect all valid image URIs
                    const imageUris = [];
              
                    if (image_path?.choose) imageUris.push(image_path.choose);
                    if (Array.isArray(image_path?.add)) image_path.add.forEach(img => img && imageUris.push(img));
                    if (image_path?.fetchSku) imageUris.push(image_path.fetchSku);
                    if (image_path?.url) imageUris.push(image_path.url); // optional fallback
              
                    if (imageUris.length === 0) {
                      console.warn("No image URIs for item:", item);
                      continue;
                    }
              
                    for (let image of imageUris) {
                      const payload = {
                        tran_id: 0,
                        customer_id: item?.customer_id || 0,
                        mobile: item?.mobile || '',
                        full_name: item?.full_name || '',
                        remarks: item?.remarks || '',
                        sku: item?.sku || '',
                        image_path: image, // pass individual image URI
                        appointment_date: item?.appointment_date || '',
                        payment: item?.payment || '',
                        sub_category: item?.sub_category || '',
                        interest: item?.interest || 'Yes',
                        staff_id: item?.staff_id || '1069',
                        category_id: item?.category_id || '2180',
                      };
              
                      const resp = await postRequest(
                        'customervisit/insertCustomerUpload',
                        payload,
                        token
                      );
              
                      if (!(resp?.status === 200 && resp?.data && resp?.data[0]?.valid)) {
                        allSuccessful = false;
                        console.error("Upload failed for:", payload);
                      }
                    }
                  }
              
                  if (allSuccessful) {
                    Alert.alert('Success', 'All uploads successful!');
                    setModal({ ...modal, upload: false, uploadNext: false, checkIn: false });
                    setCheckIn(false);
                    setUpload(null);
                    setPayloadData([]);
                    setCategory({
                      scooter: false,
                      motorcycle: false,
                      bike: false,
                    });
                  const categoryType = payloadData[index]?.category_id === '2180' ? 'scooter' : 
                                     payloadData[index]?.category_id === '2181' ? 'motorcycle' : 'bike';
                  setCategoryImages(prev => ({
                    ...prev,
                    [categoryType]: []
                  }));

              
                  } else {
                    Alert.alert('Partial Success', 'Some uploads failed. Please check logs.');
                  }
                } catch (e) {
                  console.error("Upload error:", e);
                  Alert.alert('Error', 'Network or server error.');
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
export default InterestYes;