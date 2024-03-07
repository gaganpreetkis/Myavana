import React, { Component } from "react";
import { Keyboard } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//import Icon from "react-native-vector-icons/AntDesign";
import { moderateScale } from "../../../helpers/ResponsiveFonts";
import Loader from "../../common/loader";
import Colors from "../../../constants/colors";
import SafeAreaView from "../../../components/common/SafeView";
import ImageButton from "../../common/ImageButton";
import Header from "../../../components/common/HeaderGrey";
import CountryPicker from "react-native-country-picker-modal";
import { baseUrlLive } from "../../../constants/url";
import CheckBox from "react-native-check-box";
import analytics from "@react-native-firebase/analytics";
import colors from "../../../constants/colors";
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repassword: "",
      hairkitSerialNumber: "",
      phone: "",
      isLoading: false,
      statusCode: "",
      countryDialCode: "1",
      countryDisplay: "+1 US",
      countryCode: undefined,
      withFilter: true,
      withFlag: true,
      withCountryNameButton: true,
      withAlphaFilter: true,
      withCallingCode: true,
      withEmoji: true,
      visible: false,
      passwordSecureTextEntry: false,
      reTypePasswordSecureTextEntry: false,
      isChecked: false,
    };
  }
  static navigationOptions = {
    headerTransparent: true,
    gestureEnabled: false,
    disabledBackGesture: false,
    headerShown: false,
  };

  registerHandler = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      repassword,
      phone,
      hairkitSerialNumber,
      countryDialCode,
      isChecked,
    } = this.state;
    console.log("isChecked", isChecked);
    if (!firstName) {
      Alert.alert("Warning", "Please enter your First name");
    } else if (!lastName) {
      Alert.alert("Warning", "Please enter your Last name");
    } else if (!email) {
      Alert.alert("Warning", "Please check your email");
    } else if (!password) {
      Alert.alert("Warning", "Please check your password");
    } else if (!repassword) {
      Alert.alert("Warning", "Please check your confirm password");
    }
    //  else if (!isChecked) {
    //   Alert.alert("Warning", "Please select customer type");
    // }
    else if (!phone) {
      Alert.alert("Warning", "Please check your phone number");
    } else {
      const upperCaseRegex = /^(?=.*[A-Z])\S{1,}/;
      if (!this.validateEmail(email)) {
        Alert.alert(`Warning`, `Please enter valid email address.`, [
          { text: "OK" },
        ]);
      } else if (upperCaseRegex.test(password) === false) {
        Alert.alert(
          "Oh No!",
          "Your password must to have one uppercase letter. Please try again."
        );
      } else if (password !== repassword) {
        Alert.alert("Oh No!", "Your passwords do not match. Please try again.");
      } else {
        this.setState({
          isLoading: true,
        });

        const obj = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          phoneNo: phone,
          CountryCode: parseInt(countryDialCode),
          BuyHairKit: isChecked,
          KitSerialNumber: isChecked ? hairkitSerialNumber : "",
        };
        this.setState({
          isLoading: true,
        });
        console.log("obj is", obj);
        fetch(`${baseUrlLive}Account/signup`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then((response) => {
            this.setState({
              statusCode: response.status,
            });
            return response.json();
          })
          .then((responseJson) => {
            this.setState({
              isLoading: false,
            });
            if (this.state.statusCode === 400) {
              Alert.alert("Alert", responseJson.value);
            } else if (this.state.statusCode === 200) {
              this.props.register(obj);
              this.getFBAnalyticsData();
              this.props.navigation.navigate("Confirm", {
                isCheckedSerialNumber: isChecked,
                view: "register",
              });
            }
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
            });
            Alert.alert(
              "Alert",
              "Something went wrong!",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ],
              { cancelable: false }
            );
          });
      }
    }
  };
  getFBAnalyticsData = async () => {
    await analytics().logEvent("Sign_up", {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phoneNo: this.state.phone,
    });
  };
  back = () => {
    //this.props.navigation.pop();
    if (this.props.navigation.getParam("view", "") === "login") {
      this.props.navigation.navigate("Login");
    } else {
      this.props.navigation.navigate("WelcomeStart");
    }
  };
  validateEmail = (email) => {
    const emailRegex = new RegExp(
      "^[a-z0-9_.-]+.?[a-z0-9_-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?[.][a-z]{2,61}(?:.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$"
    );
    return emailRegex.test(String(email).toLowerCase());
  };
  render() {
    const { navigate } = this.props.navigation;

    const onSelect = (country) => {
      this.setState({
        countryDisplay: "+" + country.callingCode + " " + country.name,
        countryDialCode: country.callingCode,
        visible: false,
      });
    };

    const onClose = () => {
      this.setState({ visible: false });
    };

    const {
      countryCode,
      withFilter,
      withFlag,
      withCountryNameButton,
      withAlphaFilter,
      withCallingCode,
      withEmoji,
      visible,
      countryDisplay,
    } = this.state;
    return (
      <SafeAreaView colorTop={Colors.pinkLight} colorBottom={Colors.white}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.pinkLight,
            justifyContent: "center",
          }}
        >
          <Loader isLoading={this.state.isLoading} />
          <Header backHandler={this.back}></Header>
          {/* <Image
                    style={styles.imageStyle}
                    source={require("../../../assets/images/mainIcon.png")}
                /> */}
          <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <Text style={styles.topTextStyle}>
              Enter your information below to register:
            </Text>
            <TextInput
              onChangeText={(firstName) =>
                this.setState({ firstName: firstName })
              }
              autoCapitalize={"sentences"}
              style={styles.lgn_txtInput}
              placeholder={"First Name"}
              underlineColorAndroid={"rgba(0,0,0,0)"}
              autoCorrect={false}
              borderWidth={1}
              placeholderTextColor={Colors.placeHolderColor}
            />
            <TextInput
              onChangeText={(lastName) => this.setState({ lastName: lastName })}
              autoCapitalize={"sentences"}
              style={styles.lgn_txtInput}
              placeholder={"Last Name"}
              underlineColorAndroid={"rgba(0,0,0,0)"}
              autoCorrect={false}
              borderWidth={1}
              placeholderTextColor={Colors.placeHolderColor}
            />
            <TextInput
              onChangeText={(email) => this.setState({ email: email })}
              keyboardType={"email-address"}
              autoCapitalize="none"
              style={styles.lgn_txtInput}
              placeholder={"Email"}
              underlineColorAndroid={"rgba(0,0,0,0)"}
              autoCorrect={false}
              borderWidth={1}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
              placeholderTextColor={Colors.placeHolderColor}
            />
            <TextInput
              onChangeText={(password) => this.setState({ password: password })}
              secureTextEntry={this.state.passwordSecureTextEntry}
              style={styles.lgn_txtInput}
              placeholder={"Password"}
              underlineColorAndroid={"rgba(0,0,0,0)"}
              autoCorrect={false}
              borderWidth={1}
              blurOnSubmit={false}
              onFocus={() => {
                this.setState({ passwordSecureTextEntry: true });
              }}
              onBlur={() => {
                this.setState({ passwordSecureTextEntry: true });
              }}
              returnKeyType="next"
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholderTextColor={Colors.placeHolderColor}
            />
            <TextInput
              onChangeText={(repassword) =>
                this.setState({ repassword: repassword })
              }
              secureTextEntry={this.state.reTypePasswordSecureTextEntry}
              style={styles.lgn_txtInput}
              placeholder={"Re-Type Password"}
              underlineColorAndroid={"rgba(0,0,0,0)"}
              autoCorrect={false}
              borderWidth={1}
              blurOnSubmit={false}
              returnKeyType="next"
              onFocus={() => {
                this.setState({ reTypePasswordSecureTextEntry: true });
              }}
              onBlur={() => {
                this.setState({ reTypePasswordSecureTextEntry: true });
              }}
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholderTextColor={Colors.placeHolderColor}
            />

            <View style={[styles.rowStyle]}>
              <CheckBox
                style={{
                  flex: 1,
                  padding: 10,
                  marginLeft: moderateScale(8),
                }}
                onClick={() => {
                  this.setState({
                    isChecked: !this.state.isChecked,
                  });
                  this.setState({
                    isValue: "true",
                  });
                }}
                isChecked={this.state.isChecked}
                rightText={"I already purchased a Hair Kit."}
                rightTextStyle={{
                  fontSize: moderateScale(16),
                  marginTop: moderateScale(3),
                  fontFamily: "AbsaraSans-Regular",
                  color: Colors.blackTitleFontColor,
                }}
              />
            </View>
            {this.state.isChecked === true ? (
              <TextInput
                onChangeText={(hairkitSerialNumber) =>
                  this.setState({ hairkitSerialNumber: hairkitSerialNumber })
                }
                autoCapitalize={"sentences"}
                style={styles.lgn_txtInput}
                placeholder={"Hair Kit Serial Number"}
                value={this.state.hairkitSerialNumber}
                underlineColorAndroid={"rgba(0,0,0,0)"}
                autoCorrect={false}
                borderWidth={1}
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholderTextColor={Colors.placeHolderColor}
              />
            ) : null}

            <View
              style={{
                flexDirection: "row",
                height: moderateScale(42),
                width: "95%",
                marginTop: moderateScale(4),
              }}
            >
              <View style={{ width: "30%", marginStart: moderateScale(4) }}>
                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={() => this.setState({ visible: true })}
                >
                  <TextInput
                    pointerEvents="none"
                    // autoCapitalize={"none"}
                    autoCapitalize={"sentences"}
                    // onPress = {() => this.setState({visible: true})}
                    onFocus={() => this.setState({ visible: true })}
                    // editable = {false}
                    style={[
                      styles.lgn_txtInput,
                      (width = "100%"),
                      (color = "#000"),
                      {
                        marginTop: moderateScale(4),
                      },
                    ]}
                    placeholder={"Country Code"}
                    value={countryDisplay}
                    underlineColorAndroid={"rgba(0,0,0,0)"}
                    autoCorrect={false}
                    borderWidth={1}
                    placeholderTextColor={Colors.Black}
                  />
                </TouchableOpacity>
                <View>
                  {visible && (
                    <CountryPicker
                      {...{
                        countryCode,
                        withFilter,
                        withFlag,
                        withAlphaFilter,
                        withCallingCode,
                        withEmoji,
                        onSelect,
                        onClose,
                      }}
                      visible={true}
                    />
                  )}
                </View>
              </View>
              <View style={{ width: "70%" }}>
                <TextInput
                  onChangeText={(phone) => this.setState({ phone: phone })}
                  autoCapitalize={"sentences"}
                  keyboardType={"numeric"}
                  maxLength={10}
                  style={[
                    styles.lgn_txtInput,
                    {
                      marginRight: moderateScale(4),
                      marginTop: moderateScale(4),
                    },
                  ]}
                  placeholder={"Phone Number"}
                  underlineColorAndroid={"rgba(0,0,0,0)"}
                  autoCorrect={false}
                  borderWidth={1}
                  placeholderTextColor={Colors.placeHolderColor}
                />
              </View>
            </View>

            <View
              style={{
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: moderateScale(20),
              }}
            >
              <Text
                style={{
                  lineHeight: 18,
                  textAlign: "center",
                  fontFamily: "BentonSans-Regular",
                  fontSize: moderateScale(11),
                  color: Colors.profileTextColor,
                }}
              >
                Your phone number is required so that we may contact you in
                regards to your hair consultation and support while using our
                app. Your privacy is very important to us; we do not share your
                phone number with other companies.
              </Text>
            </View>
            <View
              style={{
                width: "85%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: moderateScale(16),
              }}
            >
              <Text
                style={{
                  lineHeight: 18,
                  textAlign: "center",
                  fontFamily: "BentonSans-Regular",
                  fontSize: moderateScale(11),
                  color: Colors.profileTextColor,
                }}
              >
                Registering will enable you to access the functionality of our
                app from any of your devices.
              </Text>
            </View>
            <View style={styles.submitButtonContainer}>
              <ImageButton
                bgColor={Colors.blackButtonColor}
                width="100%"
                height={moderateScale(42)}
                borderRadius={moderateScale(2)}
                content="SUBMIT"
                fontSize={16}
                marginLeft={moderateScale(15)}
                onPress={this.registerHandler}
              />
            </View>
            <View style={styles.signUpContainer}>
              <Text style={styles.tosTextStyle}>
                By registering to MYAVANA, you accept our
              </Text>
              <TouchableOpacity onPress={() => navigate("Tos")}>
                <Text style={styles.termsTextStyle}>
                  &nbsp;Terms of Service
                </Text>
              </TouchableOpacity>
              {/* <Text style={styles.tosTextStyle}>&nbsp;and</Text> */}
            </View>
            <View style={styles.signUpContainer}>
              <TouchableOpacity onPress={() => navigate("Privacy")}>
                <Text style={styles.privacyPolicyTextStyle}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: moderateScale(20) }} />
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
  topTextStyle: {
    fontSize: moderateScale(16),
    marginTop: moderateScale(34),
    fontFamily: "AbsaraSans-Regular",
    color: Colors.blackTitleFontColor,
  },
  imageContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  insideConatinerTwoInputs: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
  },
  lgn_txtInput: {
    width: "90%",
    height: moderateScale(42),
    borderRadius: 3,
    backgroundColor: "white",
    opacity: 0.8,
    padding: 10,
    fontSize: moderateScale(16),
    marginTop: moderateScale(8),
    fontFamily: "AbsaraSans-Regular",
    borderColor: Colors.fadeBorder,
    borderWidth: 0.5,
    justifyContent: "center",
    alignSelf: "center",
  },
  submitButtonContainer: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: moderateScale(16),
  },
  maskOutter: {
    position: "absolute",
    alignSelf: "flex-start",
    marginTop: moderateScale(100),
    marginLeft: moderateScale(100),
    opacity: moderateScale(0.5),
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tosTextStyle: {
    paddingTop: 10,
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-Regular",
    fontSize: Platform.OS === "android" ? moderateScale(13) : moderateScale(0),
  },
  termsTextStyle: {
    paddingTop: 10,
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-Medium",
    fontSize: Platform.OS === "android" ? moderateScale(14) : moderateScale(0),
  },
  privacyPolicyTextStyle: {
    paddingTop: 5,
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-Medium",
    fontSize: Platform.OS === "android" ? moderateScale(14) : moderateScale(0),
  },
  imageStyle: {
    resizeMode: "contain",
    width: "45%",
    height: 40,
    alignSelf: "center",
    marginTop: moderateScale(16),
  },
  rowStyle: {
    flexDirection: "row",
    // marginTop: moderateScale(8),
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  rectangleImage: {
    resizeMode: "contain",
    width: 20,
    height: 20,
    alignSelf: "center",
    marginRight: 20,
  },
});
