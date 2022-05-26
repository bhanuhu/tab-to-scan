import React from "react";
import { Alert, Image, SafeAreaView, View } from "react-native";
import { IconButton } from "react-native-paper";
import MyStyles from "../Styles/MyStyles";
import { AuthContext } from "./Context";

const Header = ({ logoPath, right }) => {
  const { signOut } = React.useContext(AuthContext);

  return (
    <SafeAreaView
      style={{
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        //backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <IconButton
        icon="exit-to-app"
        color={MyStyles.primaryColor.backgroundColor}
        size={20}
        onPress={() => signOut()}
      />

      <Image
        style={{ resizeMode: "contain", width: 200, height: 50 }}
        source={
          logoPath
            ? { uri: "https://jewellerapi.quickgst.in/BranchLogo/" + logoPath }
            : require("../assets/logo.png")
        }
      />
      {/* <IconButton
        icon="bell"
        color={MyStyles.primaryColor.backgroundColor}
        size={30}
        onPress={() => Alert.alert("Coming Soon...")}
      /> */}
      {right}
    </SafeAreaView>
  );
};

export default Header;
