import React from "react";
import { StyleSheet, StatusBar, Platform } from "react-native";

const MyStyles = StyleSheet.create({
  primaryColor: { backgroundColor: "rgb(255,235,183)" },
  secondaryColor: { backgroundColor: "rgb(255,255,255)" },
  barHeight: Platform.OS === "android" ? StatusBar.currentHeight : 0,

  container: {
    flex: 1,
    //backgroundColor: "#000",
  },

  wrapper: {
    marginVertical: 5,
  },

  centerAlign: {
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    //backgroundColor: "rgba(0,0,0,0.5);",
  },

  modal: {
    marginTop: "auto",
    backgroundColor: "white",
    marginBottom: "auto",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },

  cardContainer: {
    borderRadius: 10,
    padding: 20,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: 5,
  },

  title: { color: "#22356A", fontWeight: "bold", fontSize: 25 },

  text: {
    fontSize: 18,
    // fontFamily: "ElMessiri-bold"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
});

export default MyStyles;
