import React, { useState, useEffect } from "react";
import { Alert, Image, ImageBackground, SafeAreaView, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { AuthContext } from "../../Components/Context";
import { authRequest } from "../../Services/RequestServices";
import MyStyles from "../../Styles/MyStyles";

const Login = () => {
  const { signIn } = React.useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [param, setParam] = useState({
    user_name: "",
    password: "",
    otp: "",
  });

  return (
    <ImageBackground style={{ flex: 1 }} source={require("../../assets/login-bg.jpg")}>
      <SafeAreaView style={[MyStyles.container, {justifyContent:'center' }]}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 350, resizeMode: "contain", marginBottom: 40 }}
          />
          <Card
            style={{
              width: 350,
              background:'none'
            }}
          >
            <Card.Content>
              <TextInput
                mode="flat"
                label="Mobile"
                maxLength={10}
                keyboardType="number-pad"
                disabled={loading}
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.3)",
                marginBottom:20, }}
                left={
                  <TextInput.Icon color="#555" size={25} style={{ marginBottom: 0 }} name="phone" />
                }
                value={param.user_name}
                onChangeText={(text) => setParam({ ...param, user_name: text })}
              />
              {!otp ? (
                <TextInput
                  mode="flat"
                  label="Password"
                  secureTextEntry={secureText}
                  disabled={loading}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.3)",}}
                  left={
                    <TextInput.Icon
                      color="#555"
                      size={25}
                      style={{ marginBottom: 0 }}
                      name="lock"
                    />
                  }
                  right={
                    <TextInput.Icon
                      color="#aaa"
                      size={25}
                      style={{ marginBottom: 0 }}
                      name={secureText ? "eye" : "eye-off"}
                      onPress={() => setSecureText(!secureText)}
                      forceTextInputFocus={false}
                    />
                  }
                  value={param.password}
                  onChangeText={(text) => setParam({ ...param, password: text })}
                />
              ) : (
                <TextInput
                  mode="flat"
                  label="Otp"
                  maxLength={6}
                  keyboardType="number-pad"
                  disabled={loading}
                  style={{ backgroundColor: "rgba(255,255,255,0)" }}
                  left={
                    <TextInput.Icon
                      color="#555"
                      size={25}
                      style={{ marginBottom: 0 }}
                      name="lock"
                    />
                  }
                  value={param.otp}
                  onChangeText={(text) => setParam({ ...param, otp: text })}
                />
              )}
              <View style={[MyStyles.row, { justifyContent: "center", marginTop: 40 }]}>
                <Button
                  color="#ffba3c"
                  mode="contained"
                  uppercase={false}
                  loading={loading}
                  disabled={loading}
                  onPress={() => {
                    setLoading(true);
                    if (otp) {
                      authRequest("branch/token", param).then((resp) => {
                        console.log('🚀 Response:------------>>>>>', resp);
                        if (resp.status == 200) {
                          signIn({
                            token: resp.data.access_token,
                            branchName: resp.data.company_name,
                            branchId: resp.data.branch_id,
                            logoPath: resp.data.logo,
                          });
                        } else {
                          Alert.alert(
                            "Error !",
                            "Oops! \nSeems like we run into some Server Error"
                          );
                        }
                        setLoading(false);
                      });
                    } else {
                      authRequest("branch/login", param).then((resp) => {
                        if (resp.status == 200) {
                          if (resp.data[0].valid) {
                            setOtp(true);
                          } else {
                            Alert.alert("Error !", resp.error);
                          }
                        } else {
                          Alert.alert(
                            "Error !",
                            "Oops! \nSeems like we run into some Server Error"
                          );
                        }
                        setLoading(false);
                      });
                    }
                  }}
                >
                  {!otp ? "Login" : "Submit"}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Login;
