import React, { useState, useRef } from "react";
import {
    View,
    ScrollView,
    Text,
    Alert,
    Image,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
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
import {ActivityIndicator} from "react-native";
import { Platform } from "react-native";
const InterestFollowUp = ({
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
    handleUpload
}) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const isMounted = useRef(true);

    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    // Format for display
    const formattedDate = moment(date).format('DD/MM/YYYY hh:mm a');

    const onChange = (event, selectedDate) => {
        setShowPicker(false); // on Android, picker closes automatically
        if (selectedDate) {
            setDate(selectedDate);
        }
    };
    return (
        <CustomModal
            visible={modal.uploadNext}
            content={
                <View style={{ height: "100%" }}>
                    <ScrollView>
                        <View style={[MyStyles.row, {marginBottom:10, justifyContent:"space-between"}]}>
                            <Text style={[MyStyles.headerText,{marginBottom:10, fontSize:16, fontWeight:"bold"}]}>Follow Up:</Text>
                            <FollowUpDateTimePicker
                                value={date}
                                mode="datetime"
                                is24Hour={false}
                                flex={0.6}
                                style={{flex:0.6, borderColor:"#f17022", borderWidth:1, borderRadius:6, backgroundColor:"#fff", padding:10}}
                                display={Platform.OS === "android" ? "default" : "spinner"}
                                onChange={onChange} />
                        </View>
                        <View style={[MyStyles.row, { justifyContent: "space-around", flexWrap: 'wrap' }]}>
                            {payloadData.map((payload, index) => (
                                <View key={index} style={{ flex: 0.30, marginBottom: 20, overflowX: "hidden" }}>
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
                                                const image = await ImagePicker.openPicker({
                                                    width: 300,
                                                    height: 400,
                                                    cropping: true,
                                                    compressImageQuality: 0.8,
                                                    includeBase64: false,
                                                    mediaType: 'photo',
                                                    forceJpg: true
                                                });

                                                const formData = new FormData();
                                                formData.append("files", {
                                                    uri: image.path,
                                                    name: "photo.jpg",
                                                    type: "image/jpeg"
                                                });

                                                try {
                                                    const response = await uploadImage("customervisit/UploadCustomerImage", formData, token);
                                                    setPayloadData(prev => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            image_path: {
                                                                ...updated[index]?.image_path,
                                                                choose: image.path,
                                                                url: response.data?.url || image.path
                                                            }
                                                        };
                                                        return updated;
                                                    });
                                                } catch (error) {
                                                    console.error("Upload error:", error);
                                                    Alert.alert("Error", "Failed to upload image. Please try again.");
                                                }
                                            } catch (err) {
                                                if (err.code !== 'E_PICKER_CANCELLED') {
                                                    console.error("ImagePicker error:", err);
                                                    Alert.alert("Error", "Failed to pick image. Please try again.");
                                                }
                                            }
                                        }}
                                    >
                                        Choose Files
                                    </Button>

                                    {/* Dynamic Image Below */}
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
                                            resizeMode: "contain",
                                        }}
                                    />

                                    {/* Add Images Button */}
                                    <View style={MyStyles.row}>
                                        <Button
                                            mode="contained"
                                            compact
                                            style={{ color: "white" }}
                                            onPress={pickImage}
                                            color="#1abc9c"
                                        >
                                            <Text style={{ color: "white" }}>ADD IMAGES</Text>
                                        </Button>
                                        <View style={{ marginLeft: 4, alignItems: "center", justifyContent: "center" }}>
                                            <Button
                                                icon={({ color, size }) => (
                                                        <Icon name="upload" size={16} color="#fff" />
                                                )}
                                                style={{
                                                    backgroundColor: "#3699fe",
                                                    width: 40,
                                                    minWidth: 0,
                                                    alignSelf: "center",
                                                    alignItems: "center",
                                                    paddingLeft: 10,
                                                    justifyContent: "center",
                                                }}
                                                contentStyle={{ alignItems: "center", justifyContent: "center" }}

                                                textColor="#fff"
                                                onPress={handleUpload}
                                            />
                                        </View>
                                    </View>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
                                    >
                                        {image.map((uri, idx) => (
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
                                                        height: 130,
                                                        width: 130,
                                                        resizeMode: "cover",
                                                    }}
                                                />

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // Remove image at index `idx`
                                                        const newImages = [...image];
                                                        newImages.splice(idx, 1);
                                                        setImage(newImages);
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

                                    {/* SKU Input */}
                                    <TextInput
                                        mode="outlined"
                                        label="SKU"
                                        style={{ marginBottom: 10, borderColor: '#ccc' }}
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
                                            source={{ uri: `${imageUrl}Images/${payloadData[index]?.image_path?.sku}` }}
                                            style={{
                                                height: 130,
                                                width: "100%",
                                                marginVertical: 10,
                                                resizeMode: "contain",
                                            }}
                                        /> : null}
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
                                                appointment_date: date,
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
                                        setImage([]);


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
    )
}
export default InterestFollowUp;
