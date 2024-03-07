import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { moderateScale } from "../../../helpers/ResponsiveFonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImageButton from "../../common/ImageButton";
import Loader from "../../common/loader";
import Colors from "../../../constants/colors";
import SafeAreaView from "../../../components/common/SafeView";
import Header from "../../../components/common/HeaderGrey";
import { baseUrlLive } from "../../../constants/url";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isLoading: false,
    };
  }
  static navigationOptions = {
    headerTransparent: true,
    gestureEnabled: false,
    disabledBackGesture: false,
    headerShown: false,
  };
  loginView = () => {
    this.props.navigation.pop();
  };
  forgotHandler = () => {
    const { email } = this.state;
    let emailRegex =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (email === "") {
      Alert.alert(
        "Alert",
        "Please enter your email",
        [
          // {
          //   text: "Cancel",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel",
          // },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    } else {
      if (!emailRegex.test(email)) {
        Alert.alert(``, `Please enter valid email address.`, [{ text: "OK" }]);
      } else {
        this.setState({ isLoading: true });
        fetch(`${baseUrlLive}Account/forgetpassword?email=${email}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((responseJson) => {
            if (
              responseJson &&
              responseJson.statusCode &&
              responseJson.statusCode === 200
            ) {
              Alert.alert(
                "Alert",
                responseJson.value,
                [
                  // {
                  //   text: "Cancel",
                  //   onPress: () => console.log("ok"),
                  //   style: "cancel",
                  // },
                  { text: "OK", onPress: () => console.log("ok") },
                ],
                { cancelable: false }
              );
              this.setState({ isLoading: false });
              this.props.navigation.navigate("Reset", {
                email: this.state.email,
              });
            } else if (
              responseJson &&
              responseJson.statusCode &&
              responseJson.statusCode === 400
            ) {
              this.setState({ isLoading: false });
              Alert.alert("Alert", responseJson.value);
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
            Alert.alert("Oops", "Something went wrong,please try again.");
          });
      }
    }
  };
  back = () => {
    this.props.navigation.pop();
  };
  render() {
    return (
      <SafeAreaView
        colorTop={Colors.cloundBackgroundColor}
        colorBottom={Colors.white}
      >
        <ImageBackground
          source={require("../../../assets/images/gradientBackground.jpg")}
          style={{ flex: 1, width: "100%", height: "100%" }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Loader isLoading={this.state.isLoading} />
            <Header backHandler={this.back}></Header>
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
              <View style={styles.contentStyle}>
                <Text style={styles.textStyle}>
                  Please enter your email to reset your password:
                </Text>
              </View>
              <TextInput
                onChangeText={(email) => this.setState({ email: email })}
                keyboardType={"email-address"}
                autoCapitalize={"none"}
                style={styles.lgn_txtInput}
                placeholder={"Email"}
                underlineColorAndroid={"rgba(0,0,0,0)"}
                autoCorrect={false}
                borderWidth={1}
                placeholderTextColor={Colors.placeHolderColor}
              />
              <View style={styles.resetButtonContainer}>
                <ImageButton
                  bgColor={Colors.blackButtonColor}
                  width="100%"
                  height={moderateScale(42)}
                  borderRadius={moderateScale(2)}
                  content="RESET"
                  fontSize={16}
                  marginLeft={moderateScale(15)}
                  onPress={this.forgotHandler}
                />
              </View>
              <View style={{ flex: 1 }}></View>
              <View
                style={{ alignItems: "center", justifyContent: "flex-end" }}
              >
                <Image
                  style={{
                    resizeMode: "cover",
                    width: screenWidth,
                    height:
                      screenHeight > 730
                        ? screenHeight / 1.8
                        : screenHeight / 1.9,
                  }}
                  source={require("../../../assets/images/passwordResetModels.png")}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    marginLeft: "-10%",
    resizeMode: "contain",
    width: "55%",
  },
  lgn_txtInput: {
    width: "90%",
    height: moderateScale(42),
    borderRadius: 3,
    backgroundColor: "white",
    opacity: 0.8,
    padding: 10,
    fontSize: moderateScale(16),
    marginTop: moderateScale(10),
    fontFamily: "AbsaraSans-Regular",
    borderColor: Colors.fadeBorder,
    borderWidth: 0.5,
    justifyContent: "center",
    alignSelf: "center",
  },
  resetButtonContainer: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: moderateScale(20),
  },
  maskOutter: {
    position: "absolute",
    alignSelf: "flex-start",
    marginTop: moderateScale(100),
    marginLeft: moderateScale(100),
    opacity: moderateScale(0.5),
  },
  contentStyle: {
    width: "70%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: screenHeight < 650 ? moderateScale(10) : moderateScale(20),
    marginBottom: moderateScale(5),
  },
  textStyle: {
    textAlign: "center",
    color: Colors.blackTitleFontColor,
    fontFamily: "AbsaraSans-Regular",
    fontSize: moderateScale(16),
    marginTop: moderateScale(12),
  },
});
