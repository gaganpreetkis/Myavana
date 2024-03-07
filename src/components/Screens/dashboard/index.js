import React, { Component } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
  BackHandler,
  PermissionsAndroid,
} from "react-native";
import { moderateScale } from "../../../helpers/ResponsiveFonts";
import Colors from "../../../constants/colors";
import SafeAreaView from "../../../components/common/SafeView";
import { Pages } from "react-native-pages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationEvents } from "react-navigation";
import { FCM_TOKEN } from "../../../actions/actionTypes";
import {
  baseUrlLive,
  baseUrlLiveCustomer,
  baseUrlStaging,
} from "../../../constants/url";
import colors from "../../../constants/colors";
import base64 from "react-native-base64";
import YoutubeList from "../tv/youtubeList";
import analytics from "@react-native-firebase/analytics";
const { width } = Dimensions.get("window");
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      products: [],
      hairTypeUser: "",
      localPath: "",
      messageText: "Want a deeper hair analysis?",
      hairTipDesc: "",
      hairTipVideoId: "",
      hairTipImageLink: "",
      videoid: "",
      token: "",
      isAIV2Mobile: "",
      isPaid: "",
      paymentId: "",
      providerName: "",
      customerTypeId: 0,
      userName: "",
      email: "",
      id: "",
      isALertShowing: false,
    };
  }
  static navigationOptions = {
    headerTransparent: true,
    gestureEnabled: false,
    disabledBackGesture: false,
    headerShown: false,
  };

  componentDidMount() {
    //this.getSaveDate();
    this.requestNtoficationPermission();
    this.getSaveData();
    this.fetchHairTipForDay();
    this.checkAPIValdiation();
    this.getCustomerNonce();
    this.getAccountuserDetails();
    //this.getNotificationSaveData();
    const data = this.props.user;
    console.log("user=" + JSON.stringify(data));

    if (data && data.access_token) {
      const token = `Bearer ${data.access_token}`;
      this.props.getSubscription(token);
      this.props.paymentStatusAction(token, () => {
        const { paymentStatus } = this.props;
        if (paymentStatus === true) {
          this.props.navigation.navigate("SubscribeSignUp");
        } else if (paymentStatus === null) {
          this.props.navigation.navigate("WelcomeStart");
        } else {
          //payment done...
          console.log("paymentStatus=" + paymentStatus);
          this.setState({ messageText: "Healthy Hair Care Plan" });
        }
      });
    } else {
      console.log("WelcomeStart=" + paymentStatus);
      this.props.navigation.navigate("WelcomeStart");
    }

    const focusListener = this.props.navigation.addListener(
      "willFocus",
      async () => {
        this.getAccountuserDetails();
        this.getCustomerNonce();
      }
    );
    return focusListener;
  }

  // getNotificationSaveData = async () => {
  //   // this.setState({ isLoading: true });
  //   try {
  //     AsyncStorage.getItem("notificationMessage").then((value) => {
  //       console.log("notificationMessageDashboard", value);
  //       console.log("notificationtitle", value.notification.title);
  //       if (value != null) {
  //         Alert.alert(value.notification.title, value.notification.body);
  //       }
  //     });
  //   } catch (e) {
  //     console.log("72....", e);
  //   }
  // };

  requestNtoficationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        console.log(
          "doneeeee",
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        // If POST_NOTIFICATIONS Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  getAccountuserDetails = () => {
    const data2 = this.props.user;
    console.log("data2", data2);
    if (data2 && data2.access_token) {
      const token = `Bearer ${data2.access_token}`;
      this.props.paymentStatusAction(token, () => {
        const { paymentStatus } = this.props;
        if (paymentStatus === true || paymentStatus === false) {
          this.setState({ hairTypeUser: data2.hairType });
          // this.setState({ hairId: data2.Id });
          if (this.state.Id === null) {
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
                {
                  console.log("userDetails:", JSON.stringify(responseJson));
                  this.setState({
                    isAIV2Mobile: responseJson.value.isAIV2Mobile,
                  });
                  this.setState({
                    IsPaid: responseJson.value.IsPaid,
                  });
                  this.setState({
                    customerTypeId: responseJson.value.customerTypeId,
                  });
                  // this.checkAPIValdiation();
                  this.getAllRecommendProducts(responseJson.value.hairType);
                }
              })
              .catch(() => {
                this.setState({ hairTypeUser: "" });
                Alert.alert("Alert", "Please try again !!");
              });
          } else {
            {
              this.getRecommendProducts();
            }
          }
        }
      });
    }
  };
  packagePayment = () => {
    var url =
      `${baseUrlLiveCustomer}Auth/PackagePayment?token=` + this.state.token;
    // let url = "https://www.myavana.com/products/hair-assessment";
    this.webViewScreen(url);
  };

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
          console.log("getCustomerNonce", responseJson.value);
          this.setState({ token: responseJson.value });
        } else {
          Alert.alert("Alert", "Please try again !!");
        }
      })
      .catch((err) => {
        Alert.alert("Alert", "Please try again !!");
      });
  };
  //
  checkAPIValdiation = () => {
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
          this.setState({
            providerName: responseJson.data.ProviderName,
          });
          var currentDate = new Date().toDateString();
          // console.log("currentDate", currentDate);

          this.getSaveDate(
            currentDate,
            responseJson.data.IsExist,
            responseJson.data.ProviderName
          );
          // if (responseJson.data.IsExist == true) {
          //   if (!this.state.isALertShowing) {
          //     this.state.isALertShowing = true;
          //     Alert.alert(
          //       "Alert",
          //       "Please complete your Digital Hair Assessment",
          //       [
          //         {
          //           text: "Cancel",
          //           onPress: () => {
          //             this.state.isALertShowing = false;
          //             this.storeDate(currentDate);
          //             console.log("Cancel Pressed");
          //           },
          //           style: "cancel",
          //         },
          //         {
          //           text: "OK",
          //           onPress: () => {
          //             this.state.isALertShowing = false;
          //             this.storeDate(currentDate);
          //             this.QuestionnaireTrigger();
          //           },
          //         },
          //       ]
          //     );
          //   }
          // }
        } else {
          Alert.alert("Alert", "Please try again !!");
        }
      })
      .catch((err) => {
        Alert.alert("Alert", "Please try again !!");
      });
  };

  storeDate = async (date) => {
    try {
      await AsyncStorage.setItem("currentDate", date);
      console.log("saveDate", date);
    } catch (e) {
      // saving error
    }
  };

  getSaveDate = async (currentDate, isExist, provideName) => {
    try {
      const saveDate = await AsyncStorage.getItem("currentDate");
      console.log(
        "getSaveDate",
        saveDate,
        "currentDate:",
        currentDate,
        "isExist:",
        isExist
      );
      // Show popup only once if user has valid subscription
      if (saveDate != currentDate) {
        if (isExist == true && provideName != null) {
          if (!this.state.isALertShowing) {
            this.state.isALertShowing = true;
            Alert.alert(
              "Alert",
              "Please complete your Digital Hair Assessment",
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    this.state.isALertShowing = false;
                    this.storeDate(currentDate);
                    console.log("Cancel Pressed");
                  },
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    this.state.isALertShowing = false;
                    this.storeDate(currentDate);
                    this.QuestionnaireTrigger();
                  },
                },
              ]
            );
          }
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  QuestionnaireTrigger = () => {
    this.props.navigation.navigate("HairCareQuestionnaire", {
      token: this.state.token,
    });
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
  openProfile = () => {
    this.props.navigation.navigate("Profile");
  };
  openCamera = () => {
    console.log("customerTypeId", this.state.customerTypeId);
    console.log("isPaid", this.state.isPaid);
    console.log("paymentId", this.state.paymentId);
    console.log("providerName", this.state.providerName);
    {
      //Stripe
      if (this.state.isPaid == false) {
        this.showAlert();
      } else {
        if (
          (this.state.isPaid &&
            this.state.paymentId != null &&
            this.state.customerTypeId == 3) ||
          (this.state.isPaid &&
            this.state.paymentId != null &&
            this.state.customerTypeId == 1)
        ) {
          this.getFBAnalyticsData();
          // this.props.navigation.navigate("Camera", {
          //   view: "dashboard",
          //   isAIV2Mobile: this.state.isAIV2Mobile,
          //   isPaid: this.state.isPaid,
          // });
          this.props.navigation.navigate("ResponseUi", {
            isPaid: this.state.isPaid,
          });
        } else if (this.state.paymentId == null) {
          this.showAlertSecondTime();
        } else {
          this.showAlert();
        }
      }

      //Shopify

      // if (this.state.paymentId == null) {
      //   // if (this.state.providerName == "OneTime") {
      //   //   this.showAlertSecondTime();
      //   // }
      //   this.showAlertFirstTime();
      // } else {
      //   this.getFBAnalyticsData();
      //   // if (this.state.providerName == "OneTime") {
      //   //   this.props.navigation.navigate("Camera", {
      //   //     view: "dashboard",
      //   //     isAIV2Mobile: this.state.isAIV2Mobile,
      //   //     isPaid: this.state.isPaid,
      //   //   });
      //   // } else {
      //   //   this.showAlertSecondTime();
      //   // }
      //   this.props.navigation.navigate("Camera", {
      //     view: "dashboard",
      //     isAIV2Mobile: this.state.isAIV2Mobile,
      //     isPaid: this.state.isPaid,
      //   });
      // }
    }
  };
  //   // (this.state.isPaid && this.state.customerTypeId == 3) ||
  //   // (this.state.isPaid && this.state.customerTypeId == 1)
  //   //   ? this.props.navigation.navigate("Camera", {
  //   //       view: "dashboard",
  //   //       isAIV2Mobile: this.state.isAIV2Mobile,
  //   //       isPaid: this.state.isPaid,
  //   //     })
  //   //   : this.showAlert();
  // }

  getFBAnalyticsData = async () => {
    console.log("Fb Analytics");
    console.log("userResponseCustomerEmail", this.state.email);
    // console.log("userResponseName", this.state.userResponse.value.isPaid);
    // console.log("userName", data.Name);
    // console.log("email", data.Email);
    await analytics().logEvent("Hair_AI_Subscription", {
      customerTypeId: this.state.customerTypeId,
      id: this.state.id,
      userName: this.state.userName,
      email: this.state.email,
      IsPaid: this.state.isPaid,
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
  openConsult = () => {
    this.props.navigation.navigate("NewConsult", { isFromHome: "yes" });
  };
  openHairDiary = () => {
    this.props.navigation.navigate("HairDiary");
  };
  openStylist = () => {
    this.props.navigation.navigate("ContactSupport", {
      isContactSupport: false,
    });
  };
  bookVirtualAppointment = () => {
    this.props.navigation.navigate("BookVirtualAppointment");
  };
  openRecommendProducts = () => {
    const { hairTypeUser } = this.state;
    // const { hairId } = this.state;
    this.props.navigation.navigate("RecommendProduct", {
      hairData: hairTypeUser,
      // hairId: hairId,
    });
    /* const { hairTypeUser } = this.state
        this.props.navigation.navigate('NewProduct', { hairData: hairTypeUser }); */
  };
  OrderHairKitTrigger = () => {
    if (this.state.messageText == "Want a deeper hair analysis?") {
      this.props.navigation.navigate("OrderHairKit");
    } else {
      this.props.navigation.navigate("MyHairProfile");
    }
  };

  saveDeviceId = async () => {
    console.log("inside saveDeviceId");
    const data2 = this.props.user;
    if (data2 && data2.access_token) {
      const token = `Bearer ${data2.access_token}`;
      var fcmToken = "";
      var url = `${baseUrlLive}Account/userDetails`;
      // var url = `${baseUrlStaging}Account/userDetails`;

      try {
        const value = await AsyncStorage.getItem(FCM_TOKEN);
        if (value === null) {
        } else {
          fcmToken = value;
        }
      } catch (e) {
        // error reading value
      }
      console.log("fcm token " + fcmToken, Platform.OS == "android");

      // Alert.alert('FCM TOKEN', fcmToken + ' ' )
      if (fcmToken != null && fcmToken != "") {
        url += "?deviceId=" + fcmToken;
        url += "&isAndroid=" + (Platform.OS == "android");

        console.log("Access Token new : " + token, " url " + url);
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            // ignored
            console.log(url, JSON.stringify(json));
            console.log("Account/userDetails", JSON.stringify(json));
            console.log("isPaid:", json.value.isPaid);
            console.log("customerTypeId:", json.value.customerTypeId);
            let userName = json.value.firstName + " " + json.value.lastName;

            this.setState({
              isAIV2Mobile: json.value.isAIV2Mobile,
            });
            this.setState({
              userName: userName,
            });
            this.setState({
              id: json.value.id,
            });
            this.setState({
              email: json.value.email,
            });

            this.setState({
              isPaid: json.value.isPaid,
            });
            this.setState({
              customerTypeId: json.value.customerTypeId,
            });
            this.checkAPIValdiation();
          })
          .catch(() => {
            this.setState({ hairTypeUser: "" });
            Alert.alert("Alert", "Please try again !!");
          });
      } else {
        console.log("fcm token is empty");
      }
    } else {
      console.log("fcm token is empty 2");
    }
  };

  getRecommendProducts = () => {
    this.saveDeviceId();

    const { hairTypeUser } = this.state;
    console.log("hairTypeUser", hairTypeUser);
    if (
      hairTypeUser != null &&
      hairTypeUser != undefined &&
      hairTypeUser != ""
    ) {
      const data2 = this.props.user;
      const token = `Bearer ${data2.access_token}`;
      var url = `${baseUrlLive}Product/suggestions?hairType=` + hairTypeUser;
      ///var token = this.props.user.access_token;
      console.log("ProductUrl", url);
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
          var r = [];
          // console.log("Recommended Products is:", JSON.stringify(responseJson));
          responseJson.map((element) => {
            if (r.length != 3) {
              r.push(element);
            }
          });
          this.setState({ products: r });
          console.log("Product/suggestions", JSON.stringify(responseJson));

          this.props.hairProducts(responseJson);
        })
        .catch((err) => {
          console.log(err, "errorss");
          Alert.alert("Alert", "Please try again !!");
          this.setState({ products: [] });
        });
    }
  };
  getAllRecommendProducts = (hairType) => {
    //const {hairTypeUser} = this.state
    const data2 = this.props.user;

    const token = `Bearer ${data2.access_token}`;
    var url = `${baseUrlLive}Product/suggestions?hairType=` + hairType;
    ///var token = this.props.user.access_token;
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
        console.log("Product/suggestionss", responseJson);
        var r = [];
        responseJson.value.map((element) => {
          if (r.length != 3) {
            r.push(element);
          }
        });
        this.setState({ products: r });
        console.log(
          "getAllRecommendProducts",
          JSON.stringify(responseJson.value)
        );
      })
      .catch((err) => {
        console.log(err, "err");
        Alert.alert("Alert", "Please try again !!");
        this.setState({ products: [] });
      });
  };

  fetchHairTipForDay = () => {
    const data = this.props.user;
    var url = `${baseUrlLive}SocialMedia/GetEducationTipForMobile`;
    console.log("url is: " + url);
    var token = data.access_token;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("fetchHairTipForDay:", JSON.stringify(responseJson));
        // let data = responseJson.data;
        // console.log("Data is:", data);

        this.setState({ hairTipDesc: responseJson.data.Description });
        this.setState({ hairTipVideoId: responseJson.data.VideoId });
        //this.setState({ hairTipImageLink: responseJson.data.ImageLink });

        var url = responseJson.data.VideoId;
        var videoid = url.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );
        if (videoid != null) {
          this.setState({ videoid: videoid[1] });
          console.log("video id = ", videoid[1]);
        } else {
          console.log("The youtube url is not valid.");
        }
        if (responseJson.data.VideoId.includes("instagram")) {
          // this.setState({
          //   hairTipImageLink: require("../../../assets/images/Iconold.png"),
          // });
          this.setState({
            hairTipImageLink: responseJson.data.ImageLink,
          });
        } else {
          let youtubeLink =
            "https://img.youtube.com/vi/" +
            this.state.videoid +
            "/mqdefault.jpg";
          console.log("youtubeLink", youtubeLink);
          this.setState({ hairTipImageLink: youtubeLink });
        }
      })
      .catch((err) => {
        console.log(err, "err");
        Alert.alert("Alert", "Please try again !!");
      });
  };
  webViewScreen = (url) => {
    this.props.navigation.navigate("WebViewScreen", {
      url: url,
      screen: "dashboard",
    });
  };
  // view: "register",
  render() {
    const { products } = this.state;

    var indicators = [];
    var selectedPage = this.state.page;
    for (var i = 0; i < products.length; i++) {
      if (selectedPage == i) {
        indicators.push(
          <Image
            key={"image" + i}
            style={styles.imageStyleDot}
            source={require("../../../assets/images/selected_dot.png")}
          />
        );
      } else {
        indicators.push(
          <Image
            key={"image" + i}
            style={styles.imageStyleDot}
            source={require("../../../assets/images/dot.png")}
          />
        );
      }
    }

    let marginUp = 0;
    var iconProfile = "";
    if (this.state.localPath) {
      iconProfile = { uri: this.state.localPath };
    } else {
      iconProfile = require("../../../assets/images/default_profile.png");
    }
    if (this.state.products.length > 0) {
      marginUp = 80;
    } else {
      marginUp = 8;
    }
    return (
      <>
        <StatusBar backgroundColor="#fff" />
        <SafeAreaView colorTop={Colors.white} colorBottom={Colors.white}>
          <NavigationEvents onDidFocus={this.getSaveData}></NavigationEvents>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.white,
              justifyContent: "center",
            }}
          >
            <Image
              style={styles.imageStyle}
              source={require("../../../assets/images/mainIcon.png")}
            />
            <Text style={styles.subHeading}>Hair Care Concierge</Text>
            <ScrollView contentContainerStyle={styles.container}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginStart: moderateScale(20),
                    }}
                    onPress={this.openCamera}
                  >
                    <View style={styles.imageNew}>
                      <View style={styles.imageInnerNew}>
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: "contain",
                          }}
                          source={require("../../../assets/images/new_photo.png")}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        fontFamily: "BentonSans-Medium",
                        fontSize: moderateScale(11),
                        color: "black",
                        marginTop: moderateScale(4),
                      }}
                    >
                      NEW PHOTO
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.requestButtonStyle}
                    onPress={this.openProfile}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: Platform.OS === "ios" ? 40 / 2 : 40,
                      }}
                      source={iconProfile}
                    />
                    <Text
                      style={{
                        fontFamily: "BentonSans-Medium",
                        fontSize: moderateScale(11),
                        color: "black",
                        marginTop: moderateScale(4),
                      }}
                    >
                      PROFILE
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.hairTipDesc != "" &&
                this.state.hairTipDesc != null &&
                this.state.hairTipDesc != undefined ? (
                  <View style={styles.hairTipOfDay}>
                    <Text
                      style={[
                        styles.txtNeed,
                        {
                          marginTop: 25,
                          marginLeft: 20,
                          fontFamily: "AbsaraSans-Bold",
                        },
                      ]}
                    >
                      Hair Tip of the Day
                    </Text>
                    <TouchableOpacity onPress={this.bookVirtualAppointment}>
                      <Text
                        style={{
                          fontFamily: "AbsaraSans-Bold",
                          fontSize: moderateScale(14),
                          marginTop: moderateScale(8),
                          marginLeft: moderateScale(20),
                          color: Colors.lightPink,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        Book A Consultation{" >>"}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.textStyle}>
                      <Text
                        numberOfLines={6}
                        ellipsizeMode="tail"
                        style={[
                          styles.txtNeed,
                          { marginTop: 8, marginLeft: 20 },
                        ]}
                      >
                        {this.state.hairTipDesc}
                      </Text>
                    </View>

                    <View style={styles.boxStyle}>
                      <TouchableOpacity
                        onPress={() => {
                          this.webViewScreen(this.state.hairTipVideoId);
                        }}
                      >
                        <View>
                          {this.state.hairTipImageLink ==
                            "http://admin.myavana.com/images/instagram.jpg" ||
                          this.state.hairTipImageLink == null ||
                          this.state.hairTipImageLink == "" ? (
                            <Image
                              style={{
                                width: moderateScale(150),
                                height: moderateScale(150),
                                resizeMode: "cover",
                                borderRadius: 10,
                              }}
                              source={require("../../../assets/images/Iconold.png")}
                            />
                          ) : (
                            <Image
                              style={{
                                width: moderateScale(150),
                                height: moderateScale(150),
                                resizeMode: "cover",
                                borderRadius: 10,
                              }}
                              source={{
                                uri: this.state.hairTipImageLink,
                              }}
                              // source={this.state.hairTipImageLink}
                            />
                          )}

                          <Image
                            style={{
                              position: "relative",
                              justifyContent: "center",
                              alignItems: "center",
                              width: moderateScale(38),
                              height: moderateScale(38),
                              alignSelf: "center",
                              alignContent: "center",
                              marginTop: moderateScale(-55),
                            }}
                            source={require("../../../assets/images/playIcon.png")}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {this.state.products.length > 0 ? (
                  <View>
                    <Text style={[styles.txtRecommend, { marginTop: 5 }]}>
                      Recommended Products
                    </Text>
                    <Text style={[styles.txtRecommend, { marginBottom: 5 }]}>
                      Based on your Hair Analysis
                    </Text>
                    <View style={styles.bgRecommended}>
                      <Pages
                        indicatorPosition={"none"}
                        ref={(view) => {
                          this.scrollView = view;
                        }}
                        onScrollEnd={this.onScrollEnd}
                      >
                        {products.map((item, key) => (
                          <View key={key}>
                            <View style={{ width: width, height: "100%" }}>
                              <View
                                style={{
                                  width: width,
                                  alignItems: "center",
                                  height: 180,
                                  justifyContent: "center",
                                  backgroundColor: Colors.curlyBoxColor,
                                  borderRadius: moderateScale(4),
                                }}
                              >
                                <View style={styles.cardImageView}>
                                  <Image
                                    style={{
                                      marginTop: moderateScale(0),
                                      width: moderateScale(80),
                                      height: moderateScale(80),
                                      backgroundColor: "rgba(52, 52, 52, 0.8)",
                                    }}
                                    source={{ uri: item.imageName }}
                                  />
                                </View>
                                <Text style={styles.cardTitleTextStyle}>
                                  {item.actualName
                                    ? item.actualName.trim()
                                    : ""}
                                </Text>
                              </View>
                              <View
                                style={{
                                  height: 35,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    marginTop: -5,
                                  }}
                                >
                                  {indicators}
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                      </Pages>
                    </View>
                    <TouchableOpacity
                      style={styles.btnLearnMore}
                      onPress={this.openRecommendProducts}
                    >
                      <Text style={styles.txtDiscover}>Learn More</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <Text style={[styles.txtDeeper, { marginTop: marginUp }]}>
                  {this.state.messageText}
                </Text>
                <View style={styles.viewDeeper}>
                  <Image
                    style={{
                      width: "100%",
                      height: 215,
                      resizeMode: "contain",
                      alignSelf: "baseline",
                    }}
                    source={require("../../../assets/images/view_hair_profile.jpg")}
                  />
                  <TouchableOpacity
                    style={styles.btnDeeper}
                    onPress={this.OrderHairKitTrigger}
                  >
                    <Text style={styles.txtDiscover}>View Hair Profile</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={[
                    styles.txtNeed,
                    { marginTop: 25, textAlign: "center" },
                  ]}
                >
                  Track Your Hair Journey
                </Text>
                <View style={styles.viewDeeper}>
                  <Image
                    style={{
                      width: "100%",
                      height: 245,
                      resizeMode: "cover",
                      alignSelf: "baseline",
                      top: 5,
                    }}
                    source={require("../../../assets/images/network-cellphone.jpg")}
                  />
                  <TouchableOpacity
                    style={styles.btnDeeper1}
                    onPress={this.openHairDiary}
                  >
                    <Text style={styles.txtDiscover}>Add To Hair Diary</Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.txtNeed,
                    { marginTop: 50, textAlign: "center" },
                  ]}
                >
                  Get Expert Advice
                </Text>
                <TouchableOpacity
                  style={{
                    height: 215,
                    marginStart: moderateScale(10),
                    marginEnd: moderateScale(10),
                  }}
                  onPress={this.openConsult}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: 215,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                    source={require("../../../assets/images/need_talk.png")}
                  />
                </TouchableOpacity>

                <Text style={[styles.txtNeed, { textAlign: "center" }]}>
                  Request A Stylist
                </Text>
                <TouchableOpacity
                  style={{
                    height: 215,
                    marginStart: moderateScale(10),
                    marginTop: moderateScale(5),
                    marginEnd: moderateScale(10),
                  }}
                  onPress={this.openStylist}
                >
                  <Image
                    style={{ width: "100%", height: 215, alignSelf: "center" }}
                    source={require("../../../assets/images/hair_stylist.jpg")}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }

  onScrollEnd = (pageNumber) => {
    if (pageNumber === 0) {
      this.setState({
        page: pageNumber,
      });
    } else if (pageNumber === 1) {
      this.setState({
        page: pageNumber,
      });
    } else if (pageNumber === 2) {
      this.setState({
        page: pageNumber,
      });
    }
  };
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
  imageStyle: {
    resizeMode: "contain",
    width: "45%",
    height: 40,
    alignSelf: "center",
    marginTop: moderateScale(60),
  },
  subHeading: {
    fontFamily:
      Platform.OS == "ios"
        ? "JoulesetJaquesHandUpright-Reg"
        : "Joules-et-Jaques-Hand-Upright-",
    textAlign: "center",
    fontSize: moderateScale(18),
    marginTop: -6,
    paddingTop: 4,
  },
  requestButtonStyle: {
    alignItems: "center",
    flexDirection: "column",
    marginEnd: moderateScale(20),
  },
  imageNew: {
    borderRadius: 40 / 2,
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
  },
  imageInnerNew: {
    borderRadius: 35 / 2,
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#EEF8FA",
    justifyContent: "center",
    alignItems: "center",
  },
  txtRecommend: {
    fontFamily: "AbsaraSans-Regular",
    fontSize: moderateScale(16),
    color: "black",
    textAlign: "center",
  },
  hairTipOfDay: {
    backgroundColor: colors.lightGrey,
    margin: 10,
    borderRadius: 10,
    height: moderateScale(200),
    flex: 1,
    alignItems: "flex-start",
  },
  txtDeeper: {
    fontFamily: "AbsaraSans-Regular",
    fontSize: moderateScale(16),
    color: "black",
    marginTop: moderateScale(80),
    textAlign: "center",
  },
  boxStyle: {
    width: moderateScale(150),
    height: moderateScale(150),
    alignSelf: "flex-end",
    borderColor: "white",
    borderRadius: 10,
    marginTop: moderateScale(-175),
    marginRight: moderateScale(12),
    borderColor: "#C9C9C9",
    borderRadius: 16,
    borderWidth: 0.9,
  },
  textStyle: {
    width: "48%",
    alignContent: "center",
    height: moderateScale(130),
  },
  viewDeeper: {
    marginStart: moderateScale(10),
    marginEnd: moderateScale(5),
    marginTop: moderateScale(10),
  },
  btnDeeper: {
    width: 220,
    height: 30,
    backgroundColor: "#D5B8AF",
    alignSelf: "center",
    marginTop: moderateScale(-50),
    justifyContent: "center",
    alignItems: "center",
  },
  btnDeeper1: {
    width: 220,
    height: 30,
    backgroundColor: "#383838",
    alignSelf: "center",
    marginTop: moderateScale(-40),
    justifyContent: "center",
    alignItems: "center",
  },

  btnBookVirtualAppointment: {
    width: 160,
    height: 30,
    backgroundColor: "#383838",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  btnLearnMore: {
    width: 160,
    height: 30,
    backgroundColor: "#383838",
    alignSelf: "center",
    marginTop: moderateScale(-85),
    justifyContent: "center",
    alignItems: "center",
  },
  txtNeed: {
    fontFamily: "AbsaraSans-Regular",
    fontSize: moderateScale(16),
    color: "black",
    marginTop: moderateScale(22),
  },
  txtDiscover: {
    fontFamily: "AbsaraSans-Bold",
    fontSize: moderateScale(15),
    color: "white",
    textAlign: "center",
    alignSelf: "center",
  },
  cardImageView: {
    justifyContent: "center",
    alignItems: "center",
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(120),
    marginStart: moderateScale(62),
    marginEnd: moderateScale(80),
    backgroundColor: Colors.white,
  },
  bgRecommended: {
    marginStart: moderateScale(10),
    marginEnd: moderateScale(10),
    marginTop: moderateScale(4),
    height: 200,
  },
  cardTitleTextStyle: {
    fontSize: moderateScale(12),
    fontFamily: "BentonSans-Regular",
    textAlign: "center",
    color: "#383838",
    marginEnd: moderateScale(60),
    marginStart: moderateScale(60),
    marginTop: moderateScale(10),
  },
  imageStyleDot: {
    resizeMode: "contain",
    marginTop: moderateScale(-5),
    height: moderateScale(16),
    width: moderateScale(16),
  },
});
