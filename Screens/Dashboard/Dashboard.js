import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { ImageBackground, View, ScrollView, FlatList, Image, Alert } from "react-native";
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

const Dashboard = (props) => {
  const { branchId, branchName, logoPath, token } = props.loginDetails;
  const imageRef = useRef(null);
  const [details, setDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [tabs, setTabs] = useState(1);
  const [design, setDesign] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [exhibition, setExhibition] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [redeem, setRedeem] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [upload, setUpload] = useState(null);
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
    notification: false,
    area: false,
  });
  const [staffList, setStaffList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [recentVistors, setRecentVistors] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [imageUri, setImageUri] = useState(
    "https://jewellerapi.quickgst.in/tabBanner/image-d7e532c1-6f79-4f06-ae1d-9afd4567940f.jpg"
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    imageSwitch();
    postRequest("masters/customer/tabtoscanBannerBrowse", {}, token).then((res) => {
      console.log(res);
      if (res.status == 200) {
        const data = res.data.map((item) => {
          return item.url + item.image_path;
        });
        setBannerImages(data);
        
        setImageUri(data[0]);
      }
    });
    postRequest("customervisit/StaffList", {}, token).then((resp) => {
      if (resp.status == 200) {
        setStaffList(resp.data);
      }
    });
    postRequest("customervisit/CategoryList", {}, token).then((resp) => {
      if (resp.status == 200) {
        setCategoryList(resp.data);
      }
    });
    postRequest("customervisit/AreaList", {}, token).then((resp) => {
      if (resp.status == 200) {
        setAreaList(resp.data);
      }
    });
  }, []);

  const imageSwitch = () => {
    var index = bannerImages.indexOf(imageUri);
    if (index >= bannerImages.length - 1) {
      index = -1;
    }
    // console.log(index);
    setImageUri(bannerImages[index + 1]);
    if (imageRef) {
      imageRef.current.animate({ 0: { opacity: 0 }, 1: { opacity: 1 } });
    }
  };

  // --UseEffect For Image Trigger--

  useEffect(() => {
    const ticket = setTimeout(imageSwitch, 20000);
    return () => {
      clearTimeout(ticket);
    };
  }, [imageUri]);

  // --UseEffect For Recent Visits--

  useEffect(() => {
    postRequest("customervisit/getRecentvisiters", {}, token).then((resp) => {
      if (resp.status == 200) {
        setRecentVistors(resp.data);
      }
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
                console.log(resp);
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
                      if (resp.status == 200) {
                        setDetails(resp.data);
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
                      <Text style={MyStyles.text}>{details?.full_name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Mobile</Text>
                      <Text style={MyStyles.text}>{details?.mobile}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Date of Birth</Text>
                      <Text style={MyStyles.text}>{moment(details?.dob).format("DD/MM/YYYY")}</Text>
                    </View>
                  </View>
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Date of Aniversary</Text>
                      <Text style={MyStyles.text}>
                        {moment(details?.doa).format("DD/MM/YYYY") ? details.doa : "N/A"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Profession</Text>
                      <Text style={MyStyles.text}>{details?.profession}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Address</Text>
                      <Text style={MyStyles.text}>{details?.address}</Text>
                    </View>
                  </View>
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Branch Name</Text>
                      <Text style={MyStyles.text}>{details?.branch_name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Staff Name</Text>
                      <Text style={MyStyles.text}>
                        {details.staff_name ? details.staff_name : "N/A"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Ref Name</Text>
                      <Text style={MyStyles.text}>
                        {details.ref_name ? details.ref_name : "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={MyStyles.row}>
                    <View style={{ flex: 1 }}>
                      <Text>Category Name</Text>
                      <Text style={MyStyles.text}>{details?.category_name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Total Visit</Text>
                      <Text style={MyStyles.text}>
                        <Text style={MyStyles.text}>{details?.total_visit}</Text>
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Last Visit</Text>
                      <Text style={MyStyles.text}>{details?.last_visit}</Text>
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
                      if (resp.status == 200) {
                        setHistory(resp.data);
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
                      if (resp.status == 200) {
                        setDesign(resp.data);
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
                      if (resp.status == 200) {
                        setWishlist(resp.data);
                      }
                    });
                    postRequest(
                      "customervisit/getCustomerExhibitionHistory",
                      {
                        customer_id: details?.customer_id,
                      },
                      token
                    ).then((resp) => {
                      if (resp.status == 200) {
                        setExhibition(resp.data);
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
                  borderBottomWidth: 0,
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
                  borderBottomWidth: 0,
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
                  borderBottomWidth: 0,
                  marginHorizontal: 5,
                }}
                onPress={() => setTabs(3)}
              >
                Exhibition
              </Button>
            </View>

            {/*------------ My Design Tab ------------------- */}

            {tabs === 1 && (
               
              <Swiper  showsButtons showsPagination={false}>
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
                          <Text>SKU</Text>
                          <Text style={MyStyles.text}>{item.sku ? item.sku : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Remarks</Text>
                          <Text style={MyStyles.text}>{item.remarks ? item.remarks : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Staff</Text>
                          <Text style={MyStyles.text}>
                            {item.staff_name ? item.staff_name : "N/A"}
                          </Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Date</Text>
                          <Text style={MyStyles.text}>{item.date ? item.date : "N/A"}</Text>
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
                          <Text>Product Name</Text>
                          <Text style={MyStyles.text}>
                            {item.product_name ? item.product_name : "N/A"}
                          </Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>SKU</Text>
                          <Text style={MyStyles.text}>{item.sku ? item.sku : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Remarks</Text>
                          <Text style={MyStyles.text}>{item.remarks ? item.remarks : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Date</Text>
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
                          <Text>Product Name</Text>
                          <Text style={MyStyles.text}>
                            {item.product_name ? item.product_name : "N/A"}
                          </Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>SKU</Text>
                          <Text style={MyStyles.text}>{item.sku ? item.sku : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Remarks</Text>
                          <Text style={MyStyles.text}>{item.remarks ? item.remarks : "N/A"}</Text>
                        </View>
                        <View style={MyStyles.wrapper}>
                          <Text>Date</Text>
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
                      {
                        mobile: modal.mobile,
                      },
                      token
                    ).then((resp) => {
                      if (resp.status == 200) {
                        postRequest(
                          "customervisit/getCustomerVoucherList",
                          {
                            customer_id: resp.data[0].customer_id,
                            branch_id: branchId,
                          },
                          token
                        ).then((resp) => {
                          if (resp.status == 200) {
                            console.log(resp.data)
                            setRedeem(resp.data);
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
            <View>
              <DataTable style={{ height: "100%" }}>
                <DataTable.Header>
                  <DataTable.Title
                    style={{ flex: 1, justifyContent: "center" }}
                    theme={{ colors: { text: "#0818A8" } }}
                  >
                    Voucher
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
                    Offer
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ flex: 1, justifyContent: "center" }}
                    theme={{ colors: { text: "#0818A8" } }}
                  >
                    Issue Date
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ flex: 1, justifyContent: "center" }}
                    theme={{ colors: { text: "#0818A8" } }}
                  >
                    Expiry Date
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ flex: 1, justifyContent: "center" }}
                    theme={{ colors: { text: "#0818A8" } }}
                  >
                    Action
                  </DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={redeem}
                  renderItem={({ item, index }) => (
                    <DataTable.Row>
                      <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                        {item.voucher_name}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                        {item.details}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                        {item.amount}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                        {moment(item.redeem_start_date).format("DD/MM/YYYY")}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                        {moment(item.redeem_end_date).format("DD/MM/YYYY")}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                        <Button
                          mode="contained"
                          compact
                          uppercase={false}
                          color="#ffba3c"
                          onPress={() => {
                            Alert.alert(
                              "Are You Sure ?",
                              "You Want to Redeem this Voucher !",
                              [
                                {
                                  text: "No",

                                  style: "cancel",
                                },
                                {
                                  text: "Yes",
                                  onPress: () => {
                                    postRequest(
                                      "customervisit/insertVoucherRedeem",
                                      {
                                        tran_id: "0",
                                        customer_id: item.customer_id,
                                        voucher_id: item.voucher_id,
                                      },
                                      token
                                    ).then((resp) => {
                                      if (resp.status == 200) {
                                        Alert.alert("Success", "Voucher Redeemed..!");
                                        setModal({ ...modal, redeem: false });
                                        setRedeem(null);
                                      }
                                    });
                                  },
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          Redeem
                        </Button>
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={[MyStyles.row, { marginTop: 10, justifyContent: "flex-end" }]}>
                  <Button
                    style={{ marginRight: "auto" }}
                    mode="contained"
                    color="#DC143C"
                    uppercase={false}
                    compact
                    onPress={() => {
                      setModal({ ...modal, redeem: false });
                      setRedeem(null);
                    }}
                  >
                    Close
                  </Button>
                </View>
              </DataTable>
            </View>
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
                          if (resp.status == 200) {
                            console.log(resp.data[0].customer_id);
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
                        console.log(resp);
                        if (resp.status == 200) {
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
                    if (resp.status == 200) {
                      setModal({ ...modal, area: false });
                      postRequest("customervisit/AreaList", {}, token).then((resp) => {
                        if (resp.status == 200) {
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
                      //console.log(resp);
                      if (resp.status == 200) {
                        postRequest(
                          "customervisit/insertCustomerVisit",
                          {
                            customer_id: resp.data[0].customer_id,
                            tran_id: "0",
                          },
                          token
                        ).then((resp) => {
                          if (resp.status == 200) {
                            setCheckIn(resp.data[0]);
                            setTimeout(() => {
                              setModal({ ...modal, checkIn: false });
                              setCheckIn(null);
                            }, 8000);
                          }
                        });
                      }
                      if (resp.status == 500) {
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
                      if (resp.status == 200) {
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
                <View style={MyStyles.row}>
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
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
                    <TextInput
                      mode="flat"
                      style={{ backgroundColor: "rgba(0,0,0,0)" }}
                      label="Remarks"
                      value={upload?.remarks}
                      onChangeText={(text) => setUpload({ ...upload, remarks: text })}
                    />
                    <DropDown
                      value={upload?.staff_id}
                      ext_lbl="name"
                      ext_val="staff_id"
                      data={staffList}
                      placeholder="Staff"
                      onChange={(val) => setUpload({ ...upload, staff_id: val })}
                    />
                    <TextInput
                      mode="flat"
                      style={{ backgroundColor: "rgba(0,0,0,0)" }}
                      label="Sku"
                      value={upload?.sku}
                      onChangeText={(text) => setUpload({ ...upload, sku: text })}
                    />
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <ImageUpload
                      source={upload?.uri}
                      onClearImage={() =>
                        setUpload({
                          ...upload,
                          image_path: "",
                          image_data: "",
                          uri: require("../../assets/upload.png"),
                        })
                      }
                      onUploadImage={(file) => {
                        //console.log(file.base64)
                        setUpload({
                          ...upload,
                          image_path: `image-${Date.now()}.jpeg`,
                          image_data: file.base64,
                          uri: { uri: file.uri },
                        });
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
              <View style={[MyStyles.row, { margin: 10 }]}>
                <Button
                  mode="contained"
                  color="#DC143C"
                  uppercase={false}
                  compact
                  onPress={() => {
                    setModal({ ...modal, upload: false });
                    setUpload(null);
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
                    postRequest(
                      "customervisit/UploadCustomerImageMob",
                      {
                        base64image: upload.image_data,
                        imageName: upload.image_path,
                      },
                      token
                    ).then((resp) => {
                      if (resp.status == 200) {
                        postRequest("customervisit/insertCustomerUpload", upload, token).then(
                          (resp) => {
                            //console.log(resp);
                            if (resp.status == 200) {
                              setModal({ ...modal, upload: false });
                              setUpload(null);
                            }
                          }
                        );
                      }
                    });
                  }}
                >
                  Continue
                </Button>
              </View>
            </View>
          )
        }
      />

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
                  <View style={{flexGrow:1, padding:5}}>
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
                    <View style={{display:"flex", flexDirection:"row"}}>
                    {[...Array(item.f_count)].map((el, index) => <Text key={index}>⭐</Text>)}
                    </View>
                    <View style={{ width:250}}>
                    <Text
                      style={{
                        color: "#FFF",
                        wordWrap:'break-word'
                      }}
                    >
                      {item.f_service}
                    </Text>
                    </View>
                    </>
                  )}
                  
                    {item.notification_type!="Feedback" && (
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
