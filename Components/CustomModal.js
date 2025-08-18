import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Portal, Modal } from "react-native-paper";
import MyStyles from "../Styles/MyStyles";

const CustomModal = ({ visible, content, onDismiss, contentContainerStyle, style }) => {
  return (
    <Portal>
      <Modal
        dismissable={false}
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={ {
          backgroundColor: contentContainerStyle?.backgroundColor || "rgba(255,255,255,0.85)",
          width: contentContainerStyle?.width || "70%",
          maxHeight: contentContainerStyle?.maxHeight || "90%",
          height: contentContainerStyle?.height || "90%",
          marginLeft: contentContainerStyle?.marginLeft || "auto",
          marginBottom: contentContainerStyle?.marginBottom || "auto",
          marginRight: contentContainerStyle?.marginRight || "auto",
          borderRadius: contentContainerStyle?.borderRadius || 2,
          paddingHorizontal: contentContainerStyle?.paddingHorizontal || 5,
          paddingVertical: contentContainerStyle?.paddingVertical || 5,

        }}
      >
        <View
          style={ {
            borderWidth: style?.borderWidth || 1,
            borderColor: style?.borderColor || "#555",
            height: style?.height || "auto",
            paddingHorizontal: style?.paddingHorizontal || 10,
            paddingVertical: style?.paddingVertical || 5,
          }}
        >
          {content}
        </View>
      </Modal>
    </Portal>
  );
};

export default CustomModal;
