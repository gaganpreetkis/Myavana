import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { moderateScale } from "../../../helpers/ResponsiveFonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImageButton from "../../common/ImageButton";
import Loader from "../../common/loader";
import Colors from "../../../constants/colors";
import SafeAreaView from "../../../components/common/SafeView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import analytics from "@react-native-firebase/analytics";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  static navigationOptions = {
    headerTransparent: true,
    gestureEnabled: false,
    disabledBackGesture: false,
    headerShown: false,
  };

  componentDidMount() {
    if (__DEV__) {
      //mktest012@yopmail.com
      //mukesh27oct@yopmail.com
      // this.setState({ email: "manisha@mailinator.com" });
      // this.setState({ password: "Misha@123" });
      // this.setState({ email: "ktest201@yopmail.com" });
      // this.setState({ password: "Test@123" });
      // this.setState({ email: "mktest44@yopmail.com" });
      // this.setState({ password: "Test@123" });
      // this.setState({ email: "mktest058@yopmail.com" });
      // this.setState({ password: "Test@123" });

      // this.setState({ email: "test10@yopmail.com" });
      // this.setState({ password: "Test@123" });

      //staging
      // this.setState({ email: "manisha@mailinator.com" });
      // this.setState({ password: "Misha@123" });
      // this.setState({ email: "mktest08jan@yopmail.com" });
      // this.setState({ password: "Test@123" });
      this.setState({ email: "mktest061@yopmail.com" });
      this.setState({ password: "Test@123" });

      // shopify payment user
      // this.setState({ email: "testmobonetime@mailinator.com" });
      // this.setState({ password: "Test@1234" });
    }
    //this.getSaveData();
    // const data = this.props.user;
    // if (data && data.access_token) {
    //     this.setState({ isLoading: true });
    //     const token = `Bearer ${data.access_token}`;
    //     this.props.subscriptionPlanAction(token);
    //     this.props.paymentStatusAction(token, () => {
    //         const { paymentStatus } = this.props;
    //         this.setState({ isLoading: false });
    //         if (paymentStatus === true) {
    //             this.props.navigation.navigate('Plan');
    //         } else if (paymentStatus === null) {
    //             this.setState({ isLoading: false });
    //         } else {
    //             this.setState({ isLoading: false });
    //             //this.props.navigation.navigate('ResponseUi');
    //             this.props.navigation.navigate('HomeNew');
    //         }
    //         this.setState({ isLoading: false });
    //     });
    // } else {
    //     this.setState({ isLoading: false });
    // }
  }

  submitHandler = () => {
    /* this.props.navigation.navigate("ResponseUi"); // ResponseUi , QuestionnaireStep1
    if (true) {
      return;
    } */
    // alert('hh=>'+screenHeight);

    let emailRegex =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const user = {
      userName: this.state.email,
      password: this.state.password,
    };
    if (user.userName === "") {
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
      if (!emailRegex.test(user.userName)) {
        Alert.alert(``, `Please enter valid email address.`, [{ text: "OK" }]);
      } else if (user.password === "" && user.userName !== "") {
        //  this.setState({ isLoading: true });
        Alert.alert(
          "Alert",
          "Please check your password",
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
      } else if (this.state.email !== "" && this.state.password !== "") {
        this.setState({ isLoading: true });
        this.props.loginUserAction(user, () => {
          const data = this.props.user;
          console.log(
            "email:-" +
              this.state.email +
              " password:-" +
              this.state.password +
              " => " +
              JSON.stringify(data)
          );
          console.log("DataName:", data.Name);
          if (data && data.loginFail === "loginFail") {
            this.setState({ isLoading: false });
            Alert.alert("Error", "Something went wrong, Please try again.");
          } else if (data === "Invalid Credentials") {
            this.setState({ isLoading: false });
            Alert.alert("Error", "Please check your login details.");
          } else if (data === "Please activate your account.") {
            this.setState({ isLoading: false });
            this.props.navigation.navigate("Confirm", {
              email: this.state.email,
            });
            //
          }
          // else if (data.hairType === null) {
          //   this.setState({ isLoading: false });
          //   this.props.navigation.navigate("Camera", { view: "login" });
          // }
          else {
            this.setState({ isLoading: false });
            const token = `Bearer ${this.props.user.access_token}`;
            // this.props.navigation.navigate('Consult');
            this.props.subscriptionPlanAction(token);
            this.props.paymentStatusAction(token, () => {
              const { paymentStatus } = this.props;
              console.log("in here", paymentStatus);
              if (paymentStatus === true) {
                this.props.navigation.navigate("SubscribeSignUp");
              } else if (paymentStatus === false) {
                this.getFBAnalyticsData(data);

                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: "HomeNew" }),
                  ],
                });
                this.props.navigation.dispatch(resetAction);

                // this.props.navigation.navigate("HomeNew");
              }
            });
          }
        });
      }
    }
  };
  getFBAnalyticsData = async (data) => {
    console.log("Fb Analytics");
    console.log("data.Id", data.Id);
    console.log("userName", data.Name);
    console.log("email", data.Email);
    await analytics().logEvent("Login", {
      id: data.Id,
      userName: data.Name,
      email: data.Email,
    });
  };

  getSaveData = async () => {
    try {
      const value = await AsyncStorage.getItem("IsFirstTime");
      if (value === null) {
        this.welcomeHandler();
      }
    } catch (e) {
      // error reading value
    }
  };
  welcomeHandler = () => {
    this.props.navigation.navigate("Welcome");
  };
  registerHandler = () => {
    this.props.navigation.navigate("Register", { view: "login" });
  };
  forgotHandler = () => {
    this.props.navigation.navigate("Forgot");
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <StatusBar backgroundColor={Colors.loginScreenBackgroud} />
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
              <View style={styles.imageContainer}>
                <Image
                  style={styles.imageStyle}
                  source={require("../../../assets/images/mainIcon.png")}
                />
              </View>
              <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <TextInput
                  onChangeText={(email) => this.setState({ email: email })}
                  keyboardType={"email-address"}
                  autoCapitalize={"none"}
                  style={styles.lgn_txtInput}
                  placeholder={"Email"}
                  underlineColorAndroid={"rgba(0,0,0,0)"}
                  autoCorrect={false}
                  borderWidth={1}
                  value={this.state.email}
                  placeholderTextColor={Colors.placeHolderColor}
                />
                <TextInput
                  onChangeText={(password) =>
                    this.setState({ password: password })
                  }
                  autoCapitalize={"sentences"}
                  secureTextEntry={true}
                  style={styles.lgn_txtInput}
                  placeholder={"Password"}
                  underlineColorAndroid={"rgba(0,0,0,0)"}
                  autoCorrect={false}
                  borderWidth={1}
                  placeholderTextColor={Colors.placeHolderColor}
                  value={this.state.password}
                />
                <TouchableOpacity
                  style={styles.textStyleForgotContainer}
                  onPress={this.forgotHandler}
                >
                  <Text style={styles.textStyleForgot}>
                    {"Forgot Password"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.loginButtonContainer}>
                  <ImageButton
                    bgColor={Colors.blackButtonColor}
                    width="100%"
                    height={moderateScale(42)}
                    borderRadius={moderateScale(2)}
                    content="LOGIN"
                    fontSize={16}
                    marginLeft={moderateScale(15)}
                    onPress={this.submitHandler}
                  />
                </View>
                <View style={styles.registerButtonContainer}>
                  <ImageButton
                    bgColor={Colors.lightPink}
                    width="100%"
                    height={moderateScale(42)}
                    borderRadius={moderateScale(2)}
                    content="REGISTER"
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
                    <Text style={styles.termTextStyle}>
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
                <View style={{ flex: 1 }} />
                <View
                  style={{ alignItems: "center", justifyContent: "flex-end" }}
                >
                  <Image
                    style={{
                      resizeMode: "cover",
                      width: screenWidth,
                      height:
                        screenHeight > 740
                          ? screenHeight / 1.9
                          : screenHeight / 1.8,
                    }}
                    source={require("../../../assets/images/loginModels.png")}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems:"center"
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(20),
  },
  imageStyle: {
    resizeMode: "contain",
    width: "55%",
    marginTop: moderateScale(50),
  },
  bottomViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(15),
    width: "100%",
  },
  bottomImageStyle: {
    resizeMode: "cover",
    width: "100%",
  },
  lgn_txtInput: {
    width: "90%",
    height: moderateScale(42),
    borderRadius: 3,
    backgroundColor: "white",
    opacity: 0.8,
    padding: 10,
    fontSize: moderateScale(16),
    marginTop: moderateScale(15),
    fontFamily: "AbsaraSans-Regular",
    borderColor: Colors.fadeBorder,
    borderWidth: 0.5,
    justifyContent: "center",
    alignSelf: "center",
  },
  textStyleForgotContainer: {
    width: "50%",
    height: "5%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: "8%",
    marginTop: moderateScale(5),
    marginBottom: moderateScale(5),
  },
  textStyleForgot: {
    textAlign: "left",
    fontFamily: "AbsaraSans-RegularItalic",
    fontSize: moderateScale(14),
    color: Colors.forgotTextColor,
    textDecorationLine: "underline",
  },
  loginButtonContainer: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
  },
  maskOutter: {
    position: "absolute",
    alignSelf: "flex-start",
    marginTop: moderateScale(100),
    marginLeft: moderateScale(100),
    opacity: moderateScale(0.5),
  },
  registerButtonContainer: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: moderateScale(15),
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tosTextStyle: {
    paddingTop: 10,
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-RegularItalic",
  },
  termTextStyle: {
    paddingTop: 10,
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-Medium",
  },
  privacyPolicyTextStyle: {
    paddingTop: 5,
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-Medium",
  },
});
