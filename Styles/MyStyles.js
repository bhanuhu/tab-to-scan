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

  /**
   * A style for a row that has its children laid out horizontally, with
   * justification and alignment set to center.
   */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#000',
      marginVertical: 10,
    },
    checkboxContainer: {
      flexDirection: 'row',
      gap: 24,
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      
    },
    checkbox: {
      height: 22,
      width: 22,
      borderWidth: 2,
      borderColor: '#B0B0B0', // light gray border
      borderRadius: 4,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    checked: {
      backgroundColor: '#007AFF', // blue highlight
      borderColor: '#007AFF',
    },
    tick: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 16,
    },
    checkboxLabel: {
      fontSize: 16,
      color: '#000',
    },
    rradioContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radio: {
      height: 18,
      width: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: '#555',
      marginRight: 8,
      marginTop: 2,
    },
    radioSelected: {
      height: 18,
      width: 18,
      borderRadius: 9,
      borderWidth: 6,
      borderColor: '#007AFF',
      marginRight: 8,
    },
    radioLabel: {
      fontSize: 16,
    },
    dropdown: {
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      fontSize: 12,
      paddingBottom:10,
      minWidth: 150,
      backgroundColor: 'white',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullModal: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      elevation: 5,
    },
    modalHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    modalSection: {
      marginTop: 15,
    },
    modalLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
    modalRadioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    modalCheckboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
    modalCancelBtn: {
      marginRight: 15,
      padding: 10,
    },
    modalCancelText: {
      color: '#666',
      fontWeight: '600',
    },
    modalSaveBtn: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 6,
    },
    modalSaveText: {
      color: '#fff',
      fontWeight: '600',
    },
    button:{
      borderRadius: 6,
      marginHorizontal: 10,
      color:"#3699fe",
    }
  
    
});

export default MyStyles;
