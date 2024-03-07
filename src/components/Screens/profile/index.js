import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../common/HeaderBlack";
import { moderateScale } from "../../../helpers/ResponsiveFonts";
import Modal from "react-native-modal";
import Button from "../../common/Button";
import Icon from "react-native-vector-icons/AntDesign";
import Colors from "../../../constants/colors";
import SafeAreaView from "../../../components/common/SafeView";
import { ActionSheet, Root } from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivityLoader from "../../common/activityLoader";

import {
  baseUrlAdminLive,
  baseUrlLive,
  baseUrlLiveCustomer,
  baseUrlStaging,
} from "../../../constants/url";
import colors from "../../../constants/colors";

const width = Dimensions.get("screen").width;

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
      stateCode: "",
      streetAddress: "",
      city: "",
      country: "",
      zip: "",
      state: "",
      email: "",
      firstName: "",
      lastName: "",
      isLoading: false,
      localPath: "",
      chatLoader: false,
      aiResult: null,
      token: "",
      isAIV2Mobile: "",
      isPaid: "",
      hairAnalysisImage: "",
      paymentId: "",
      statusCode: "",
    };
  }
  static navigationOptions = {
    headerTransparent: true,
    gestureEnabled: false,
    disabledBackGesture: false,
    headerShown: false,
  };
  componentDidMount() {
    const token = `Bearer ${this.props.user.access_token}`;
    var url = `${baseUrlLive}Account/userDetails`;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Account/userDetails");
        console.log(responseJson);
        console.log(JSON.stringify(responseJson.value.aiResult));
        if (responseJson.value.imageURL === null) {
          this.storeData("");
        } else {
          this.storeData(responseJson.value.imageURL);
        }
        this.setState({ localPath: responseJson.value.imageURL });
        this.setState({ user_email: responseJson.value.email });
        this.setState({ firstName: responseJson.value.firstName });
        this.setState({ lastName: responseJson.value.lastName });
        this.setState({
          hairAnalysisImage: responseJson.value.hairAnalysisImage,
        });
        this.setState({ aiResult: responseJson.value.aiResult });
        //isAIV2Mobile
        this.setState({ isAIV2Mobile: responseJson.value.isAIV2Mobile });
        this.setState({ isPaid: responseJson.value.isPaid });
      })
      .catch((err) => {
        this.setState({ localPath: "" });
        Alert.alert("Alert", "Please try again !!");
      });

    this.getHairProfileId();

    this.checkHairImage();
    this.getCustomerNonce();
    this.GetQuestionaireDetailsMobile();
  }

  getHairProfileId = () => {
    let token = this.props.user.access_token;
    var url = `${baseUrlLive}HairProfile/GetHairProfile2?token=` + token;
    console.log("url " + url);

    fetch(url, {
      method: "GET",
    })
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        console.log("HairProfileResult:" + JSON.stringify(result));
        this.getProfileDetails(result.profileId);
        // this.setState({ data: result });
      })
      .catch((err) => {
        console.log("error 48 MyHairProfile", err);
      });
  };

  getProfileDetails = (profileId) => {
    this.setState({ isLoading: true });
    var url =
      `${baseUrlLive}HairProfile/CollaboratedDetail?hairProfileId=` + profileId;
    console.log("getProfile", url);
    fetch(url, {
      method: "GET",
    })
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        console.log("HairProfileDetailsResult:" + JSON.stringify(result));
        let status = result.statusCode;
        console.log("statusCode", status);
        this.setState({
          statusCode: status,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log("error 151", err);
      });
  };

  GetQuestionaireDetailsMobile = () => {
    const token = `Bearer ${this.props.user.access_token}`;
    var url = `${baseUrlLive}HairProfile/GetQuestionaireDetailsMobile`;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("GetQuestionaireDetailsMobile", responseJson);
        if (responseJson.data != null) {
          this.setState({
            paymentId: responseJson.data.PaymentId,
          });
        } else {
          Alert.alert("Alert", "Please try again !!");
        }
      })
      .catch((err) => {
        Alert.alert("Alert", "Please try again !!");
      });
  };

  checkHairImage = () => {
    const token = `Bearer ${this.props.user.access_token}`;
    var url = `${baseUrlLive}HairProfile/GetQuestionaireDetails`;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("hair data=>", responseJson);
        if (responseJson.data != null) {
          //this.storeData("");
        }
      })
      .catch((err) => {
        Alert.alert("Alert", "Please try again !!");
      });
  };
  // https://apistaging.myavana.com/Account/getCustomerNonce

  getCustomerNonce = () => {
    const token = `Bearer ${this.props.user.access_token}`;
    var url = `${baseUrlLive}Account/getCustomerNonce`;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.value != null) {
          console.log("response", responseJson.value);
          this.setState({ token: responseJson.value });
        } else {
          Alert.alert("Alert", "Please try again !!");
        }
      })
      .catch((err) => {
        Alert.alert("Alert", "Please try again !!");
      });
  };

  showAlert() {
    Alert.alert(
      "To access this feature you need a Hair AI subscription.",
      "Do you want to proceed?",
      [
        {
          text: "Yes",
          onPress: () => {
            this.packagePayment();
          },
        },
        {
          text: "No",
          onPress: () => {
            // if (this.props.navigation.getParam("view", "") === "dashboard") {
            //   this.props.navigation.navigate("HomeNew");
            // }
            // this.props.navigation.pop();
          },
        },
      ],
      { cancelable: false }
    );
  }

  packagePayment = () => {
    var url =
      `${baseUrlLiveCustomer}Auth/PackagePayment?token=` + this.state.token;
    // let url = "https://www.myavana.com/products/hair-assessment";
    this.webViewScreen(url);
  };

  webViewScreen = (url) => {
    this.props.navigation.navigate("WebViewScreen", { url: url });
  };

  checkValdiation = () => {
    console.log("isPaid", this.state.isPaid);
    console.log("isAIV2Mobile", this.state.isAIV2Mobile);
    if (this.state.isPaid == false) {
      this.showAlert();
    } else if (this.state.paymentId == null) {
      this.showAlertSecondTime();
    } else {
      this.props.navigation.navigate("ResponseUi");
    }
  };

  showAlertSecondTime() {
    Platform.OS === "ios"
      ? Alert.alert(
          "You have used your one-time subscription. If you would like to perform another Hair Analysis, please buy a new subscription.",
          "Do you want to proceed?",
          [
            {
              text: "Yes",
              onPress: () => {
                this.packagePayment();
              },
            },
            {
              text: "No",
              onPress: () => {},
            },
          ],
          { cancelable: false }
        )
      : Alert.alert(
          "You have used your one-time subscription.",
          "If you would like to perform another Hair Analysis, please buy a new subscription.\n\n Do you want to proceed?",
          [
            {
              text: "Yes",
              onPress: () => {
                this.packagePayment();
              },
            },
            {
              text: "No",
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
  }
  checkAPIValdiation = () => {
    if (true) {
      this.QuestionnaireTrigger();
      return;
    }

    const token = `Bearer ${this.props.user.access_token}`;
    var url = `${baseUrlLive}HairProfile/GetQuestionaireDetailsMobile`;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.data != null) {
          //this.storeData("");

          if (responseJson.data.IsExist) {
            Alert.alert("Alert", "You have already submitted questionnaire.");
          } else {
            this.QuestionnaireTrigger();
          }
        } else {
          Alert.alert("Alert", "Please try again !!");
        }
      })
      .catch((err) => {
        Alert.alert("Alert", "Please try again !!");
      });
  };

  backHandler = () => {
    this.props.navigation.pop();
  };
  logoutTrigger = async () => {
    this.props.logoutAction();
    await AsyncStorage.removeItem("currentDate");
    this.storeData("");
    this.props.navigation.navigate("WelcomeStart");
  };
  QuestionnaireTrigger = () => {
    this.props.navigation.navigate("HairCareQuestionnaire", {
      // token: this.props.user.access_token,
      token: this.state.token,
    });
  };
  OrderHairKitTrigger = () => {
    this.props.navigation.navigate("OrderHairKit");
  };
  contactSupport = () => {
    this.props.navigation.navigate("ContactSupport", {
      isContactSupport: true,
    });
  };
  helpSupport = () => {
    this.props.navigation.navigate("HelpSupport", {
      //isContactSupport: true,
    });
  };

  bookVirtualAppointment = () => {
    const email = this.state.user_email;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    this.props.navigation.navigate("BookVirtualAppointment", {
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
  };

  openMyHairProfile = () => {
    this.props.navigation.navigate("MyHairProfile");
  };

  openHairDiary = () => {
    this.props.navigation.navigate("HairDiary");
  };

  openDigitalHairAiResults = () => {
    // const hairData = this.state.aiResult;
    // const hairObj = JSON.parse(hairData);
    const statusCode = this.state.statusCode;

    console.log("statusCodessss", statusCode);
    if (statusCode === 400) {
      Alert.alert("Alert", "Hair analysis data is not available");
    } else {
      this.props.navigation.navigate("DigitalHairAiResults");
    }

    // this.props.navigation.navigate("DigitalHairAiResults");
  };

  // opneAIHairTypeAnalysis = () => {
  //   const hairData = this.state.aiResult;
  //   const isAIV2Mobile = this.state.isAIV2Mobile;
  //   const hairAnalysisImage = this.state.hairAnalysisImage;
  //   const hairObj = JSON.parse(hairData);
  //   console.log("hair obj", hairObj);

  //   if (hairObj === null) {
  //     Alert.alert("Alert", "Hair analysis data is not available");
  //   } else {
  //     // if (this.state.isPaid != true) {
  //     //   this.showAlert();

  //     // }
  //     //  else {
  //     this.props.navigation.navigate("HairAnalysis", {
  //       image: "",
  //       view: "dashboard",
  //       isFrom: "profile",
  //       isHairData: hairObj,
  //       hairAnalysisImage: hairAnalysisImage,
  //       isAIV2Mobile: isAIV2Mobile,
  //     });
  //     // }
  //   }
  // };

  requestNewRecommendations = () => {
    // this.props.navigation.navigate("RequestNewRecommendations");
    this.props.navigation.navigate("ContactSupport", {
      isRequestRecommendations: true,
    });
  };

  openBillingModal = () => {
    this.setState((prevState) => ({
      modalShow: !prevState.modalShow,
    }));
  };
  openUploadProfile = () => {
    const BUTTONS = ["Take Photo", "Choose Photo From Gallery", "Cancel"];
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: 2,
        title: "Select A Photo",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.takePhotoFromCamera();
            break;
          case 1:
            this.choosePhotoFromLibrary();
            break;
          default:
            break;
        }
      }
    );
  };
  closeModal = () => {
    const { streetAddress, country, state, zip, city } = this.state;
    if (streetAddress === "") {
      Alert.alert("Warning", "Please enter your street address.");
    } else if (city === "") {
      Alert.alert("Warning", "Please enter your city");
    } else if (state === "") {
      Alert.alert("Warning", "Please enter your street address.");
    } else if (country === "") {
      Alert.alert("Warning", "Please enter your country");
    } else if (zip === "") {
      Alert.alert("Warning", "Please enter your zip code.");
    } else {
      this.setState({ isLoading: true });
      fetch(`${baseUrlLive}Billing/AddBillingAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.props.user.access_token}`,
        },
        body: JSON.stringify({
          Address: streetAddress,
          City: city,
          State: state,
          Country: country,
          ZipCode: zip,
        }),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((res) => {
          if (res.statusCode === 200) {
            this.setState((prevState) => ({
              modalShow: !prevState.modalShow,
            }));
            Alert.alert("Success", "Your Shipping details has updated.");
          }
        })
        .catch((e) => {
          this.setState((prevState) => ({
            modalShow: !prevState.modalShow,
          }));
          Alert.alert("Server Error", "Something went wrong,Please try again.");
        });
    }
  };
  selectState = (v, i) => {
    this.setState({
      stateCode: v,
    });
  };

  cancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription?",
      [
        {
          text: "yes",
          onPress: () => console.log("Ask me later pressed"),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  modalUiBilling() {
    const { modalShow } = this.state;
    const states = [
      { name: "Alabama", "alpha-2": "AL" },
      { name: "Alaska", "alpha-2": "AK" },
      { name: "Arizona", "alpha-2": "AZ" },
      { name: "Arkansas", "alpha-2": "AR" },
      { name: "California", "alpha-2": "CA" },
      { name: "Colorado", "alpha-2": "CO" },
      { name: "Connecticut", "alpha-2": "CT" },
      { name: "Delaware", "alpha-2": "DE" },
      { name: "District of Columbia", "alpha-2": "DC" },
      { name: "Florida", "alpha-2": "FL" },
      { name: "Georgia", "alpha-2": "GA" },
      { name: "Hawaii", "alpha-2": "HI" },
      { name: "Idaho", "alpha-2": "ID" },
      { name: "Illinois", "alpha-2": "IL" },
      { name: "Indiana", "alpha-2": "IN" },
      { name: "Iowa", "alpha-2": "IA" },
      { name: "Kansa", "alpha-2": "KS" },
      { name: "Kentucky", "alpha-2": "KY" },
      { name: "Lousiana", "alpha-2": "LA" },
      { name: "Maine", "alpha-2": "ME" },
      { name: "Maryland", "alpha-2": "MD" },
      { name: "Massachusetts", "alpha-2": "MA" },
      { name: "Michigan", "alpha-2": "MI" },
      { name: "Minnesota", "alpha-2": "MN" },
      { name: "Mississippi", "alpha-2": "MS" },
      { name: "Missouri", "alpha-2": "MO" },
      { name: "Montana", "alpha-2": "MT" },
      { name: "Nebraska", "alpha-2": "NE" },
      { name: "Nevada", "alpha-2": "NV" },
      { name: "New Hampshire", "alpha-2": "NH" },
      { name: "New Jersey", "alpha-2": "NJ" },
      { name: "New Mexico", "alpha-2": "NM" },
      { name: "New York", "alpha-2": "NY" },
      { name: "North Carolina", "alpha-2": "NC" },
      { name: "North Dakota", "alpha-2": "ND" },
      { name: "Ohio", "alpha-2": "OH" },
      { name: "Oklahoma", "alpha-2": "OK" },
      { name: "Oregon", "alpha-2": "OR" },
      { name: "Pennsylvania", "alpha-2": "PA" },
      { name: "Rhode Island", "alpha-2": "RI" },
      { name: "South Carolina", "alpha-2": "SC" },
      { name: "South Dakota", "alpha-2": "SD" },
      { name: "Tennessee", "alpha-2": "TN" },
      { name: "Texas", "alpha-2": "TX" },
      { name: "Utah", "alpha-2": "UT" },
      { name: "Vermont", "alpha-2": "VT" },
      { name: "Virginia", "alpha-2": "VA" },
      { name: "Washington", "alpha-2": "WA" },
      { name: "West Virginia", "alpha-2": "WV" },
      { name: "Wisconsin", "alpha-2": "WI" },
      { name: "Wyoming", "alpha-2": "WY" },
    ];
    if (modalShow) {
      return (
        <Modal
          style={styles.mdlmain}
          isVisible={true}
          useNativeDriver={true}
          onSwipeMove={this.openBillingModal}
          onSwipeStart={this.openBillingModal}
          onBackdropPress={this.openBillingModal}
          onBackButtonPress={this.openBillingModal}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: width > 360 ? moderateScale(150) : moderateScale(60),
            }}
          >
            <View style={styles.mdlcntr}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "92%", justifyContent: "center" }}>
                  <Text style={styles.welcomeText}>
                    {"Update your shipping Address"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    paddingTop: moderateScale(15),
                    position: "absolute",
                    left: moderateScale(240),
                  }}
                  onPress={this.openBillingModal}
                >
                  <Icon
                    name={"close"}
                    size={moderateScale(21)}
                    color={"#000000"}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "90%",
                  opacity: moderateScale(0.7),
                  marginBottom: moderateScale(25),
                }}
              >
                <Text style={styles.contentTextStyle}>
                  {
                    "Your shipping address is required for us to send you packages related to your subscription."
                  }
                </Text>
                <TextInput
                  onChangeText={(streetAddress) =>
                    this.setState({ streetAddress: streetAddress })
                  }
                  autoCapitalize={"sentences"}
                  style={styles.lgn_txtInput}
                  placeholder={"Street Address"}
                  underlineColorAndroid={"rgba(0,0,0,0)"}
                  autoCorrect={false}
                  placeholderTextColor={Colors.placeHolderColor}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    onChangeText={(city) => this.setState({ city: city })}
                    autoCapitalize={"sentences"}
                    style={styles.small_txtInput}
                    placeholder={"City"}
                    underlineColorAndroid={"rgba(0,0,0,0)"}
                    autoCorrect={false}
                    placeholderTextColor={Colors.placeHolderColor}
                  />
                  <TextInput
                    onChangeText={(state) => this.setState({ state: state })}
                    autoCapitalize={"sentences"}
                    style={styles.small_txtInput}
                    placeholder={"State"}
                    underlineColorAndroid={"rgba(0,0,0,0)"}
                    autoCorrect={false}
                    placeholderTextColor={Colors.placeHolderColor}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    onChangeText={(country) =>
                      this.setState({ country: country })
                    }
                    autoCapitalize={"sentences"}
                    style={styles.small_txtInput}
                    placeholder={"Country"}
                    underlineColorAndroid={"rgba(0,0,0,0)"}
                    autoCorrect={false}
                    placeholderTextColor={Colors.placeHolderColor}
                  />
                  <TextInput
                    onChangeText={(zip) => this.setState({ zip: zip })}
                    autoCapitalize={"none"}
                    keyboardType={"numeric"}
                    maxLength={5}
                    style={styles.small_txtInput}
                    placeholder={"Zip"}
                    underlineColorAndroid={"rgba(0,0,0,0)"}
                    autoCorrect={false}
                    placeholderTextColor={Colors.placeHolderColor}
                  />
                </View>
              </View>
              <View style={{ marginBottom: moderateScale(10) }}>
                {this.state.isLoading === false ? (
                  <Button
                    bgColor={Colors.blackButtonColor}
                    color={"#FFFFFF"}
                    width="90%"
                    height={moderateScale(40)}
                    borderRadius={moderateScale(5)}
                    borderColor={"#4FB26A"}
                    borderWidth={moderateScale(0)}
                    content="Confirm"
                    fontSize={17}
                    fontFamily={"AbsaraSans-Regular"}
                    onPress={this.closeModal}
                  />
                ) : (
                  <Button
                    bgColor={"#4FB26A"}
                    color={"#FFFFFF"}
                    width="90%"
                    height={moderateScale(40)}
                    borderRadius={moderateScale(15)}
                    borderColor={"#4FB26A"}
                    borderWidth={moderateScale(1)}
                    content="Submitting…"
                    fontSize={17}
                    fontFamily={"Montserrat-Bold"}
                  />
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      );
    }
  }
  line = () => {
    return (
      <View
        style={{
          width: "100%",
          height: moderateScale(0.5),
          backgroundColor: Colors.lightBlack,
        }}
      />
    );
  };
  takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 0.7,
      cropping: false,
      includeBase64: true,
    }).then((image) => {
      this.setState({ localPath: image.path });
      {
        this.uploadProfilePicApi(image.data);
      }
    });
  };
  choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 0.7,
      cropping: false,
      includeBase64: true,
    }).then((image) => {
      this.setState({ localPath: image.path });
      {
        this.uploadProfilePicApi(image.data);
      }
    });
  };
  uploadProfilePicApi = (image) => {
    this.setState({
      chatLoader: true,
    });
    fetch(`${baseUrlAdminLive}Image/ImageUpload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.user.access_token}`,
      },
      body: JSON.stringify({
        fileData: image,
      }),
    })
      .then((response) => {
        const statusCode = response.status;
        console.log(statusCode + "", response);
        return response.json();
      })
      .then((responseJson) => {
        Alert.alert("Success", "Profile pic is successfully uploaded.");
        this.storeData(responseJson.value.imageURL);
        this.setState({
          chatLoader: false,
        });
      })
      .catch((err) => {
        this.setState({
          chatLoader: false,
        });
        console.log(err, "err");
        Alert.alert("Some issue occured", err.message);
      });
  };
  storeData = async (imageUrl) => {
    try {
      await AsyncStorage.setItem("userImage", imageUrl);
    } catch (e) {
      // saving error
    }
  };
  getSaveData = async () => {
    try {
      const value = await AsyncStorage.getItem("userImage");
      if (value === null) {
        if (this.props.user.imageURL === null) {
          this.setState({ localPath: value });
        } else {
          this.setState({ localPath: this.props.user.imageURL });
        }
      } else {
        this.setState({ localPath: value });
      }
    } catch (e) {
      // error reading value
    }
  };
  render() {
    const { chatLoader } = this.state;
    var icon = "";
    if (this.state.localPath) {
      icon = { uri: this.state.localPath };
    } else {
      icon = require("../../../assets/images/default_profile.png");
    }
    return (
      <Root>
        <StatusBar backgroundColor={Colors.lightBlack} />
        <SafeAreaView colorTop={Colors.lightBlack} colorBottom={Colors.white}>
          <ActivityLoader isLoading={chatLoader} />
          <Header
            title={"ACCOUNT"}
            subTitle={"My Profile"}
            backHandler={this.backHandler}
          />
          <ScrollView>
            <View style={styles.container}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignSelf: "center",
                  marginTop: moderateScale(20),
                }}
                onPress={this.openUploadProfile}
              >
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: Platform.OS === "ios" ? 120 / 2 : 120,
                  }}
                  source={icon}
                />
                <Text
                  style={{
                    fontFamily: "BentonSans-Bold",
                    alignSelf: "center",
                    color: Colors.profileTextColor,
                    fontSize: 16,
                    marginTop: 4,
                  }}
                >
                  {" "}
                  Edit Profile Pic
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.openMyHairProfile}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/view_hair_care_plan.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    {
                      fontFamily: "BentonSans-Regular",
                    },
                  ]}
                >
                  {"  "}
                  {/* {"View Hair Care Plan"} */}
                  {"Healthy Hair Care Plan"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.openHairDiary}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/add_hair_diary.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    {
                      fontFamily: "BentonSans-Regular",
                    },
                  ]}
                >
                  {"  "}
                  {/* {"Add To Hair Diary"} */}
                  {"Hair Diary"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                // onPress={this.opneAIHairTypeAnalysis}
                onPress={this.openDigitalHairAiResults}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/hair_type_analysis.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    {
                      fontFamily: "BentonSans-Regular",
                    },
                  ]}
                >
                  {"  "}
                  {/* {"AI Hair Type Analysis"} */}
                  {"Digital Hair AI Results"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.bookVirtualAppointment}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/book_virtual_consulation.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Regular" },
                  ]}
                >
                  {"  "}
                  {"Book Virtual Consultation"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                // onPress={this.checkAPIValdiation}
                onPress={this.checkValdiation}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/complete_hair_questionaire.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Regular" },
                  ]}
                >
                  {"  "}
                  {/* {"Complete Hair Care Questionnaire"} */}
                  {"Digital Hair Assessment"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.OrderHairKitTrigger}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/order_analysis_kit.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Regular" },
                  ]}
                >
                  {"  "}
                  {/* {"Order Hair Analysis Kit"} */}
                  {"Hair Strand Analysis Kit"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.requestNewRecommendations}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/request.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Regular" },
                  ]}
                >
                  {"  "}
                  {"Request New Recommendations"}
                </Text>
              </TouchableOpacity>
              {this.line()}

              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.contactSupport}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/contact_support.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Regular" },
                  ]}
                >
                  {"  "}
                  {"Contact Support Team"}
                </Text>
              </TouchableOpacity>
              {/* Cancel Subscription block */}
              {/* {Platform.OS === "ios" ? null : (
                <View style={{ width: "100%" }}>
                  {this.line()}
                  <TouchableOpacity
                    style={[styles.boxStyle]}
                    onPress={this.cancelSubscription}
                  >
                    <Text
                      style={[
                        styles.titleStyle,
                        { fontFamily: "BentonSans-Regular" },
                      ]}
                    >
                      {"Cancel Subscription"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
              {/* end cancel subscription block */}
              {this.line()}

              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.helpSupport}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/help_support.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Regular" },
                  ]}
                >
                  {"  "}
                  {"Help & Support"}
                </Text>
              </TouchableOpacity>
              {this.line()}

              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={() => this.deleteAlertMessage()}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={[
                      styles.optionIconStyle,
                      { height: moderateScale(30) },
                    ]}
                    source={require("../../../assets/images/delete.png")}
                  />
                </View>
                <Text
                  style={[
                    styles.titleStyle,
                    { fontFamily: "BentonSans-Bold", color: colors.red },
                  ]}
                >
                  {"  "}
                  {"Delete Account"}
                </Text>
              </TouchableOpacity>
              {this.line()}
              <TouchableOpacity
                style={[styles.boxStyle]}
                onPress={this.logoutTrigger}
              >
                <View style={styles.viewStyle}>
                  <Image
                    style={styles.optionIconStyle}
                    source={require("../../../assets/images/sign_out.png")}
                  />
                </View>
                <Text
                  style={[styles.titleStyle, { fontFamily: "BentonSans-Bold" }]}
                >
                  {"    "}
                  {"Sign Out"}
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
              <View style={styles.bottomViewStyle}>
                <Image
                  style={styles.bottomImageStyle}
                  source={require("../../../assets/images/appLogoTm.png")}
                />
              </View>
              {this.modalUiBilling()}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Root>
    );
  }
  deleteAlertMessage() {
    const id = this.props.user.Id;
    Alert.alert(
      "Alert",
      "Deleting your account would remove all your data including your HHCP. Are you sure you want to delete your account?",
      [
        {
          text: "Yes",
          onPress: async () => {
            this.apiDeleteAccount(id);
            await AsyncStorage.removeItem("currentDate");
          },
        },
        { text: "No", onPress: () => console.log("No Pressed") },
      ],
      { cancelable: false }
    );
  }

  apiDeleteAccount = (id) => {
    // const id = this.state.user.Id;
    this.setState({
      isLoading: true,
    });
    // console.log("click.." + item.PostId);
    let accessToken = this.props.user.access_token;

    const obj = {
      Id: id,
    };
    console.log("data send:" + JSON.stringify(obj));
    fetch(`${baseUrlLive}Account/DeleteCustomer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => {
        console.log(resp.status + " status");
        let json = resp.json();
        return json;
      })
      .then((result) => {
        console.log("delete Account result" + JSON.stringify(result));
        this.setState({
          isLoading: false,
        });
        if (result.statusCode == "200") {
          console.log("sucess");
          this.props.logoutAction();
          this.storeData("");
          this.props.navigation.navigate("WelcomeStart");
        }
      })
      .catch((err) => {
        console.log("err", err);
        this.setState({
          isLoading: false,
        });
      });
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mdlmain: {
    justifyContent: "center",
    alignItems: "center",
  },
  mdlcntr: {
    paddingLeft: moderateScale(20),
    width: moderateScale(300),
    height: moderateScale(420.24),
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(25),
  },
  welcomeText: {
    fontSize: moderateScale(20),
    textAlign: "left",
    color: Colors.placehoder,
    fontFamily: "AbsaraSans-Medium",
    marginBottom: moderateScale(3),
    marginTop: moderateScale(15),
    opacity: moderateScale(0.57),
    paddingRight: moderateScale(15),
  },
  contentTextStyle: {
    fontFamily: "AbsaraSans-Regular",
    fontSize: moderateScale(16),
    color: Colors.profileTextColor,
    textAlign: "left",
    marginTop: moderateScale(5),
    opacity: moderateScale(0.57),
  },
  boxStyle: {
    width: "100%",
    // height: moderateScale(80),
    backgroundColor: "#FFFFFF",
    borderColor: "#C9C9C9",
    justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row",
    paddingLeft: 20,
    marginBottom: moderateScale(20),
    marginTop: moderateScale(20),
    flex: 1,
  },
  boxStyle2: {
    width: "100%",
    height: moderateScale(65),
    backgroundColor: "#FFFFFF",
    borderColor: "#C9C9C9",
  },
  titleStyle: {
    // height: moderateScale(40),
    color: Colors.profileTextColor,
    fontSize: moderateScale(16),
    // marginTop: moderateScale(10),
    marginLeft: moderateScale(10),
    marginTop: Platform.OS === "ios" ? moderateScale(15) : moderateScale(0),
    // paddingTop: Platform.OS === "ios" ? moderateScale(10) : moderateScale(10),
    // padding: 0,
    // textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    // width: "100%",
    // backgroundColor: colors.red,
    // marginBottom: moderateScale(20),
    textAlignVertical: "center",
    // textAlign: "left",
  },
  lgn_txtInput: {
    width: moderateScale(250),
    height: 50.59,
    borderRadius: 5,
    backgroundColor: Colors.White,
    opacity: 0.8,
    padding: 10,
    fontSize: moderateScale(17),
    marginTop: 20,
    fontFamily: "AbsaraSans-Regular",
    borderColor: Colors.fadeBorder,
    borderWidth: 1,
    justifyContent: "center",
  },
  small_txtInput: {
    width: moderateScale(120),
    height: 50.59,
    borderRadius: 5,
    backgroundColor: Colors.White,
    opacity: 0.8,
    padding: 10,
    fontSize: moderateScale(17),
    marginTop: 20,
    fontFamily: "AbsaraSans-Regular",
    borderColor: Colors.fadeBorder,
    borderWidth: 1,
    justifyContent: "center",
  },
  highlightedText: {
    color: "#000",
  },
  dr_m_text: {
    fontSize: moderateScale(17),
    fontFamily: "Montserrat-Bold",
    paddingRight: moderateScale(15),
    textAlign: "left",
  },
  dr_text: {
    fontSize: moderateScale(14),
    paddingLeft: moderateScale(5),
    paddingRight: moderateScale(25),
    fontFamily: "Montserrat-Bold",
    color: "#D4C7C7",
    marginLeft: moderateScale(10),
  },
  dr_style: {
    width: moderateScale(115),
  },
  bottomViewStyle: {
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: moderateScale(12),
    marginLeft: moderateScale(25),
    backgroundColor: "#FFFFFF",
  },
  bottomImageStyle: {
    resizeMode: "contain",
    width: moderateScale(170),
    height: moderateScale(45),
  },
  optionIconStyle: {
    resizeMode: "contain",
    width: moderateScale(18),
    height: moderateScale(18),
    alignSelf: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? moderateScale(0) : moderateScale(0),
  },
  viewStyle: {
    backgroundColor: "#f9f0eb",
    borderRadius: moderateScale(20),
    height: moderateScale(40),
    width: moderateScale(40),
    padding: moderateScale(10),
    // marginTop: moderateScale(-10),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
