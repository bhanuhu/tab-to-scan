import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  configureFonts,
} from "react-native-paper";
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "./Components/Context";
import Dashboard from "./Screens/Dashboard/Dashboard";
import Login from "./Screens/Auth/Login";


export default function App() {
  const [fontsLoaded, setFontLoaded] = useState(false);

  // const getFonts = () =>
  //   Font.loadAsync({
  //     "ElMessiri-regular": require("./assets/fonts/ElmessiriRegular.otf"),
  //     "ElMessiri-medium": require("./assets/fonts/ElmessiriMedium.otf"),
  //     "ElMessiri-bold": require("./assets/fonts/ElMessiriBold.otf"),
  //   });

  // const fontConfig = {
  //   default: {
  //     regular: {
  //       fontFamily: "ElMessiri-regular",
  //     },
  //     medium: {
  //       fontFamily: "ElMessiri-medium",
  //     },
  //     bold: {
  //       fontFamily: "ElMessiri-bold",
  //     },
  //   },
  // };

  const PaperTheme = {
    ...PaperDefaultTheme,
    mode: "adaptive",

    colors: {
      ...PaperDefaultTheme.colors,
      primary: "#555",
      accent: "#fff",
    },
    // fonts: configureFonts(fontConfig),
  };

  const NavigationTheme = {
    ...NavigationDefaultTheme,
  };

const initialLoginState = {
  isLoading: true,
  branchName: null,
  token: null,
  branchId: null,
  logoPath: null,
};

const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN":
      return {
        ...prevState,
        token: action.token,
        branchName: action.branch_name,
        branchId: action.branch_id,
        logoPath: action.logo_path,

        isLoading: false,
      };
    case "LOGIN":
      return {
        ...prevState,
        token: action.token,
        branchName: action.branch_name,
        branchId: action.branch_id,
        logoPath: action.logo_path,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        ...prevState,
        token: null,
        branchName: null,
        branchId: null,
        logoPath: null,
        isLoading: false,
      };
  }
};

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
    signIn: async ({ branchName, branchId, logoPath, token }) => {
      try {
        await SecureStore.setItemAsync("branchName", branchName);
        await SecureStore.setItemAsync("branchId", String(branchId));
        await SecureStore.setItemAsync("logoPath", logoPath);
        await SecureStore.setItemAsync("token", token);
      } catch (e) {
        console.log(e);
      }
      dispatch({
        type: "LOGIN",
        token: token,
        branch_name: branchName,
        branch_id: branchId,
        logo_path: logoPath,
      });
    },
    signOut: async () => {
      try {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("branchName");
        await SecureStore.deleteItemAsync("branchId");
        await SecureStore.deleteItemAsync("logoPath");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },
    getDetails: async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const branchName = await SecureStore.getItemAsync("branchName");
        const branchId = await SecureStore.getItemAsync("branchId");
        const logoPath = await SecureStore.getItemAsync("logoPath");
        return {
          branch_name: branchName,
          branch_id: branchId,
          token: token,
          logo_path: logoPath,
        };
      } catch (e) {
        console.log(e);
      }
    },
    }),
    []
  );

  const Retrieve = async () => {
    let token = null;
    let branchId = null;
    let branchName;
    let logoPath;

    try {
      token = await SecureStore.getItemAsync("token");
      branchName = await SecureStore.getItemAsync("branchName");
      branchId = await SecureStore.getItemAsync("branchId");
      logoPath = await SecureStore.getItemAsync("logoPath");
    } catch (e) {
      console.log(e);
    }
    await dispatch({
      type: "RETRIEVE_TOKEN",
      token: token,
      branch_name: branchName,
      branch_id: branchId,
      logo_path: logoPath,
    });
  };

  React.useEffect(() => {
    Retrieve();
    
  }, []);

  if (fontsLoaded || !loginState.isLoading) {
    return (
      <PaperProvider theme={PaperTheme}>
        <AuthContext.Provider value={authContext}>
          <StatusBar hidden={true} style="light" barStyle={"default"} />
          <NavigationContainer theme={NavigationTheme}>
            {loginState.token ? <Dashboard loginDetails={loginState} /> : <Login />}
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    );
  // } else {
  //   return (
  //     <SplashScreen
  //       // startAsync={getFonts}
  //       onError={console.warn}
  //       // onFinish={() => setFontLoaded(true)}
  //     />
  //   );
  }
}
