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
import FollowUpDateTimePicker from "../../Components/DateTimePicker";
import {FlatList} from "react-native";
const InterestYes = ({
  modal,
  setModal,
  payloadData,
  setPayloadData,
  categoryImages,
  branchId,
  token,
  imageUrl,
  setUpload,
  setCheckIn,
  pickImage,
  handleUpload,
  index = 0,
  interest,
  selectedCategories,
  subCategories,
  setSelectedCategories
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [localImages, setLocalImages] = React.useState({}); // Store local image URIs
  const isMounted = useRef(true);
  const [date, setDate] = useState(new Date());

  const handleChooseImage = async (image, itemIndex = index) => {
    console.log('handleChooseImage called with:', { image, itemIndex });
    
    if (!image || !image.uri) {
      console.log('No valid image selected');
      return;
    }
    
    const currentIndex = typeof index === 'number' ? index : 0;
    const itemIndexToUse = typeof itemIndex === 'number' ? itemIndex : currentIndex;
    
    console.log('Using index:', { currentIndex, itemIndexToUse });
    
    // Store local image URI immediately
    setLocalImages(prev => ({
      ...prev,
      [itemIndexToUse]: image.uri
    }));
    
    // Create a safe copy of the current payload
    const updatedPayload = [...payloadData];
    
    // Ensure the item exists at the index
    if (!updatedPayload[itemIndexToUse]) {
      console.error('Invalid item index:', itemIndexToUse);
      return;
    }
    
    // Get the image key
    const imageKey = `category_${updatedPayload[itemIndexToUse].category_id}_img`;
    
    // Update the payload with the new image
    updatedPayload[itemIndexToUse] = {
      ...updatedPayload[itemIndexToUse],
      image_path: {
        ...(updatedPayload[itemIndexToUse].image_path || {}),
        localUri: image.uri,
        isUploading: true,
        uploadError: false,
        lastUpdated: Date.now()
      }
    };
    
    setPayloadData(updatedPayload);
    
    // Prepare form data for upload
    let response;
    try {
      console.log('Preparing form data...');
      const formData = new FormData();
      const filename = image.uri.split('/').pop();
      const fileType = filename.split('.').pop();
      const categoryId = updatedPayload[itemIndexToUse]?.category_id;
      const fileName = `category-${categoryId}-${Date.now()}.${fileType || 'jpg'}`;
      
      console.log('Creating file object...');
      const file = {
        uri: image.uri,
        type: `image/${fileType || 'jpeg'}`,
        name: fileName
      };
      
      console.log('Appending to form data...');
      formData.append('images', file);
      
      console.log('Starting upload with:', {
        url: 'upload',
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          uri: file.uri.substring(0, 50) + '...' // Log partial URI to avoid logging full base64
        },
        categoryId,
        itemIndexToUse
      });
      
      // Upload the image
      console.log('Calling uploadImage...');
      response = await uploadImage("upload", formData, token);
      console.log('Upload response received:', response);
      
      if (!response || !response.fileNames || !Array.isArray(response.fileNames) || response.fileNames.length === 0) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response from server: ' + JSON.stringify(response));
      }
      
      console.log('Upload successful, file names:', response.fileNames);
      
      // Update with server URL
      const serverUrl = response.fileNames[0];
      setPayloadData(prevPayload => {
        const newPayload = [...prevPayload];
        if (newPayload[itemIndexToUse]) {
          newPayload[itemIndexToUse] = {
            ...newPayload[itemIndexToUse],
            image_path: {
              ...(newPayload[itemIndexToUse].image_path || {}),
              url: serverUrl,
              [imageKey]: serverUrl, // Update the unique key with server URL
              isUploading: false,
              uploadError: false,
              lastUpdated: Date.now() // Update timestamp
            }
          };
        }
        return newPayload;
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // On error, ensure we keep the local image
      setPayloadData(prevPayload => {
        const newPayload = [...prevPayload];
        if (newPayload[itemIndexToUse]) {
          const imageKey = `category_${newPayload[itemIndexToUse].category_id}_img`;
          newPayload[itemIndexToUse] = {
            ...newPayload[itemIndexToUse],
            image_path: {
              ...(newPayload[itemIndexToUse].image_path || {}),
              localUri: image.uri, // Keep local URI on error
              isUploading: false,
              uploadError: true
            }
          };
        }
        return newPayload;
      });
      
      Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
    } finally {
      if (isMounted.current) setIsUploading(false);
    }
  };


  const handleImageUpload = async (image, itemIndex = index, categoryType) => {
    if (!image || !image.uri) {
      console.log('No valid image selected');
      return;
    }
    
    const currentIndex = typeof index === 'number' ? index : 0;
    const itemIndexToUse = typeof itemIndex === 'number' ? itemIndex : currentIndex;
    const updatedPayload = [...payloadData];
    
    try {
      setIsUploading(true);
      
      // Check if this is a retry by looking for an existing entry with the same localUri
      const existingImageIndex = updatedPayload[itemIndexToUse].image_path?.add?.findIndex(
        img => img.localUri === image.uri
      );

      if (existingImageIndex >= 0) {
        // Update existing entry for retry
        updatedPayload[itemIndexToUse].image_path.add[existingImageIndex] = {
          ...updatedPayload[itemIndexToUse].image_path.add[existingImageIndex],
          isUploading: true,
          uploadError: false
        };
      } else {
        // Add new entry for first-time upload
        updatedPayload[itemIndexToUse] = {
          ...updatedPayload[itemIndexToUse],
          image_path: {
            ...updatedPayload[itemIndexToUse].image_path,
            add: [
              ...(updatedPayload[itemIndexToUse].image_path?.add || []),
              { localUri: image.uri, isUploading: true, uploadError: false }
            ]
          }
        };
      }
      setPayloadData([...updatedPayload]);
      
      // Then upload the image to the server
      const formData = new FormData();
      formData.append('images', {
        uri: image.uri,
        type: image.mimeType || 'image/jpeg',
        name: `image-${Date.now()}.jpg`
      });
      
      const response = await uploadImage("upload", formData, token);
      console.log("Upload response:", response);
      if (!response || !response.fileNames || !Array.isArray(response.fileNames) || response.fileNames.length === 0) {
        throw new Error('Invalid response from server');
      }
      
      // Update the payload with the server URL
      const serverUrl = response.fileNames[0];
      const updatedPayloadWithServerUrl = [...payloadData];
      const imageIndex = updatedPayloadWithServerUrl[itemIndexToUse].image_path.add.findIndex(
        img => img.localUri === image.uri
      );
      
      if (imageIndex !== -1) {
        updatedPayloadWithServerUrl[itemIndexToUse].image_path.add[imageIndex] = {
          ...updatedPayloadWithServerUrl[itemIndexToUse].image_path.add[imageIndex],
          serverUrl: serverUrl,
          isUploading: false
        };
        setPayloadData(updatedPayloadWithServerUrl);
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      // Update the UI to show upload failed
      const errorPayload = [...payloadData];
      const errorIndex = errorPayload[itemIndexToUse].image_path.add.findIndex(
        img => img.localUri === image.uri
      );
      
      if (errorIndex !== -1) {
        errorPayload[itemIndexToUse].image_path.add[errorIndex] = {
          ...errorPayload[itemIndexToUse].image_path.add[errorIndex],
          uploadError: true,
          isUploading: false
        };
        setPayloadData(errorPayload);
      }
      
      Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
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
              <View style={{ width: '100%' }}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  <View style={[MyStyles.row, { flexWrap: 'nowrap', paddingHorizontal: 10 }]}>
                    {(payloadData || []).map((payload, index) => (
                      <View key={index} style={{ width: 175, marginRight: 15, marginBottom: 20 }}>
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

      {/* Choose Files Button */}
      <Button
        mode="contained"
        compact
        style={{ flex: 1, marginBottom: 10 ,maxHeight: 40, height: 40}}
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
                        await handleChooseImage(result.assets[0], index);
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
                        await handleChooseImage(result.assets[0], index);
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
        {(() => {
          const categoryId = payloadData[index]?.category_id;
          const imageKey = categoryId ? `category_${categoryId}_img` : null;
          // Check for local image first, then fallback to server URL
          const imagePath = payloadData[index]?.image_path || {};
          const imageUri = imagePath.localUri || 
                         (imageKey && imagePath[imageKey]) || 
                         imagePath.url;
          
          if (!imageUri) {
            return (
              <View style={{
                height: 130,
                width: "100%",
                marginVertical: 10,
                backgroundColor: '#f5f5f5',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text>No image selected</Text>
              </View>
            );
          }
          
          const sourceUri = imageUri.startsWith('http') || imageUri.startsWith('file://')
            ? imageUri
            : `${imageUrl}${imageUri}`;
            
          return (
            <Image
              source={{ uri: sourceUri }}
              style={{
                height: 130,
                width: "100%",
                marginVertical: 10,
                resizeMode: "contain",
                backgroundColor: '#f5f5f5'
              }}
              key={`${imageKey}_${payloadData[index]?.image_path?.lastUpdated || ''}`}
              onError={(e) => {
                console.log('Image load error:', e.nativeEvent.error);
                // Fallback to choose if url fails
                if (payloadData[index]?.image_path?.choose) {
                  const updatedPayload = [...payloadData];
                  updatedPayload[index].image_path[imageKey] = updatedPayload[index].image_path.choose;
                  setPayloadData(updatedPayload);
                }
              }}
            />
          );
        })()}
      
      {/* Additional Images */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          overflow="scroll"

          contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 0 }}
          >
        {Array.isArray(payloadData[index]?.image_path?.add) && payloadData[index].image_path.add.map((imageData, idx) => {
          if (!imageData) return null;
          
          // Handle both old and new image data formats
          const imageUri = imageData.uri || 
                          imageData.localUri || 
                          (typeof imageData === 'string' ? 
                            (imageData.startsWith('http') || imageData.startsWith('file://') ? 
                              imageData : `${imageUrl}${imageData}`) 
                          : null);
          
          if (!imageUri) return null;
          
          const imageSource = { uri: imageUri };
          
          return (
            <View
              key={`${index}-${idx}`}
              style={{
                marginRight: 10,
                borderRadius: 8,
                overflow: "scroll",
                borderWidth: 1,
                borderColor: "#ccc",
                position: "relative",
              }}
            >
              {imageSource.uri && !imageData.uploadError ? (
              <Image
                  source={imageSource}
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: "cover",
                }}
                onError={(e) => {
                    console.log('Error loading image:', e.nativeEvent.error, 'Source:', imageSource.uri);
                  // Update the source to null to trigger the fallback UI
                  const updatedPayload = [...payloadData];
                  updatedPayload[index].image_path.add[idx] = null;
                  setPayloadData(updatedPayload);
                }}
              />
            ) : (
              <View style={{
                height: 100,
                width: 100,
                backgroundColor: imageData.uploadError ? '#ffebee' : '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: imageData.uploadError ? '#f44336' : '#ddd',
                borderRadius: 4,
                position: 'relative'
              }}>
                {imageData.isUploading ? (
                  <ActivityIndicator color="#1abc9c" />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ 
                      color: imageData.uploadError ? '#f44336' : '#999', 
                      textAlign: 'center',
                      padding: 5
                    }}>
                      {imageData.uploadError ? 'Upload Failed' : 'Loading...'}
                    </Text>
                    {imageData.uploadError && (
                      <Button
                        mode="contained"
                        compact
                        onPress={() => handleImageUpload({ uri: imageData.localUri }, index, 'add', idx)}
                        style={{
                          backgroundColor: '#1abc9c',
                          marginTop: 5,
                          paddingHorizontal: 8,
                          height: 24
                        }}
                        labelStyle={{ fontSize: 10 }}
                      >
                        Retry
                      </Button>
                    )}
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                // Remove image from payloadData.image_path.add
                const updatedPayload = [...payloadData];
                updatedPayload[index].image_path.add = updatedPayload[index].image_path.add.filter((_, i) => i !== idx);
                setPayloadData(updatedPayload);
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
        )})}
        </ScrollView>
      {/* Add Images Button */}
      <View style={MyStyles.row}>
        <Button
          mode="contained"
          compact
          style={{ backgroundColor: "#1abc9c" }}
          onPress={async () => {
            try {
              // Show action sheet for image source selection
              Alert.alert(
                'Select Image Source',
                'Choose how to add an image',
                [
                  {
                    text: 'Take Photo',
                    onPress: async () => {
                      try {
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                          Alert.alert('Permission Required', 'Please allow camera access to take photos');
                          return;
                        }
                        
                        const result = await ImagePicker.launchCameraAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: false,
                          aspect: [4, 3],
                          quality: 0.8,
                        });

                        if (!result.canceled && result.assets?.[0]) {
                          // Add to local state without uploading
                          const updatedPayload = [...payloadData];
                          updatedPayload[index] = {
                            ...updatedPayload[index],
                            image_path: {
                              ...updatedPayload[index].image_path,
                              add: [
                                ...(updatedPayload[index].image_path?.add || []),
                                { localUri: result.assets[0].uri, isUploading: false }
                              ]
                            }
                          };
                          setPayloadData(updatedPayload);
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
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                          Alert.alert('Permission Required', 'Please allow access to your photos to select images');
                          return;
                        }
                        
                        const result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: false,
                          quality: 0.8,
                        });

                        if (!result.canceled && result.assets?.[0]) {
                          // Add to local state without uploading
                          const updatedPayload = [...payloadData];
                          updatedPayload[index] = {
                            ...updatedPayload[index],
                            image_path: {
                              ...updatedPayload[index].image_path,
                              add: [
                                ...(updatedPayload[index].image_path?.add || []),
                                { localUri: result.assets[0].uri, isUploading: false }
                              ]
                            }
                          };
                          setPayloadData(updatedPayload);
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
              console.error('Error in image picker:', error);
              Alert.alert('Error', 'Failed to open image picker');
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
            disabled={isUploading || !payloadData[index]?.image_path?.add?.length}
            onPress={async () => {
              try {
                // Upload all selected images
                const imagesToUpload = payloadData[index]?.image_path?.add || [];
                
                for (const image of imagesToUpload) {
                  if (image.localUri && !image.serverUrl) {
                    await handleImageUpload(
                      { uri: image.localUri },
                      index,
                      "add"
                    );
                  }
                }
                
                Alert.alert('Success', 'All images uploaded successfully');
              } catch (error) {
                console.error('Error uploading images:', error);
                Alert.alert('Upload Error', 'Failed to upload one or more images');
              }
            }}
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
        style={{ maxHeight:40,height:40,flex: 1, marginBottom: 10, width: "100%", backgroundColor: '#369aff', alignSelf: 'center' }}
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
  data={subCategories[payload.category_id] || []}
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
  keyboardType="numeric" // 
  onChangeText={(text) => {
    const numericText = text.replace(/[^0-9]/g, ''); // 
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
                console.log('🚀 Payload Data:------------>>>>>', payloadData);
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
                            branch_id: branchId,
                            mobile: item?.mobile || '',
                            full_name: item?.full_name || '',
                            remarks: item?.remarks || '',
                            sku: item?.sku || '',
                        image_path: image.serverUrl  || image || '', // Prefer serverUrl, fallback to localUri
                            appointment_date: item?.appointment_date || '',
                        payment: item?.payment || '',
                        sub_category: item?.sub_category || '',
                        interest: item?.interest || 'Yes',
                        staff_id: item?.staff_id || '1069',
                        category_id: item?.category_id || '2180',
                        category_name: item?.category_name || '',
                        color:"",
                        payment_mode:"",
                      };
                      console.log('🚀 Payload:------------>>>>>', payload);
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
                    setSelectedCategories({});
                  const categoryType = payloadData[index]?.category_id === '2180' ? 'scooter' : 
                                     payloadData[index]?.category_id === '2181' ? 'motorcycle' : 'bike';
                 

              
                  } else {
                    Alert.alert('Partial Success', 'Some uploads failed. Please check logs.');
                    setSelectedCategories({});
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