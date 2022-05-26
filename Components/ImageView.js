import React from "react";
import { Image, TouchableHighlight } from "react-native";
import { Portal, Modal, IconButton } from "react-native-paper";

const ImageView = (props) => {
  const [modal, setModal] = React.useState(false);

  return (
    <>
      <Portal>
        <Modal
          visible={modal}
          dismissable={false}
          transparent={true}
          onDismiss={() => {
            setModal(false);
          }}
        >
          <IconButton
            icon="close"
            size={30}
            color="#fff"
            style={{ alignSelf: "flex-end" }}
            onPress={() => setModal(false)}
          />

          <Image
            source={props.source}
            style={{
              width: "100%",
              height: "80%",
              resizeMode: "contain",
            }}
          />
        </Modal>
      </Portal>
      <TouchableHighlight
        style={props.style}
        onPress={() => {
          setModal(true);
        }}
      >
        <Image {...props} />
      </TouchableHighlight>
    </>
  );
};

export default ImageView;
