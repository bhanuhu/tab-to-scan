import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { 
  Pressable, 
  Alert, 
  Platform, 
  Linking, 
  ImageBackground, 
  View, 
  ScrollView, 
  FlatList, 
  Image 
} from "react-native";
import {
  Button,
  Card,
  IconButton,
  TextInput,
  Text,
  DataTable,
  Modal,
  Surface,
  Portal,
  List,
  Divider,
} from "react-native-paper";
import Swiper from "react-native-swiper";
import HTML from "react-native-render-html";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Animatable from "react-native-animatable";
import CustomModal from "../../Components/CustomModal";
import DropDown from "../../Components/DropDown";
import Header from "../../Components/Header";
import ImageUpload from "../../Components/ImageUpload";
import { postRequest, uploadImage } from "../../Services/RequestServices";
import MyStyles from "../../Styles/MyStyles";
import DatePicker from "../../Components/DatePicker";
import RedeemModal from "./RedeemModal";
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';

import UploadModal from "./UploadModal";
import { serviceUrl, imageUrl } from "../../Services/Constants";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InterestYes from "./InterestYes";
import InterestFollowUp from "./InterestFollowUp";
import InterestRequirement from "./InterestRequirement";


const Dashboard = (props) => {
  const { branchId, branchName, logoPath, token } = props.loginDetails;
  const imageRef = useRef(null);
  // const [category, setCategory] = useState({
  const [selectedCategories, setSelectedCategories] = useState({});
  const [payloadData, setPayloadData] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const fetchCategoryImages = async (categoryId) => {
    try {
      const response = await postRequest('masters/product/category/web-browse/', { category_id: categoryId }, token);
      console.log("Category images response:", response);
      if (response?.Data && Array.isArray(response.Data)) {
        const categoryImage = response.Data.find(item => 
          item.category_id.toString() === categoryId.toString()
        );
        
        if (categoryImage) {
          const imageUrl = categoryImage.image_path 
            ? `${categoryImage.url_image}${categoryImage.image_path}`
            : null;
            
          // Update category images state
          setCategoryImages(prev => ({
            ...prev,
            [categoryId]: imageUrl ? [{
              uri: imageUrl,
              id: categoryImage.category_id,
              bannerUrl: categoryImage.banner_path 
                ? `${categoryImage.url_banner}${categoryImage.banner_path}`
                : null
            }] : []
          }));
          
          // Update payload data with the category image URL
          setPayloadData(prev => {
            return prev.map(item => {
              if (item.category_id === categoryId) {
                return {
                  ...item,
                  image_path: {
                    ...item.image_path,
                    url: imageUrl || ''
                  }
                };
              }
              return item;
            });
          });
        }
      }
    } catch (error) {
      console.error('Error fetching category images:', error);
    }
  };

  const toggleCategory = async (categoryId, categoryName) => {
    const isSelected = !selectedCategories[categoryId];
    
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: isSelected
    }));
    
    // Set selected category for subcategory fetching
    if (isSelected) {
      setSelectedCategoryId(categoryId);
      
      // Fetch subcategories if not already loaded
      if (!subCategories[categoryId]) {
        try {
          const [subCatResponse] = await Promise.all([
            postRequest('masters/category/all_sub_category', { category_id: categoryId }, token),
            fetchCategoryImages(categoryId) // Fetch images in parallel
          ]);
          
          console.log("Subcategories response:", subCatResponse);
          if (subCatResponse?.status === 200 && subCatResponse?.data) {
            console.log("Subcategories:", subCatResponse.data);
            setSubCategories(prev => ({
              ...prev,
              [categoryId]: subCatResponse.data
                .filter(item => item.category_id.toString() === categoryId.toString())
                .map(item => ({
                  label: item.subcategory_name,
                  value: item.subcategory_id.toString()
                }))
            }));
          }
        } catch (error) {
          console.error('Error in category data fetch:', error);
        }
      } else {
        // If subcategories are already loaded, just fetch images
        fetchCategoryImages(categoryId);
      }
    }
    
    // Initialize images array for this category if it doesn't exist
    if (isSelected && !categoryImages[categoryId]) {
      setCategoryImages(prev => ({
        ...prev,
        [categoryId]: []
      }));
    }
    
    setPayloadData(prev => {
      const updated = [...prev];
  
      if (isSelected) {
        // Add a new payload for the selected category
        const newPayload = {
          tran_id: 0,
          customer_id: upload?.customer_id || 0,
          full_name: upload?.full_name || '',
          remarks: upload?.remarks || '',
          sku: upload?.sku || '',
          image_path: {"choose":"", "add":[], "fetchSku":"", "url":""},
          appointment_date: upload?.appointment_date || '',
          payment: upload?.payment || '',
          sub_category: upload?.sub_category || '',
          interest: upload?.interest || 'Yes',
          staff_id: upload?.staff_id || '1069',
          category_id: categoryId,
          category_name: categoryName
        };
  
        return [...updated, newPayload];
      } else {
        // Remove payloads for this category
        return updated.filter(item => item.category_id !== categoryId);
      }
    });
  };
  useEffect(() => {
    console.log("Updated payloadData:", payloadData);
  }, [payloadData]);

  useEffect(() => {
    console.log("Updated interest:", interest);
  }, [interest]);
  
  
  
  const options = [
    { label: 'YES', value: 'yes' },
    { label: 'FOLLOW UP', value: 'followup' },
    { label: 'REQUIREMENT', value: 'requirement' },
  ];
  const [selectedImages, setSelectedImages] = useState([]);
  const [interest, setInterest] = useState('yes');
  const [details, setDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [tabs, setTabs] = useState(1);
  const [design, setDesign] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [exhibition, setExhibition] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [redeem, setRedeem] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [voucherList, setVoucherList] = useState(null);
  const [upload, setUpload] = useState(null);
  const [points, setPoints] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(null);
  const [expiredPoints, setExpiredPoints] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  
    const [image, setImage] = useState([]);
  
  const takePhoto = async () => {
    try {
      console.log("1. Starting camera...");
      
      // First, check if we have camera permissions
      console.log("2. Checking camera permissions...");
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please allow camera access to take photos.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings", 
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
        return null;
      }

      console.log("3. Launching camera...");
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
        exif: false
      }) || {};

      console.log("4. Camera result:", JSON.stringify(result, null, 2));

      if (!result || result.canceled) {
        console.log("5. User cancelled camera");
        return null;
      }

      const asset = (result.assets && result.assets[0]) || result;
      if (!asset || !asset.uri) {
        console.log("6. No valid photo taken");
        return null;
      }

      const photo = {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize
      };

      console.log("7. Photo taken:", photo);
      return photo;

    } catch (error) {
      console.error('Error in takePhoto:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      Alert.alert(
        "Error",
        `Failed to take photo: ${error.message || 'Unknown error'}`,
        [{ text: "OK" }]
      );
      return null;
    }
  };

  const pickImage = async () => {
    try {
      console.log("1. Starting image picker...");
      
      // First, check if we have permissions
      console.log("2. Checking permissions...");
      const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync() || {};
      const status = permissionResult?.status;
      
      if (status !== 'granted') {
        console.log("3. No permissions, requesting...");
        const newPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync() || {};
        const newStatus = newPermissionResult?.status;
        
        if (newStatus !== 'granted') {
          console.log("4. Permission denied");
          Alert.alert(
            "Permission Required",
            "Please allow access to your photos to upload images.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Open Settings", 
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
          return null;
        }
      }

      console.log("5. Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
        exif: false,
        selectionLimit: 1
      }) || {};

      console.log("6. Image picker result:", JSON.stringify(result, null, 2));

      if (!result || result.canceled) {
        console.log("7. User cancelled image picker or result is null");
        return null;
      }

      const asset = (result.assets && result.assets[0]) || result;
      if (!asset || !asset.uri) {
        console.log("8. No valid asset found");
        return null;
      }

      const selectedImage = {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || (asset.uri ? asset.uri.split('/').pop() : 'photo.jpg') || 'photo.jpg',
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize
      };

      console.log("9. Selected image:", selectedImage);
      return selectedImage;

    } catch (error) {
      console.error('Error in pickImage:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Try one more time with simpler options
      try {
        console.log("10. Retrying with simpler options...");
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

        if (!result || result.canceled) {
          console.log("11. User cancelled on retry or result is null");
          return null;
        }

        const asset = (result.assets && result.assets[0]) || result;
        if (!asset || !asset.uri) return null;

        return {
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || (asset.uri ? asset.uri.split('/').pop() : 'photo.jpg') || 'photo.jpg'
        };
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        Alert.alert(
          "Error",
          `Failed to pick image: ${error.message || 'Unknown error'}`,
          [{ text: "OK" }]
        );
        return null;
      }
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const photo = await takePhoto();
            if (photo) {
              handleImageSelected(photo);
            }
          }
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const image = await pickImage();
            if (image) {
              handleImageSelected(image);
            }
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const handleImageSelected = (selectedImage) => {
    if (!selectedImage || !selectedImage.uri) {
      console.log("No valid image selected");
      return;
    }
    
    // If you want to support multiple images
    setImage(prevImages => [...prevImages, selectedImage]);
    
    // If you want to upload immediately
    // handleUpload(selectedImage);
  };

  const handleUpload = async (selectedImage = null) => {
    try {
      console.log("Starting upload process...");
      let image = selectedImage;
      
      if (!image) {
        // If no image provided, show picker options
        showImagePickerOptions();
        return;
      }

      console.log("Preparing upload for image:", image);
      
      if (!image.uri) {
        console.error("No image URI found");
        Alert.alert("Error", "No image selected");
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || `photo_${Date.now()}.jpg`,
      });

      // Add any additional data
      if (customerId) formData.append('customerId', customerId);
      if (branchId) formData.append('branchId', branchId);

      console.log("Uploading image...");
      const response = await uploadImage("/your-upload-endpoint", formData, token);
      console.log("Upload response:", response);
      
      if (response?.success) {
        setImage(prevImages => [...prevImages, image]);
        Alert.alert("Success", "Image uploaded successfully!");
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      Alert.alert(
        "Upload Failed",
        error.message || "Failed to upload image. Please try again."
      );
    }
  };

  const subCategoryData = selectedCategoryId ? (subCategories[selectedCategoryId] || []) : [];
 

  const [join, setJoin] = useState({
    customer_id: "0",
    branch_id: branchId,

    full_name: "",
    mobile: "",
    gender: "",
    dob: "",
    doa: "",
    address: "",

    ref_id: "",
    category_id: "",
    staff_id: "",
    area_id: "",
    profession: "",

    step1: true,
  });
  const [modal, setModal] = useState({
    mobile: "",
    details: false,
    history: false,
    design: false,
    redeem: false,
    join: false,
    checkIn: false,
    upload: false,
    uploadNext: false,
    notification: false,
    area: false,
  });
  const [staffList, setStaffList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [areaList, setAreaList] = useState([]);
  const [recentVistors, setRecentVistors] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [imageUri, setImageUri] = useState(
    "https://api.quicktagg.com/tabBanner/image-d7e532c1-6f79-4f06-ae1d-9afd4567940f.jpg"
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    imageSwitch();
    postRequest("masters/customer/tabtoscanBannerBrowse", {}, token).then((res) => {
      if (!res || typeof res !== 'object' || res.status === undefined) {
        console.error("Invalid API response for tabtoscanBannerBrowse", res);
        // Optionally: setBannerImages([]); setImageUri(null);
        return;
      }
      if (res.status == 200) {
        const data = res.data.map((item) => item.url + item.image_path);
        setBannerImages(data);
        setImageUri(data[0]);
      }
    }).catch((err) => {
      console.error("API error (tabtoscanBannerBrowse):", err);
    });
    postRequest("customervisit/StaffList", {}, token).then((resp) => {
      if (!resp || typeof resp !== 'object' || resp.status === undefined) {
        console.error("Invalid API response for StaffList", resp);
        return;
      }
      if (resp.status == 200) {
        console.log("StaffList", resp.data);
        setStaffList(resp.data);
      }
    }).catch((err) => {
      console.error("API error (StaffList):", err);
    });
    postRequest("masters/product/category/web-browse/", {}, token).then((resp) => {
      if (!resp || !Array.isArray(resp.Data)) {
        console.error("Invalid API response for CategoryList", resp);
        return;
      }
      // Transform the response to match the expected format
      const categories = resp.Data.map(item => ({
        category_id: item.category_id,
        category_name: item.category_name,
        image_path: item.image_path,
        url_image: item.url_image,
        banner_path: item.banner_path,
        url_banner: item.url_banner
      }));
      
      console.log("CategoryList", categories);
      setCategoryList(categories);
      
      // Preload images for all categories
      categories.forEach(category => {
        if (category.image_path && category.url_image) {
          const imageUrl = `${category.url_image}${category.image_path}`;
          setCategoryImages(prev => ({
            ...prev,
            [category.category_id]: [{
              uri: imageUrl,
              id: category.category_id,
              bannerUrl: category.banner_path && category.url_banner 
                ? `${category.url_banner}${category.banner_path}`
                : null
            }]
          }));
        }
      });
    }).catch((err) => {
      console.error("API error (CategoryList):", err);
    });
    postRequest("customervisit/AreaList", {}, token).then((resp) => {
      if (!resp || typeof resp !== 'object' || resp.status === undefined) {
        console.error("Invalid API response for AreaList", resp);
        return;
      }
      if (resp.status == 200) {
        setAreaList(resp.data);
      }
    }).catch((err) => {
      console.error("API error (AreaList):", err);
    });
  }, []);

  const imageSwitch = () => {
    var index = bannerImages.indexOf(imageUri);
    if (index >= bannerImages.length - 1) {
      index = -1;
    }
    setImageUri(bannerImages[index + 1]);
    if (imageRef) {
      imageRef?.current?.animate({ 0: { opacity: 0 }, 1: { opacity: 1 } });
    }
  };

  // --UseEffect For Image Trigger--

  useEffect(() => {
    const ticket = setTimeout(imageSwitch, 20000);
    return () => {
      clearTimeout(ticket);
    };
  }, [imageUri]);

  useEffect(() => {
    console.log("Modal", modal);
  }, [modal]);
  
  // --UseEffect For Recent Visits--

  useEffect(() => {
    postRequest("customervisit/getRecentvisiters", {}, token).then((resp) => {
      if (!resp || typeof resp !== 'object' || resp.status === undefined) {
        console.error("Invalid API response for getRecentvisiters", resp);
        return;
      }
      if (resp.status == 200) {
        setRecentVistors(resp.data);
      }
    }).catch((err) => {
      console.error("API error (getRecentvisiters):", err);
    });
  }, [details, redeem, checkIn, upload, join]);

  return (
    // <ImageBackground
    //   source={{
    //     uri: imageUri,
    //   }}
    //   style={{ flex: 1, backgroundColor: "#000" }}
    //   imageStyle={{ opacity: 1 }}
    // >
    <View style={[MyStyles.container, { backgroundColor: "#000" }]}>
      {imageUri && (
        <Animatable.Image
          source={{
            uri: imageUri,
          }}
          style={{
            height: "100%",
            width: "100%",
            zIndex: -10,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          ref={imageRef}
          duration={26000}
        />
      )}
      <Header
        logoPath={logoPath}
        right={
          <IconButton
            icon="bell"
            color={MyStyles.primaryColor.backgroundColor}
            size={23}
            onPress={() => {
              postRequest("customervisit/getNotification", {}, token).then((resp) => {
                if (resp.status == 200) {
                  setNotifications(resp.data);
                  setModal({ ...modal, notification: true });
                }
              });
            }}
          />
        }
      />

      <View style={{ flex: 1, paddingBottom: 15 }}>
        <View style={[MyStyles.row, { marginTop: "auto", marginBottom: 0 }]}>
          <View style={{ width: "10%", minWidth: 80 }}>
            <Card
              style={[
                MyStyles.primaryColor,
                {
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  marginVertical: 5,
                },
              ]}
            >
              <ImageBackground
                style={{}}
                imageStyle={{
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                source={require("../../assets/pattern.jpg")}
              >
                {/* <Card.Title title="E-Store" /> */}
                <View style={{ padding: 5 }}>
                  <Text style={{ fontSize: 15 }}>E-Store</Text>
                </View>
              </ImageBackground>
            </Card>
            <Card
              style={[
                MyStyles.primaryColor,
                {
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  marginVertical: 5,
                },
              ]}
              onPress={() => setModal({ ...modal, upload: true })}
            >
              <ImageBackground
                style={{}}
                imageStyle={{
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                source={require("../../assets/pattern.jpg")}
              >
                {/* <Card.Title title="Upload" /> */}
                <View style={{ padding: 5 }}>
                  <Text style={{ fontSize: 15 }}>Upload</Text>
                </View>
              </ImageBackground>
            </Card>
          </View>
          <View style={{ width: "10%", minWidth: 80 }}>
            <Card
              style={[
                MyStyles.primaryColor,
                {
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  marginVertical: 5,
                },
              ]}
              onPress={() => setModal({ ...modal, redeem: true })}
            >
              <ImageBackground
                style={{}}
                imageStyle={{
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
                source={require("../../assets/pattern.jpg")}
              >
                {/* <Card.Title title="Redeem" /> */}
                <View style={{ padding: 5 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>Redeem</Text>
                </View>
              </ImageBackground>
            </Card>
            <Card
              style={[
                MyStyles.primaryColor,
                {
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  marginVertical: 5,
                },
              ]}
              onPress={() => setModal({ ...modal, details: true })}
            >
              <ImageBackground
                style={{}}
                imageStyle={{
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
                source={require("../../assets/pattern.jpg")}
              >
                {/* <Card.Title
                  title="Customer Details"
                  //titleStyle={{ fontSize: 15 }}
                /> */}
                <View style={{ padding: 5 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>C. Details</Text>
                </View>
              </ImageBackground>
            </Card>
          </View>
        </View>
        <View
          style={[
            MyStyles.row,
            {
              justifyContent: "space-between",
              margin: 0,
              paddingHorizontal: 40,
            },
          ]}
        >
          <Card
            style={[MyStyles.primaryColor, { width: "60%", borderRadius: 10 }]}
            onPress={() => setModal({ ...modal, checkIn: true })}
          >
            <ImageBackground
              style={{}}
              imageStyle={{ borderRadius: 10, opacity: 0.5 }}
              source={require("../../assets/pattern.jpg")}
            >
              {/* <Card.Title
                title={`Join ${branchName} Now`}
                subtitle="Accounts are free"
                right={() => <IconButton icon="chevron-right" size={30} />}
              /> */}
              <View style={{ paddingVertical: 15 }}>
                <Text
                  style={{ fontSize: 22, textAlign: "center" }}
                  numberOfLines={1}
                >{`Join ${branchName} Now`}</Text>
                <Text style={{ textAlign: "center" }}>Accounts are free</Text>
              </View>
            </ImageBackground>
          </Card>
          <Card
            style={[MyStyles.secondaryColor, { width: "35%", borderRadius: 10 }]}
            onPress={() => setModal({ ...modal, checkIn: true })}
          >
            <ImageBackground
              style={{}}
              imageStyle={{ borderRadius: 10, opacity: 0.5 }}
              source={require("../../assets/pattern.jpg")}
            >
              {/* <Card.Title
                title="Check In"
                subtitle="for Rewards"
                right={() => <IconButton icon="chevron-right" size={30} />}
              /> */}
              <View style={{ paddingVertical: 15 }}>
                <Text style={{ fontSize: 22, textAlign: "center" }} numberOfLines={1}>
                  Check In
                </Text>
                <Text style={{ textAlign: "center" }}>for Rewards</Text>
              </View>
            </ImageBackground>
          </Card>
        </View>
      </View>

      {/*------------ Details Modal ------------------- */}

      <CustomModal
        visible={modal.details}
        content={
          !details ? (
            <View style={{ height: "100%"}}>
              <TextInput
                mode="flat"
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                label="Enter Mobile No."
                placeholder="eg:9876543210"
                value={modal.mobile}
                onChangeText={(text) => setModal({ ...modal, mobile: text })}
                maxLength={10}
                keyboardType="number-pad"
                left={
                  <TextInput.Icon
                    theme={{ colors: { text: "#aaaaaa" } }}
                    color="green"
                    size={25}
                    style={{ marginBottom: 0 }}
                    name="phone"
                  />
                }
              //  left={<TextInput.Affix text="+91-" />}
              />
              {recentVistors.map((item, index) => (
                <List.Item
                  onPress={() => {
                    setModal({ ...modal, mobile: item.mobile });
                  }}
                  key={index}
                  title={"+91 " + item.mobile}
                  left={(props) => <List.Icon {...props} icon="history" />}
                />
              ))}
              <View style={[MyStyles.row, { marginTop: 10 }]}>
                <Button
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => setModal({ ...modal, details: false })}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  color="#ffba3c"
                  uppercase={false}
                  compact
                  onPress={() => {
                    postRequest(
                      "customervisit/getCustomerDetails",
                      {
                        mobile: modal.mobile,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        console.log("resp", resp);
                        setDetails(resp?.data);
                      }
                    });
                  }}
                >
                  Continue
                </Button>
              </View>
            </View>
          ) : (
            <View style={{ height: "100%" }}>
              <ScrollView>
                <View style={MyStyles.wrapper}>
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Name</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.full_name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Mobile</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.mobile}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Gender</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.gender}</Text>
                    </View>
                  </View>
                  <Divider style={{ marginVertical: 8 }} />
                  <View style={MyStyles.row}>

                    <View style={{ flex: 1 }}>
                      <Text>Date of Birth</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.dob}</Text>
                    </View>
                  
                    <View style={{ flex: 1 }}>
                      <Text>Date of Aniversary</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>
                        {moment(details?.doa).format("DD/MM/YYYY") ? details.doa : "N/A"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Profession</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.profession}</Text>
                    </View>
                  </View>
                  <Divider style={{ marginVertical: 8 }} />
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Address</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.address}</Text>
                    </View>
                 
                    <View style={{ flex: 1 }}>
                      <Text>Branch Name</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.branch_name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Staff Name</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>
                        {details.staff_name ? details.staff_name : "N/A"}
                      </Text>
                    </View>
                    </View>
                  <Divider style={{ marginVertical: 8 }} />
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Ref Name</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>
                        {details.ref_name ? details.ref_name : "N/A"}
                      </Text>
                    </View>
                 
                    <View style={{ flex: 1 }}>
                      <Text>Category Name</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.category_name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Total Visit</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>
                        <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.visit_count}</Text>
                      </Text>
                    </View>
                  </View>
                  <Divider style={{ marginVertical: 8 }} />
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Last Visit</Text>
                      <Text style={[MyStyles.text, { fontWeight: "bold" }]}>{details?.last_visit}</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={[MyStyles.row, { justifyContent: "flex-end" }]}>
                <Button
                  style={{ marginRight: "auto" }}
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => {
                    setModal({ ...modal, details: false });
                    setDetails(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  style={{ marginHorizontal: 5 }}
                  mode="contained"
                  color="#E1C16E"
                  uppercase={false}
                  compact
                  onPress={() => {
                    postRequest(
                      "customervisit/getCustomerHistory",
                      {
                        customer_id: details?.customer_id,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        setHistory(resp?.data);
                        setModal({ ...modal, details: false, history: true });
                      }
                    });
                  }}
                >
                  History
                </Button>
                <Button
                  style={{ marginHorizontal: 5 }}
                  mode="contained"
                  color="#87CEEB"
                  uppercase={false}
                  compact
                  onPress={() => {
                    postRequest(
                      "customervisit/getCustomerUploadHistory",
                      {
                        customer_id: details?.customer_id,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        setDesign(resp?.data);
                        setModal({ ...modal, details: false, design: true });
                      }
                    });
                    postRequest(
                      "customervisit/getCustomerWishlistHistory",
                      {
                        customer_id: details?.customer_id,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        setWishlist(resp?.data);
                      }
                    });
                    postRequest(
                      "customervisit/getCustomerExhibitionHistory",
                      {
                        customer_id: details?.customer_id,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        setExhibition(resp?.data);
                      }
                    });
                  }}
                >
                  Design
                </Button>
              </View>
            </View>
          )
        }
      />

      {/*------------ History Modal ------------------- */}

      <CustomModal
        visible={modal.history}
        content={
          <View>
            <DataTable style={{ height: "100%" }}>
              <DataTable.Header>
                <DataTable.Title
                  style={{ flex: 2, justifyContent: "center" }}
                  theme={{ colors: { text: "#0818A8" } }}
                >
                  Datetime
                </DataTable.Title>
                <DataTable.Title
                  style={{ flex: 1, justifyContent: "center" }}
                  theme={{ colors: { text: "#0818A8" } }}
                >
                  Type
                </DataTable.Title>
                <DataTable.Title
                  style={{ flex: 1, justifyContent: "center" }}
                  theme={{ colors: { text: "#0818A8" } }}
                >
                  Details
                </DataTable.Title>
                <DataTable.Title
                  style={{ flex: 1, justifyContent: "center" }}
                  theme={{ colors: { text: "#0818A8" } }}
                >
                  Status
                </DataTable.Title>
              </DataTable.Header>
              <FlatList
                data={history}
                renderItem={({ item, index }) => (
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 2, justifyContent: "center" }}>
                      {item.date}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                      {item.type}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                      {item.details}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                      {item.action}
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <View style={[MyStyles.row, { marginTop: 10 }]}>
                <Button
                  style={{ marginRight: "auto" }}
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => {
                    setModal({ ...modal, history: false });
                    setDetails(null);
                  }}
                >
                  Close
                </Button>

                <Button
                  style={{ marginHorizontal: 5 }}
                  mode="contained"
                  color="#87CEEB"
                  uppercase={false}
                  compact
                  onPress={() => {
                    setModal({ ...modal, history: false, details: true });
                  }}
                >
                  Back
                </Button>
              </View>
            </DataTable>
          </View>
        }
      />

      {/*------------ Design Modal ------------------- */}

      <CustomModal
        visible={modal.design}
        content={
          <View style={{ height: "100%" }}>
            <View
              style={[
                MyStyles.row,
                {
                  justifyContent: "flex-start",
                  paddingTop: 5,
                  marginBottom: 5,
                },
              ]}
            >
              <Button
                mode="outlined"
                uppercase={false}
                compact
                color={tabs === 1 ? "blue" : "#AAA"}
                style={{
                  borderWidth: 1,
                  marginHorizontal: 5,
                }}
                onPress={() => setTabs(1)}
              >
                My Designs
              </Button>
              <Button
                mode="outlined"
                uppercase={false}
                compact
                color={tabs === 2 ? "blue" : "#AAA"}
                style={{
                  borderWidth: 1,
                  marginHorizontal: 5,
                }}
                onPress={() => setTabs(2)}
              >
                Wishlisht
              </Button>
              <Button
                mode="outlined"
                uppercase={false}
                compact
                color={tabs === 3 ? "blue" : "#AAA"}
                style={{
                  borderWidth: 1,
                  marginHorizontal: 5,
                }}
                onPress={() => setTabs(3)}
              >
                Exhibition
              </Button>
            </View>

            {/*------------ My Design Tab ------------------- */}

            {tabs === 1 && (

              <Swiper showsButtons showsPagination={false}>
                {design.map((item, index) => {
                  return (
                    <View style={[MyStyles.row, { flex: 1 }]} key={index}>
                      <Image
                        source={{ uri: item.url + item.image_path }}
                        style={[
                          {
                            resizeMode: "contain",
                            borderRadius: 5,
                            height: "100%",
                            flex: 2,
                          },
                        ]}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <ScrollView>
                        <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Product Category</Text>
                            <Text style={MyStyles.text}>{item.product_category ? item.category_name : "N/A"}</Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Product Name</Text>
                            <Text style={MyStyles.text}>{item.product_name ? item.product_name : "N/A"}</Text>
                          </View>
                          {item.sku
                            ? (
                              <View style={MyStyles.wrapper}>
                                <Text style={{ fontWeight: "bold" }}>SKU</Text>
                                <Text style={MyStyles.text}>{item.sku ? item.sku : "N/A"}</Text>
                              </View>
                            )
                            : null
                          }
                          
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Staff</Text>
                            <Text style={MyStyles.text}>
                              {item.staff_name ? item.staff_name : "N/A"}
                            </Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Date</Text>
                            <Text style={MyStyles.text}>{item.date ? item.date : "N/A"}</Text>
                          </View>
                          
                        <View style={MyStyles.wrapper}>
                          <Text style={{ fontWeight: "bold" }}>Interest </Text>
                          <Text style={MyStyles.text}>{item.interest ? item.interest : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Remarks</Text>
                            <Text style={MyStyles.text}>{item.remarks ? item.remarks : "N/A"}</Text>
                          </View>
                        </ScrollView>

                      </View>
                    </View>
                  );
                })}
              </Swiper>

            )}

            {/*------------ Wishlist Tab ------------------- */}

            {tabs === 2 && (
              <Swiper style={{ height: "100%" }} showsButtons showsPagination={false}>
                {wishlist.map((item, index) => {
                  return (
                    <View style={[MyStyles.row, { flex: 1 }]} key={index}>
                      <Image
                        source={{ uri: item.url + item.image_path }}
                        style={[
                          {
                            resizeMode: "contain",
                            borderRadius: 5,
                            height: "100%",
                            flex: 2,
                          },
                        ]}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <ScrollView>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Product Name</Text>
                            <Text style={MyStyles.text}>
                              {item.product_name ? item.product_name : "N/A"}
                            </Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>SKU</Text>
                            <Text style={MyStyles.text}>{item.sku ? item.sku : "N/A"}</Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Remarks</Text>
                            <Text style={MyStyles.text}>{item.remarks ? item.remarks : "N/A"}</Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Date</Text>
                            <Text style={MyStyles.text}>{item.date ? item.date : "N/A"}</Text>
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                  );
                })}
              </Swiper>
            )}

            {/*------------ Exhibition Tab ------------------- */}

            {tabs === 3 && (
              <Swiper style={{ height: "100%" }} showsButtons showsPagination={false}>
                {exhibition.map((item, index) => {
                  return (
                    <View style={[MyStyles.row, { flex: 1 }]} key={index}>
                      <Image
                        source={{ uri: item.url + item.image_path }}
                        style={[
                          {
                            resizeMode: "contain",
                            borderRadius: 5,
                            height: "100%",
                            flex: 2,
                          },
                        ]}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <ScrollView>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Product Name</Text>
                            <Text style={MyStyles.text}>
                              {item.product_name ? item.product_name : "N/A"}
                            </Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>SKU</Text>
                            <Text style={MyStyles.text}>{item.sku ? item.sku : "N/A"}</Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Remarks</Text>
                            <Text style={MyStyles.text}>{item.remarks ? item.remarks : "N/A"}</Text>
                          </View>
                          <View style={MyStyles.wrapper}>
                            <Text style={{ fontWeight: "bold" }}>Date</Text>
                            <Text style={MyStyles.text}>{item.date ? item.date : "N/A"}</Text>
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                  );
                })}
              </Swiper>
            )}

            <View style={[MyStyles.row, { marginTop: 10 }]}>
              <Button
                style={{ marginRight: "auto" }}
                mode="contained"
                color="#DC143C"
                uppercase={false}
                compact
                onPress={() => {
                  setModal({ ...modal, design: false });
                  setDetails(null);
                }}
              >
                Close
              </Button>

              <Button
                style={{ marginHorizontal: 5 }}
                mode="contained"
                color="#87CEEB"
                uppercase={false}
                compact
                onPress={() => {
                  setModal({ ...modal, design: false, details: true });
                }}
              >
                Back
              </Button>
            </View>
          </View>
        }
      />

      {/*------------ Redeem Modal ------------------- */}

      <CustomModal
        visible={modal.redeem}
        content={
          !redeem ? (
            <View>
              <TextInput
                mode="flat"
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                label="Enter Mobile No."
                placeholder="eg:9876543210"
                value={modal.mobile}
                onChangeText={(text) => setModal({ ...modal, mobile: text })}
                maxLength={10}
                keyboardType="number-pad"
                left={
                  <TextInput.Icon
                    theme={{ colors: { text: "#aaaaaa" } }}
                    color="green"
                    size={25}
                    style={{ marginBottom: 0 }}
                    name="phone"
                  />
                }
              //  left={<TextInput.Affix text="+91-" />}
              />
              {recentVistors.map((item, index) => (
                <List.Item
                  onPress={() => {
                    setModal({ ...modal, mobile: item.mobile });
                  }}

                  key={index}
                  title={"+91 " + item.mobile}
                  left={(props) => <List.Icon {...props} icon="history" />}
                />
              ))}
              <View style={[MyStyles.row, { marginTop: 10 }]}>
                <Button
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => setModal({ ...modal, redeem: false })}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  color="#ffba3c"
                  uppercase={false}
                  compact
                  onPress={() => {
                    postRequest(
                      "customervisit/getCustomerVisit",
                      { mobile: modal.mobile },
                      token
                    ).then((resp) => {
                      if (resp?.status === 200) {
                        const customerData = resp.data;
                        setVoucherList(customerData);
                        setCustomerId(customerData[0].customer_id);

                        // 1️⃣ Fetch customer points
                        postRequest(
                          "customervisit/getCustomerPointList",
                          {
                            customer_id: customerData[0].customer_id,
                            branch_id: branchId,
                          },
                          token
                        ).then((pointResp) => {
                          if (pointResp?.status === 200) {
                            setPoints(pointResp.data);

                            // 2️⃣ Fetch expired points
                            postRequest(
                              "customervisit/getCustomerExpirePointList",
                              {
                                customer_id: customerData[0].customer_id,
                                branch_id: branchId,
                              },
                              token
                            ).then((expirePointResp) => {
                              if (expirePointResp?.status === 200) {
                                setExpiredPoints?.(expirePointResp.data);

                                // 3️⃣ Fetch customer redeem points
                                postRequest(
                                  "customervisit/getCustomerRedeemPointList",
                                  {
                                    customer_id: customerData[0].customer_id,
                                    branch_id: branchId,
                                  },
                                  token
                                ).then((redeemPointResp) => {
                                  if (redeemPointResp?.status === 200) {
                                    setRedeemPoints(redeemPointResp.data);

                                    // 4️⃣ Fetch customer vouchers
                                    postRequest(
                                      "customervisit/getCustomerVoucherList",
                                      {
                                        customer_id: customerData[0].customer_id,
                                        branch_id: branchId,
                                      },
                                      token
                                    ).then((voucherResp) => {
                                      if (voucherResp?.status === 200) {
                                        setRedeem(voucherResp.data);
                                        setModal({ ...modal, redeem: true });
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }}


                >
                  Continue
                </Button>
              </View>
            </View>
          ) : (
            <RedeemModal branchId={branchId} visible={modal.redeem} onClose={() => { setModal({ ...modal, redeem: false }); setRedeem(null); setPoints(null); }} points={points} redeem={redeem} expiredPoints={expiredPoints} redeemPoints={redeemPoints} voucherList={voucherList} token={token} staffList={staffList} />
          )
        }
      />

      {/*------------ Join-Now Modal ------------------- */}

      <CustomModal
        visible={modal.join}
        content={
          join.step1 ? (
            <View>
              <View style={MyStyles.wrapper}>
                <View style={MyStyles.row}>
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    label="Name"
                    error={!join.full_name}
                    value={join.full_name}
                    onChangeText={(text) => setJoin({ ...join, full_name: text })}
                  />
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    label="Mobile"
                    disabled
                    maxLength={10}
                    keyboardType="number-pad"
                    value={join.mobile}
                  />
                  <DropDown
                    data={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Others", value: "Others" },
                    ]}
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    placeholder="Gender"
                    value={join.gender}
                    onChange={(val) => setJoin({ ...join, gender: val })}
                  />
                </View>
                <View style={MyStyles.row}>
                  <DatePicker
                    label="Date Of Birth"
                    inputStyles={{ backgroundColor: "rgba(0,0,0,0)", flex: 1, marginRight: 20 }}
                    value={join.dob}
                    onValueChange={(val) => setJoin({ ...join, dob: val })}
                  />
                  <DatePicker
                    label="Date Of Aniversary"
                    inputStyles={{ backgroundColor: "rgba(0,0,0,0)", flex: 1, marginLeft: 20 }}
                    value={join.doa}
                    onValueChange={(val) => setJoin({ ...join, doa: val })}
                  />
                </View>
                <TextInput
                  mode="flat"
                  style={{ backgroundColor: "rgba(0,0,0,0)" }}
                  label="Address"
                  value={join.address}
                  onChangeText={(text) => setJoin({ ...join, address: text })}
                />
              </View>
              <View style={MyStyles.row}>
                <Button
                  mode="contained"
                  color="red"
                  uppercase={false}
                  compact
                  onPress={() => {
                    setModal({ ...modal, join: false });
                    setJoin({});
                  }}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  color="#ffba3c"
                  uppercase={false}
                  compact
                  onPress={() => {
                    if (join.full_name != "") {
                      setJoin({ ...join, step1: false });
                    }
                  }}
                >
                  Continue
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <View style={MyStyles.wrapper}>
                <View style={MyStyles.row}>
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    label="Name"
                    disabled
                    value={join.full_name}
                  />
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    label="Mobile"
                    disabled
                    value={join.mobile}
                  />
                </View>
                <View style={MyStyles.row}>
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    label="Refrence Mobile"
                    maxLength={10}
                    keyboardType="number-pad"
                    onChangeText={(text) => {
                      if (text.length == 10) {
                        postRequest(
                          "customervisit/getCustomerVisit",
                          {
                            mobile: text,
                          },
                          token
                        ).then((resp) => {
                          if (resp?.status == 200) {
                            setJoin({
                              ...join,
                              ref_id: resp.data[0].customer_id,
                              ref_name: resp.data[0].full_name,
                            });
                          }
                        });
                      }
                    }}
                  />
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    label="Refrence Name"
                    disabled
                    value={join.ref_name}
                    onChangeText={(text) => setJoin({ ...join, ref_name: text })}
                  />
                  <DropDown
                    value={join.category_id}
                    ext_lbl="category_name"
                    ext_val="category_id"
                    data={categoryList}
                    placeholder="Category"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    onChange={(val) => setJoin({ ...join, category_id: val })}
                  />
                  <DropDown
                    value={join.staff_id}
                    ext_lbl="name"
                    ext_val="staff_id"
                    data={staffList}
                    placeholder="Staff"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    onChange={(val) => setJoin({ ...join, staff_id: val })}
                  />
                </View>
                <View style={MyStyles.row}>
                  <DropDown
                    value={join.area_id}
                    ext_lbl="area_name"
                    ext_val="area_id"
                    data={areaList}
                    placeholder="Area"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
                    onChange={(val) => setJoin({ ...join, area_id: val })}
                  />
                  <IconButton
                    icon="plus"
                    size={20}
                    style={{ backgroundColor: "#ffba3c" }}
                    onPress={() => setModal({ ...modal, area: true })}
                  />
                  <TextInput
                    mode="flat"
                    style={{ backgroundColor: "rgba(0,0,0,0)", flex: 2 }}
                    label="Profession"
                    value={join.profession}
                    onChangeText={(text) => setJoin({ ...join, profession: text })}
                  />
                </View>
              </View>
              <View style={MyStyles.row}>
                <Button
                  mode="contained"
                  color="red"
                  compact
                  uppercase={false}
                  style={{ marginRight: "auto" }}
                  onPress={() => {
                    setModal({ ...modal, join: false });
                    setJoin({});
                  }}
                >
                  Close
                </Button>

                <Button
                  mode="contained"
                  color="#87CEEB"
                  compact
                  uppercase={false}
                  style={{ marginHorizontal: 10 }}
                  onPress={() => setJoin({ ...join, step1: true })}
                >
                  Back
                </Button>

                <Button
                  mode="contained"
                  color="#ffba3c"
                  compact
                  uppercase={false}
                  onPress={() => {
                    postRequest("customervisit/insertNewCustomerVisit", join, token).then(
                      (resp) => {
                        if (resp?.status == 200) {
                          setModal({ ...modal, join: false });
                          setJoin({});
                        }
                      }
                    );
                  }}
                >
                  Continue
                </Button>
              </View>
            </View>
          )
        }
      />

      {/*------------ Area Modal ------------------- */}

      <CustomModal
        visible={modal.area}
        content={
          <View>
            <TextInput
              mode="flat"
              style={{ backgroundColor: "rgba(0,0,0,0)" }}
              label="Area Name"
              value={modal.area_name}
              onChangeText={(text) => {
                setModal({ ...modal, area_name: text });
              }}
            />
            <View style={MyStyles.row}>
              <Button
                mode="contained"
                color="red"
                uppercase={false}
                compact
                onPress={() => setModal({ ...modal, area: false, area_name: "" })}
              >
                Close
              </Button>
              <Button
                mode="contained"
                color="#ffba3c"
                uppercase={false}
                compact
                onPress={() => {
                  postRequest(
                    "customervisit/insertArea",
                    {
                      area_id: "0",
                      area_name: modal.area_name,
                      branch_id: branchId,
                    },
                    token
                  ).then((resp) => {
                    if (resp?.status == 200) {
                      setModal({ ...modal, area: false });
                      postRequest("customervisit/AreaList", {}, token).then((resp) => {
                        if (resp?.status == 200) {
                          setAreaList(resp.data);
                        }
                      });
                    }
                  });
                }}
              >
                Save
              </Button>
            </View>
          </View>
        }
      />

      {/*------------ CheckIn Modal ------------------- */}

      {!checkIn ? (
        <CustomModal
          contentContainerStyle={{
            width: "70%",
            maxHeight: 140,
            height: "40%",
          }}
          style={{
          }}
          visible={modal.checkIn}
          content={
            <View>
              <TextInput
                mode="flat"
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                label="Enter Mobile No."
                placeholder="eg:9876543210"
                value={modal.mobile}
                onChangeText={(text) => setModal({ ...modal, mobile: text })}
                maxLength={10}
                keyboardType="number-pad"
                left={
                  <TextInput.Icon
                    theme={{ colors: { text: "#aaaaaa" } }}
                    color="green"
                    size={25}
                    style={{ marginBottom: 0 }}
                    name="phone"
                  />
                }
              //  left={<TextInput.Affix text="+91-" />}
              />
              {/* {recentVistors.map((item, index) => (
                <List.Item
                  onPress={() => {
                    setModal({ ...modal, mobile: item.mobile });
                  }}
                  key={index}
                  title={"+91 " + item.mobile}
                  left={(props) => <List.Icon {...props} icon="history" />}
                />
              ))} */}
              <View style={[MyStyles.row, { marginTop: 10 }]}>
                <Button
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => setModal({ ...modal, checkIn: false })}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  color="#ffba3c"
                  uppercase={false}
                  compact
                  onPress={() => {
                    postRequest(
                      "customervisit/getCustomerVisit",
                      {
                        mobile: modal.mobile,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        postRequest(
                          "customervisit/insertCustomerVisit",
                          {
                            customer_id: resp.data[0].customer_id,
                            tran_id: "0",
                          },
                          token
                        ).then((resp) => {
                          if (resp?.status == 200) {
                            setCheckIn(resp.data[0]);
                            setTimeout(() => {
                              setModal({ ...modal, checkIn: false });
                              setCheckIn(null);
                            }, 8000);
                          }
                        });
                      }
                      if (resp?.status == 500) {
                        setJoin({ ...join, mobile: modal.mobile });
                        setModal({ ...modal, join: true, checkIn: false });
                      }
                    });
                  }}
                >
                  Continue
                </Button>
              </View>
            </View>
          }
        />
      ) : (
        <Portal>
          <ImageBackground style={{ flex: 1 }} source={require("../../assets/thank.jpg")}>
            <Modal
              visible={modal.checkIn}
              dismissable={false}
              contentContainerStyle={{
                flex: 1,
                top: 0,
              }}
            >
              <View style={{ flex: 1 }}></View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 40,
                    color: "#fff",
                    textAlign: "center",
                    // fontFamily: "ElMessiri-bold",
                  }}
                >
                  Thank You
                </Text>
              </View>
              <View style={[MyStyles.row,
              {
                justifyContent: "space-between",
                margin: 0,
                paddingHorizontal: 40,
              },]}>
                <Card
                  style={[MyStyles.primaryColor, { width: "60%", borderRadius: 10 }]}
                  onPress={() => setModal({ ...modal, checkIn: true })}
                >
                  <ImageBackground
                    style={{}}
                    imageStyle={{ borderRadius: 10, opacity: 0.5 }}
                    source={require("../../assets/pattern.jpg")}
                  >
                    {/* <Card.Title
                title={`Join ${branchName} Now`}
                subtitle="Accounts are free"
                right={() => <IconButton icon="chevron-right" size={30} />}
              /> */}
                    <View style={{ paddingVertical: 15 }}>
                      <Text
                        style={{ fontSize: 22, textAlign: "center" }}
                        numberOfLines={1}
                      >{checkIn.customer_name}</Text>
                    </View>
                  </ImageBackground>
                </Card>
                <Card
                  style={[MyStyles.secondaryColor, { width: "35%", borderRadius: 10 }]}
                  onPress={() => setModal({ ...modal, checkIn: true })}
                >
                  <ImageBackground
                    style={{}}
                    imageStyle={{ borderRadius: 10, opacity: 0.5 }}
                    source={require("../../assets/pattern.jpg")}
                  >
                    {/* <Card.Title
                title="Check In"
                subtitle="for Rewards"
                right={() => <IconButton icon="chevron-right" size={30} />}
              /> */}

                    <View style={{ paddingVertical: 15 }}>
                      <Text style={{ fontSize: 22, textAlign: "center" }} numberOfLines={1}>
                        {checkIn.total_visit}
                      </Text>

                    </View>
                  </ImageBackground>
                </Card>
                {/* <Card style={[MyStyles.primaryColor, { width: "60%", borderRadius: 10 }]}>
                  <ImageBackground
                    style={{ flex: 1 }}
                    imageStyle={{ borderRadius: 10, opacity: 0.5 }}
                    source={require("../../assets/pattern.jpg")}
                  >
                    <Card.Title
                      style={{ flex: 1 }}
                      title={checkIn.customer_name}
                      titleStyle={{
                        fontSize: 25,
                        // fontFamily: "ElMessiri-bold",
                      }}
                    />
                  </ImageBackground>
                </Card> */}
                {/* <Card style={[MyStyles.primaryColor, { width: "40%", borderRadius: 10 }]}>
                  <ImageBackground
                    style={{ flex: 1 }}
                    imageStyle={{ borderRadius: 10, opacity: 0.5 }}
                    source={require("../../assets/pattern.jpg")}
                  >
                    <Card.Title
                      style={{ flex: 1 }}
                      title={checkIn.total_visit}
                      titleStyle={{
                        fontSize: 25,
                        // fontFamily: "ElMessiri-bold",
                      }}
                    />
                  </ImageBackground>
                </Card> */}
              </View>
            </Modal>
          </ImageBackground>
        </Portal>
      )}

      {/*------------ Upload Modal ------------------- */}

      <CustomModal
        visible={modal.upload}
        content={
          !upload ? (
            <View>
              <TextInput
                mode="flat"
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                label="Enter Mobile No."
                placeholder="eg:9876543210"
                value={modal.mobile}
                onChangeText={(text) => setModal({ ...modal, mobile: text })}
                maxLength={10}
                keyboardType="number-pad"
                left={
                  <TextInput.Icon
                    theme={{ colors: { text: "#aaaaaa" } }}
                    color="green"
                    size={25}
                    style={{ marginBottom: 0 }}
                    name="phone"
                  />
                }
              //  left={<TextInput.Affix text="+91-" />}
              />
              {recentVistors.map((item, index) => (
                <List.Item
                  onPress={() => {
                    setModal({ ...modal, mobile: item.mobile });
                  }}
                  key={index}
                  title={"+91 " + item.mobile}
                  left={(props) => <List.Icon {...props} icon="history" />}
                />
              ))}
              <View style={[MyStyles.row, { marginTop: 10 }]}>
                <Button
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => setModal({ ...modal, upload: false })}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  color="#ffba3c"
                  uppercase={false}
                  compact
                  onPress={() => {
                    postRequest(
                      "customervisit/getCustomerVisit",
                      {
                        mobile: modal.mobile,
                      },
                      token
                    ).then((resp) => {
                      if (resp?.status == 200) {
                        setUpload({
                          tran_id: "0",
                          branch_id: branchId,
                          customer_id: resp.data[0].customer_id,
                          full_name: resp.data[0].full_name,
                          mobile: resp.data[0].mobile,
                          remarks: "",
                          sku: "",
                          staff_id: "",
                          image_path: "",
                          image_data: "",
                          uri: require("../../assets/upload.png"),
                        });
                      }
                    });
                  }}
                >
                  Continue
                </Button>
              </View>
            </View>
          ) : (
            <View style={{ height: "100%" }}>
              <ScrollView>
                <View style={[MyStyles.row, { fontSize: 12 }]}>
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <View style={MyStyles.row}>
                      <TextInput
                        mode="flat"
                        style={{ backgroundColor: "rgba(0,0,0,0)" }}
                        label="Name"
                        value={upload?.full_name}
                        disabled
                      />
                      <TextInput
                        mode="flat"
                        style={{ backgroundColor: "rgba(0,0,0,0)" }}
                        label="Mobile No."
                        value={upload?.mobile}
                        disabled
                      />

                      <DropDown
                        value={upload?.staff_id}
                        ext_lbl="name"
                        ext_val="staff_id"
                        data={staffList}
                        placeholder="Staff"
                        onChange={(val) => setUpload({ ...upload, staff_id: val })}
                        style={[MyStyles.dropdown, {backgroundColor: "rgba(0,0,0,0)", color: "#000", borderColor: "#cccccc"}]}
                      />
                    </View>


                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginVertical: 6 }}>Category</Text>
                      <View style={[MyStyles.checkboxContainer, { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }]}>
  {categoryList.map((item, index) => (
    <View key={item.category_id} style={{ width: '25%', padding: 4, boxSizing: 'border-box' }}>
      <Pressable 
        onPress={() => toggleCategory(item.category_id, item.category_name)} 
        style={[MyStyles.checkboxRow, { flexDirection: 'row', alignItems: 'center' }]}
      >
        <View style={[MyStyles.checkbox, selectedCategories[item.category_id] && MyStyles.checked]}>
          {selectedCategories[item.category_id] && <Text style={MyStyles.tick}>✓</Text>}
        </View>
        <Text 
          style={[
            MyStyles.checkboxLabel, 
            { 
              fontSize: 12,
              flex: 1,
              marginLeft: 5,
              textAlign: 'left'
            }
          ]}
        >
          {item.category_name.toUpperCase()}
        </Text>
      </Pressable>
    </View>
  ))}
</View>


                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginVertical: 2, marginBottom: 6 }}>Interest</Text>
                    <View style={[MyStyles.radioContainer, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
  {['yes', 'followup', 'requirement'].map((item, idx, arr) => (
    <Pressable
      key={item}
      onPress={() => {
        setInterest(item);
        console.log(`Interest selected: ${item}`);
      }}
      style={[
        MyStyles.radioRow,
        idx !== arr.length - 1 ? { marginRight: 40 } : null,
      ]}
    >
      <View style={interest === item ? MyStyles.radioSelected : MyStyles.radio} />
      <Text style={[MyStyles.radioLabel, { fontSize: 14 }]}>
        {item === 'yes' ? 'Yes' : item === 'followup' ? 'Follow Up' : 'Requirement'}
      </Text>
    </Pressable>
  ))}
</View>



                  </View>
                </View>
              </ScrollView>
              <View style={[MyStyles.row, { margin: 10 }]}>
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: '#f64e60',
                    color: 'white',
                  }}
                  uppercase={false}
                  compact
                  onPress={() => {
                    setModal({ ...modal, upload: false });
                    setUpload(null);
                  }}
                >
                  CANCEL
                </Button>
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: '#3699fe',
                    color: 'white',
                  }}
                  uppercase={false}
                  compact
                  onPress={() => {
                    if(payloadData.length > 0){
                    setModal({ ...modal, uploadNext: true, checkIn: false, upload: false });
                    const updatedPayload = payloadData.map(item => {
                      const imageUrl = categoryImages[item.category_id]?.[0]?.uri || '';
                      // Replace "BranchCategory" with "CustomerUploads" in the URL
                      const modifiedImageUrl = imageUrl.replace('/BranchCategory/', '/CustomerUploads/');
                      return {
                        ...item,
                        image_path: {
                          ...item.image_path,
                          url: modifiedImageUrl
                        }
                      };
                    });
                    
                    setPayloadData(updatedPayload);
                    console.log("Updated payloadData with images------>", updatedPayload);
                    }else{
                      alert("Please select at least one category");
                    }
                  }}
                >
                  NEXT
                </Button>
              </View>
            </View>
          )
        }
      />

      {/*------------ Upload Next Modal ------------------- */}
      {modal.uploadNext && (
  {
    yes: (
     <InterestYes  
       visible={modal.upload && interest?.toLowerCase().trim() === 'yes'} 
       modal={modal} 
       setModal={setModal} 
       payloadData={payloadData} 
       setPayloadData={setPayloadData} 
       categoryImages={categoryImages}
       setCategoryImages={setCategoryImages}
       token={token} 
       imageUrl={imageUrl} 
       serviceUrl={serviceUrl} 
       setUpload={setUpload} 
       setCheckIn={setCheckIn} 
       pickImage={pickImage} 
       handleUpload={handleUpload} 
       interest={interest} 
       setInterest={setInterest}
     />
    ),
    followup: (
     <InterestFollowUp visible={modal.upload && interest?.toLowerCase().trim() === 'yes'} 
     modal={modal} 
     setModal={setModal} 
     payloadData={payloadData} 
     setPayloadData={setPayloadData} 
     categoryImages={categoryImages}
     setCategoryImages={setCategoryImages}
     token={token} 
     imageUrl={imageUrl} 
     serviceUrl={serviceUrl} 
     setUpload={setUpload} 
     setCheckIn={setCheckIn} 
     pickImage={pickImage} 
     handleUpload={handleUpload} 
     interest={interest} 
     setInterest={setInterest}/>
    ),
    requirement: (
     <InterestRequirement visible={modal.upload && interest?.toLowerCase().trim() === 'requirement'} modal={modal} setModal={setModal} payloadData={payloadData} setPayloadData={setPayloadData} image={image} setImage={setImage} token={token} imageUrl={imageUrl} serviceUrl={serviceUrl} setUpload={setUpload} setCheckIn={setCheckIn} pickImage={pickImage} handleUpload={handleUpload} interest={interest} setInterest={setInterest}/>
    ),
  }[interest?.toLowerCase().trim()] || null
)}
    


      {/*------------ Notification Modal ------------------- */}
      <Portal>
        <Modal
          visible={modal.notification}
          dismissable={false}
          contentContainerStyle={{
            backgroundColor: "rgba(255,255,255,0.3)",
            //backgroundColor: "#FFF",
            width: "40%",
            height: "60%",
            alignSelf: "flex-end",
            borderRadius: 10,
            marginBottom: "auto",
            marginTop: 12,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <IconButton
              icon="close"
              size={10}
              color="#FFF"
              style={{ backgroundColor: "red" }}
              onPress={() => setModal({ ...modal, notification: false })}
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <FlatList
              data={notifications}
              style={{ marginBottom: 10 }}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    MyStyles.row,
                    {
                      //backgroundColor: "#FFF",
                      marginVertical: 1,
                      borderBottomColor: item.color,
                      borderBottomWidth: 2,
                    },
                  ]}
                >
                  <Surface
                    style={{
                      backgroundColor: item.color,
                      padding: 5,
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        textTransform: "uppercase",
                        fontSize: 30,
                        textAlign: "center",
                        color: "#FFF",
                      }}
                    >
                      {item.notification_type.slice(0, 1)}
                    </Text>
                  </Surface>
                  <View style={{ flexGrow: 1, padding: 5 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text
                        style={{
                          color: "#FFF",
                        }}
                      >
                        {item.full_name}
                      </Text>
                      <Text
                        style={{
                          color: "#FFF",
                        }}
                      >
                        {item.mobile}
                      </Text>
                      <Text
                        style={{
                          color: "#FFF",
                        }}
                      >
                        {item.time}
                      </Text>
                      {/* <HTML  source={{ html: item.msg }} /> */}
                    </View>
                    {item.notification_type == "Feedback" && (
                      <>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          {[...Array(item.f_count)].map((el, index) => <Text key={index}>⭐</Text>)}
                        </View>
                        <View style={{ width: 250 }}>
                          <Text
                            style={{
                              color: "#FFF",
                              wordWrap: 'break-word'
                            }}
                          >
                            {item.f_service}
                          </Text>
                        </View>
                      </>
                    )}

                    {item.notification_type != "Feedback" && (
                      <Text
                        style={{
                          color: "#FFF",
                        }}
                      >
                        {item.notification_type}
                      </Text>

                    )}

                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Modal>
      </Portal>
    </View>
    // </ImageBackground>
  );
};

export default Dashboard;
