import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { moderateScale } from "../../../helpers/ResponsiveFonts";
import Colors from "../../../constants/colors";
import SafeAreaView from "../../../components/common/SafeView";
import { FlatListSlider } from "react-native-flatlist-slider";
import Header from "../../common/HeaderBlack";
import colors from "../../../constants/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { baseUrlLive, baseUrlStaging } from "../../../constants/url";
import { ActionSheet, Root } from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import Loader from "../../common/loader";

const width = Dimensions.get("screen").width;
//const CustomerTypeId = "1";
// hakeemo@mailinator.com/Hakeem@123!
export default class MyHairProfile extends Component {
  constructor(props) {
    super(props);
    console.log("MyHairProfile...14");
    this.state = {
      data: null,
      isLoading: false,
      topSelected: true,
      topRightSelected: false,
      bottomSelected: false,
      bottomRightSelected: false,
      crownSelected: false,
      CustomerTypeId: props.user.CustomerTypeId,
      observationViewShow: false,
      hairHealthViewShow: false,
      hairHealthViewShow1: false,
      labsNotesViewShow: false,

      productSelected: true,
      ingredientsSelected: false,
      regimensSelected: false,

      dataDetails: null,
      selectedProductCategory: "",
      productCategories: [],
      productSections: [],
      essentialproductOnly: [],
      stylingProductOnly: [],
      pageEssential: 0,
      //styling products
      selectedStylingProductCategory: "",
      stylingProductCategories: [],
      stylingProductSections: [],
      stylingProductOnly: [],
      ingredientDetailModel: [],
      localPath: "",
      imageData: null,
      thumbNailImage: "",
    };
  }

  static navigationOptions = {
    headerTransparent: true,
    gestureEnabled: true,
    disabledBackGesture: false,
  };

  cameraAction = () => {
    this.props.navigation.navigate("Work");
  };
  // back handler method to go back to previous screen
  backHandler = () => {
    this.props.navigation.pop();
  };
  //
  componentDidMount() {
    this.fetchHairProfile();
    //CustomerTypeId = this.props.user.CustomerTypeId;
    const data = this.props.user;
    console.log("HairProfile: " + JSON.stringify(this.props));
    //  var url = // `${baseUrlLive}HairProfile/GetHairProfile?token=`+data.access_token;
    var url =
      `${baseUrlLive}HairProfile/GetHairProfile2?token=` + data.access_token;
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
        this.setState({ data: result });
      })
      .catch((err) => {
        console.log("error 48 MyHairProfile", err);
      });
  }

  fetchHairProfile = () => {
    this.setState({ isLoading: true });
    const token = `Bearer ${this.props.user.access_token}`;
    const userId = this.props.user.Id;
    let obj = { UserId: userId };
    var url = `${baseUrlLive}HairProfile/GetHairProfileCustomer`;
    console.log("Access Token: " + token);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          JSON.stringify(responseJson),
          " HairProfile/GetHairProfileCustomer"
        );
        this.setState({ isLoading: false });
        // console.log(responseJson.data.UserUploadedImage);
        if (responseJson.data != null) {
          this.setState({ imageData: responseJson.data.UserUploadedImage });
          //this.storeData("");
        } else {
          // Alert.alert("Alert", "Please try again !!");
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        Alert.alert("Alert", "Please try again !!");
      });
  };

  // setCurrentProducts = (parentCategory) => {
  //   var productSections = [];
  //   if (
  //     parentCategory.productsTypes != undefined &&
  //     parentCategory.productsTypes.length > 0
  //   ) {
  //     parentCategory.productsTypes.forEach((element) => {
  //       var section = {};
  //       section.title = element.productTypeName;
  //       section.data = element.products;
  //       productSections.push(section);
  //     });
  //   }
  //   return productSections;
  // };
  setCurrentProducts = (parentCategory) => {
    var productSections = [];
    var data = [];
    if (
      parentCategory.productsTypes != undefined &&
      parentCategory.productsTypes.length > 0
    ) {
      parentCategory.productsTypes.forEach((element) => {
        var section = {};

        section.title = element.productTypeName;
        section.data = element.products;
        for (var i = 0; i < element.products.length; i++) {
          // console.log("Console data   " + i + "   " + element.Products[i].Id);

          data.push({
            id: element.products[i].id,
            brandName: element.products[i].brandName,
            imageName: element.products[i].imageName,
            productDetails: element.products[i].productDetails,
            productLink: element.products[i].productLink,
            productName: element.products[i].productName,
            productType: element.products[i].productType,
            value: false,
          });
        }
      });
    }
    return data;
  };
  getProfileDetails(profileId) {
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
        console.log("HairProfileDetailsResult: " + JSON.stringify(result));
        this.setState({ isLoading: false });
        var productCategories = [];
        var productSections = [];
        var selectedProductCategory = "";
        if (
          result.productDetailModel != undefined &&
          result.productDetailModel.length > 0
        ) {
          result.productDetailModel.forEach((element) => {
            var item = {
              label: element.productParentName,
              value: "" + element.productId,
              icon: () => null, //<Icon name="check" size={18} color="#900" />,
            };
            productCategories.push(item);
          });
          productSections = this.setCurrentProducts(
            result.productDetailModel[0]
          );
          selectedProductCategory = productCategories[0].value;
        }

        //styling products
        var stylingProductCategories = [];
        var stylingProductSections = [];
        var selectedStylingProductCategory = "";
        if (
          result.recommendedProductsStyling != undefined &&
          result.recommendedProductsStyling.length > 0
        ) {
          result.recommendedProductsStyling.forEach((element) => {
            var item = {
              label: element.productParentName,
              value: "" + element.productId,
              icon: () => null, //<Icon name="check" size={18} color="#900" />,
            };
            stylingProductCategories.push(item);
          });
          //
          stylingProductSections = this.setCurrentProducts(
            result.recommendedProductsStyling[0]
          );
          selectedStylingProductCategory = stylingProductCategories[0].value;
        }

        this.setState({
          dataDetails: result,
          ingredientDetailModel: result.ingredientDetailModel,
          productDetailModel: result.productDetailModel,
          productCategories: productCategories,
          productSections: productSections,

          selectedProductCategory: selectedProductCategory,
          stylingProductCategories: stylingProductCategories,
          stylingProductSections: stylingProductSections,
          selectedStylingProductCategory: selectedStylingProductCategory,
        });

        this.setState({
          essentialproductOnly:
            productSections.length > 0 ? productSections : [],
        });

        this.setState({
          stylingProductOnly:
            stylingProductSections.length > 0 ? stylingProductSections : [],
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log("error 151", err);
      });
  }

  goToRecommendations = (startingTab) => {
    // console.log(this.state.data.profileId);
    this.setState({
      productSelected: false,
      ingredientsSelected: false,
      regimensSelected: false,
    });
  };

  recommendation = (check) => {
    const { productSelected, ingredientsSelected, regimensSelected } =
      this.state;
    console.log("checkis", check);
    // if (check) {
    //   return (
    //     <View
    //       style={{
    //         width: "100%",
    //         marginTop: 30,
    //       }}
    //     >
    //       {this.sectionTitle("Recommended for you")}
    //       <View
    //         style={{
    //           width: "90%",
    //           flexDirection: "row",
    //           marginLeft: 15,
    //           marginRight: 15,
    //           // alignSelf: "flex-start",
    //           // justifyContent: "space-around",
    //         }}
    //       >
    //         <TouchableOpacity
    //           onPress={() => {
    //             //this.goToRecommendations("products");
    //             // this.setState({
    //             //   productSelected: !productSelected,
    //             // });
    //           }}
    //           style={productSelected ? styles.selectedTab : styles.normalTab}
    //         >
    //           <Text
    //             style={
    //               productSelected ? styles.selectedText : styles.normalText
    //             }
    //           >
    //             Products
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   );
    // } else {
    return (
      <View
        style={{
          width: "100%",
          marginTop: 30,
        }}
      >
        {this.sectionTitle("Recommended for you")}
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            marginLeft: 15,
            marginRight: 15,
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.goToRecommendations("products");
              this.setState({
                productSelected: !productSelected,
              });
            }}
            style={productSelected ? styles.selectedTab : styles.normalTab}
          >
            <Text
              style={productSelected ? styles.selectedText : styles.normalText}
            >
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ingredientsSelected ? styles.selectedTab : styles.normalTab}
            onPress={() => {
              this.goToRecommendations("ingredients");
              this.setState({
                ingredientsSelected: !ingredientsSelected,
              });
            }}
          >
            <Text
              style={
                ingredientsSelected ? styles.selectedText : styles.normalText
              }
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={regimensSelected ? styles.selectedTab : styles.normalTab}
            onPress={() => {
              this.goToRecommendations("regimes");
              this.setState({
                regimensSelected: !regimensSelected,
              });
            }}
          >
            <Text
              style={regimensSelected ? styles.selectedText : styles.normalText}
            >
              Regimens
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    // }
  };

  sectionTitle(title) {
    // if (
    //   this.state.CustomerTypeId === 1 &&
    //   (title == "Photos Input" || title == "Myavana TV")
    // ) {
    //   return;
    // } else {
    return (
      <View
        style={{
          width: "95%",
          flexDirection: "row",
          alignSelf: "center",
          marginVertical: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontFamily: "AbsaraSans-Bold" }}>
          {title}
        </Text>
      </View>
    );
    //}
  }

  stylistDetail(title, description, style = 1) {
    return (
      <View
        style={{
          width: "95%",
          padding: 10,
          marginTop: 3,
          borderRadius: 5,
          flexDirection: "row",
          backgroundColor: style == 1 ? "#F6EFE9" : Colors.White,
        }}
      >
        <View style={{ width: "30%", flexDirection: "column" }}>
          <Text style={styles.txtStylistTitle}>{title}</Text>
        </View>
        <View style={{ width: "70%", flexDirection: "column" }}>
          <Text style={styles.txtStylistDescription}>{description}</Text>
        </View>
      </View>
    );
  }

  recommendedStylist(data) {
    return (
      <View
        style={{
          width: "100%",
          marginTop: moderateScale(20),
        }}
      >
        {this.sectionTitle("Recommended Stylist")}
        <View style={styles.bgRecommended}>
          {data.recommendedStylist.map((item, key) => (
            <View key={key}>
              <View style={{ width: width, marginBottom: 20 }}>
                {this.stylistDetail("Stylist Name", item.stylistName, 1)}
                {this.stylistDetail("Salon Name", item.salon, 0)}
                {this.stylistDetail("Email", item.email, 1)}
                {this.stylistDetail("Phone", item.phone, 0)}
                {this.stylistDetail("Website", item.website, 1)}
                {this.stylistDetail("Instagram", item.instagram, 0)}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  youTubePlayer = (videoId, title, description) => {
    this.props.navigation.navigate("Player", {
      videoId: videoId,
      title: title,
      description: description,
    });
  };

  tvItem(item, index) {
    function subStringValue(value) {
      if (value) {
        if (value.includes("embed")) {
          var url = value;
          var videoid = url.match(
            /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
          );
          if (videoid != null) {
            let result = videoid[1].split("/")[1];
            return result;
          }
        } else {
          let result = value.split("=")[1];
          if (result.includes("&")) {
            result = result.split("&")[0];
            return result;
          } else {
            return result;
          }
        }
      }
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() => this.youTubePlayer(subStringValue(item.name), "", "")}
          key={"tv" + index}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <Image
              style={{ width: moderateScale(150), height: moderateScale(100) }}
              source={{
                uri: `https://i.ytimg.com/vi/${subStringValue(
                  item.name
                )}/mqdefault.jpg`,
              }}
            />
            <Image
              style={{
                position: "absolute",
                width: moderateScale(45),
                height: moderateScale(45),
              }}
              source={require("../../../assets/images/playIcon.png")}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            // width: "88%",
            // backgroundColor: colors.red,
            // height: moderateScale(80),
            marginHorizontal: moderateScale(10),
            JustifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: "flex-start",
            // flex: 1,
          }}
        >
          <Text
            numberOfLines={6}
            ellipsizeMode="tail"
            style={{
              marginHorizontal: moderateScale(10),
              marginTop: moderateScale(8),
              fontSize: 14,
              // marginLeft: 10,
              fontFamily: "AbsaraSans-Medium",
            }}
          >
            {item.title}
          </Text>
        </View>
      </View>
    );
  }

  tvItemInsta(item, index) {
    if (
      item.ThumbNail == "http://admin.myavana.com/images/instagram.jpg" &&
      item.ThumbNail == null
    ) {
      this.setState({
        thumbNailImage: require("../../../assets/images/Iconold.png"),
      });
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("WebViewScreen", { url: item.name })
          }
          key={"insta" + index}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            {item.thumbNail ==
              "http://admin.myavana.com/images/instagram.jpg" ||
            item.thumbNail == null ||
            item.thumbNail == "" ? (
              <Image
                style={{
                  width: moderateScale(150),
                  height: moderateScale(100),
                }}
                source={require("../../../assets/images/Iconold.png")}
              />
            ) : (
              <Image
                style={{
                  width: moderateScale(150),
                  height: moderateScale(100),
                }}
                source={{
                  uri: item.thumbNail,
                }}
              />
            )}
            <Image
              style={{
                position: "absolute",
                width: moderateScale(35),
                height: moderateScale(35),
              }}
              source={require("../../../assets/images/playIconInstagram.png")}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            // width: "88%",
            // backgroundColor: colors.red,
            // height: moderateScale(80),
            marginHorizontal: moderateScale(10),
            JustifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: "flex-start",
            // flex: 1,
          }}
        >
          <Text
            numberOfLines={6}
            ellipsizeMode="tail"
            style={{
              marginHorizontal: moderateScale(10),
              marginTop: moderateScale(8),
              fontSize: 14,
              // marginLeft: 10,
              fontFamily: "AbsaraSans-Medium",
            }}
          >
            {item.title}
          </Text>
        </View>
      </View>
    );
  }

  hairSection(
    imageTitle,
    image,
    strandDiameter,
    healthText,
    observationValues,
    health
  ) {
    function ext(url) {
      return (url = url.substr(1 + url.lastIndexOf("/")).split("?")[0])
        .split("#")[0]
        .substr(url.lastIndexOf("."));
    }
    const { hairHealthViewShow, labsNotesViewShow, observationViewShow } =
      this.state;

    console.log("observationValues", observationValues);
    var items = [];
    var observationView = null;

    observationView = (
      <>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() =>
            this.setState({ observationViewShow: !observationViewShow })
          }
        >
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: moderateScale(25),
                  height: moderateScale(25),
                }}
                source={require("../../../assets/images/eyeIcon.png")}
              />
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 10,
                  fontFamily: "AbsaraSans-Bold",
                }}
              >
                Observation
              </Text>
            </View>

            <View style={{ flex: 1 }}></View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  width: 12,
                  height: 8,
                }}
                source={
                  observationViewShow
                    ? require("../../../assets/images/drop_up.png")
                    : require("../../../assets/images/drop_down.png")
                }
              />
            </View>
          </View>
        </TouchableOpacity>
        {observationViewShow ? (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {/*   {items} */}
            <FlatList
              columnWrapperStyle={{ justifyContent: "space-evenly" }}
              data={observationValues}
              numColumns={2}
              listKey={(item, index) => `_key${index.toString()}`}
              keyExtractor={(item, index) =>
                "observation" + item.id + item.name
              }
              renderItem={(item) => (
                // console.log(item.item.name);
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 4,
                    flexDirection: "row",
                  }}
                  key={"observation"}
                >
                  <Text
                    style={{ fontSize: 12, fontFamily: "AbsaraSans-Regular" }}
                  >
                    {item.item.name}
                  </Text>
                  <View style={{ width: 10 }} />
                  <Text
                    style={{
                      backgroundColor: Colors.greyBackground,
                      fontSize: 11,
                      fontFamily: "AbsaraSans-Regular",
                      textAlign: "center",
                      padding: 7,
                      borderRadius: 5,
                    }}
                  >
                    {item.item.description}
                  </Text>
                </View>
              )}
            />
          </View>
        ) : null}
      </>
    );
    // const userId = this.props.user.Id;
    // if (this.state.CustomerTypeId == 1) {
    //   console.log("this is CustomerTypeId =1");
    //   return;
    // } else {
    var images = [];
    if (image != null) {
      image.forEach((element) => {
        var check = {
          image: element,
          desc: "",
        };
        images.push(check);
      });
    }
    // }

    var healthItems = [];
    var healthText = null;
    if (health != undefined && Array.isArray(health)) {
      for (var i = 0; i < health.length; i++) {
        var isLast = i == health.length - 1;
        healthItems.push(
          <View
            style={{
              padding: 8,
              borderRadius: 8,
              marginLeft: 5,
              backgroundColor: Colors.greyBackground,
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: 11, fontFamily: "AbsaraSans-Regular" }}>
              {health[i].description}
            </Text>
          </View>
        );
      }

      if (healthItems.length > 0) {
        healthText = (
          <>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() =>
                this.setState({ hairHealthViewShow: !hairHealthViewShow })
              }
            >
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(25),
                    }}
                    source={require("../../../assets/images/hair_profile.png")}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: 10,
                      fontFamily: "AbsaraSans-Bold",
                    }}
                  >
                    Hair Profile Health
                  </Text>
                </View>

                <View style={{ flex: 1 }}></View>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    style={{
                      width: 12,
                      height: 8,
                    }}
                    source={
                      hairHealthViewShow
                        ? require("../../../assets/images/drop_up.png")
                        : require("../../../assets/images/drop_down.png")
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
            {hairHealthViewShow ? (
              <View
                style={{
                  paddingLeft: 10,
                  paddingTop: 10,
                  paddingBottom: 5,
                  paddingRight: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                {healthItems}
              </View>
            ) : null}
            <View
              style={{ height: 1, marginTop: 20, backgroundColor: Colors.gray }}
            />
          </>
        );
      }
    }

    return (
      <View styles={{ width: "100%" }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "100%" }}>
            <FlatListSlider
              data={images}
              width={180}
              height={150}
              loop={false}
              separatorWidth={10}
              onPress={(item) => this.openZoomImageView(images[item].image)}
              autoscroll={images.length > 1}
              contentContainerStyle={{ overflow: "hidden" }}
            />
          </View>
        </View>
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            style={{ width: "100%", flexDirection: "row", marginTop: 20 }}
            onPress={() =>
              this.setState({ labsNotesViewShow: !labsNotesViewShow })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: moderateScale(20), height: moderateScale(20) }}
                source={require("../../../assets/images/recommendIcon.png")}
              />
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 10,
                  fontFamily: "AbsaraSans-Bold",
                }}
              >
                Lab Analyst Notes
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  width: 12,
                  height: 8,
                }}
                source={
                  labsNotesViewShow
                    ? require("../../../assets/images/drop_up.png")
                    : require("../../../assets/images/drop_down.png")
                }
              />
            </View>
          </TouchableOpacity>

          {labsNotesViewShow ? (
            <Text
              style={{
                marginTop: 20,
                marginLeft: 5,
                marginBottom: 20,
                fontSize: 12,
                fontFamily: "AbsaraSans-Thin",
              }}
            >
              {strandDiameter}
            </Text>
          ) : null}
          <View
            style={{ height: 1, marginTop: 20, backgroundColor: Colors.gray }}
          />

          {healthText}

          {observationView}
          <View
            style={{ height: 1, marginTop: 20, backgroundColor: Colors.gray }}
          />
        </View>
      </View>
    );
  }

  openZoomImageView = (image) => {
    this.props.navigation.navigate("ZoomImage", { image: image });
  };

  topSection = (data) => {
    var left = data.topLeft;
    return (
      <View style={{ width: "90%", alignSelf: "center" }}>
        {this.hairSection(
          "Top Left",
          left.topLeftPhoto,
          left.topLeftStrandDiameter,
          left.topLeftHealthText,
          left.observationValues,
          left.health
        )}
      </View>
    );
  };

  topRightSection = (data) => {
    var right = data.topRight;
    return (
      <View style={{ width: "90%", alignSelf: "center" }}>
        {this.hairSection(
          "Top Right",
          right.topRightPhoto,
          right.topRightStrandDiameter,
          right.topRightHealthText,
          right.observationValues,
          right.health
        )}
      </View>
    );
  };

  bottomSection = (data) => {
    var left = data.bottomLeft;

    return (
      <View style={{ width: "90%", alignSelf: "center" }}>
        {this.hairSection(
          "Bottom Left",
          left.bottomLeftPhoto,
          left.bottomLeftStrandDiameter,
          left.bottomLeftHealthText,
          left.observationValues,
          left.health
        )}
      </View>
    );
  };

  bottomRightSection = (data) => {
    var right = data.bottomRight;
    return (
      <View style={{ width: "90%", alignSelf: "center" }}>
        {this.hairSection(
          "Bottom Right",
          right.bottomRightPhoto,
          right.bottomRightStrandDiameter,
          right.bottomRightHealthText,
          right.observationValues,
          right.health
        )}
      </View>
    );
  };

  crownSection = (data) => {
    var row = data.crownStrand;
    return (
      <View style={{ width: "90%", alignSelf: "center" }}>
        {this.hairSection(
          "Crown",
          row.crownPhoto,
          row.crownStrandDiameter,
          row.crownHealthText,
          row.observationValues,
          row.health
        )}
      </View>
    );
  };

  productSection = (data) => {
    var row = data.crownStrand;
    return (
      <View style={{ width: "90%", alignSelf: "center" }}>
        {this.hairSection(
          "Crown",
          row.crownPhoto,
          row.crownStrandDiameter,
          row.crownHealthText,
          row.observationValues,
          row.health
        )}
      </View>
    );
  };
  allReset = () => {
    this.setState({
      topSelected: false,
      topRightSelected: false,
      bottomSelected: false,
      bottomRightSelected: false,
      crownSelected: false,
    });
  };

  regimeDetailsPage = (item) => {
    this.props.navigation.navigate("RegimeDetails", { item: item });
  };

  ingredientDetailsPage = (item) => {
    this.props.navigation.navigate("IngredientDetails", { item: item });
  };

  productDetailsPage = (item) => {
    this.props.navigation.navigate("ProductDetails", { item: item });
  };

  buyProduct = (item) => {
    Linking.openURL(item.productLink);
  };

  ingredientsList = (ingredientDetailModel) => {
    return (
      <FlatList
        data={ingredientDetailModel}
        renderItem={this.ingredientsRow}
        keyExtractor={(item, index) => "ingredient" + index.toString()}
        listKey={(item, index) => `_key${index.toString()}`}
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      />
    );
  };

  updateExpand = (index) => {
    //  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.ingredientDetailModel];

    array[index]["expanded"] = !array[index]["expanded"];

    this.setState({ ingredientDetailModel: array });
  };

  // updateExpand2 = (index) => {
  //   const array = [...this.state.essentialproductOnly];
  //   array[index]["expanded"] = !array[index]["expanded"];
  //   console.log("index", index);

  //   this.setState({ essentialproductOnly: array });
  // };

  // updateExpand3 = (index) => {
  //   const array = [...this.state.stylingProductOnly];
  //   array[index]["expanded"] = !array[index]["expanded"];
  //   console.log("index", index);

  //   this.setState({ stylingProductOnly: array });
  // };
  updateExpand2 = (index) => {
    const array = [...this.state.essentialproductOnly];
    array[index].value = !array[index].value;
    console.log("index", index);

    this.setState({ essentialproductOnly: array });
  };

  updateExpand3 = (index) => {
    const array = [...this.state.stylingProductOnly];
    array[index].value = !array[index].value;
    console.log("index", index);

    this.setState({ stylingProductOnly: array });
  };
  ingredientsRow = ({ item, index }) => {
    console.log("index=", index);
    return (
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={
            () => this.updateExpand(index)
            //this.setState({ hairHealthViewShow1: !hairHealthViewShow1 })
          }
          key={"ingredients" + index}
        >
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontFamily: "AbsaraSans-Bold", fontSize: 16 }}>
              {item.name}
            </Text>

            <View style={{ flex: 1 }}></View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  width: 12,
                  height: 8,
                }}
                source={
                  item.expanded
                    ? require("../../../assets/images/drop_up.png")
                    : require("../../../assets/images/drop_down.png")
                }
              />
            </View>
          </View>
        </TouchableOpacity>
        {item.expanded ? (
          <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
            <View style={{ marginLeft: 10, width: "40%" }}>
              <Image
                style={{ height: 120, width: 120 }}
                resizeMode="contain"
                source={{ uri: item.imageUrl }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <Text
                  numberOfLines={4}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: "AbsaraSans-Regular",
                    fontSize: 14,
                  }}
                >
                  {item.ingredientDescription}
                </Text>
              </View>
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => this.ingredientDetailsPage(item)}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "AbsaraSans-Bold",
                      fontSize: moderateScale(12),
                      color: Colors.lightPink,
                      marginTop: 10,
                    }}
                  >
                    Read More {" >"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
        <View style={{ paddingRight: 10, paddingTop: 5 }}>
          <View
            style={{ width: "100%", height: 1, backgroundColor: "#d3d3d3" }}
          />
        </View>
      </View>
    );
  };

  regimesList = (data) => {
    return (
      <FlatList
        data={data}
        renderItem={({ item, index }) => this.regimeRow(item, index)}
        keyExtractor={(item, index) => "regime" + index.toString()}
        listKey={(item, index) => `_key${index.toString()}`}
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          paddingTop: 10,
        }}
      />
    );
  };

  regimeRow = (item, index) => {
    return (
      <View
        style={{ width: "100%", height: moderateScale(130) }}
        key={"regime" + index}
      >
        <View
          style={{
            backgroundColor: "#fff",
            flex: 1,
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "AbsaraSans-Bold",
              fontSize: 14,
              color: colors.Black,
            }}
          >
            {item.regimenName}
          </Text>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{
              fontFamily: "AbsaraSans-Regular",
              fontSize: 14,
              marginTop: 10,
              color: colors.Black,
            }}
          >
            {item.regimenDescription}
          </Text>
          <TouchableOpacity
            onPress={() => this.regimeDetailsPage(item)}
            style={{
              marginTop: 10,
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                fontFamily: "AbsaraSans-Bold",
                fontSize: moderateScale(12),
                color: Colors.lightPink,
              }}
            >
              Read More {" >"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingRight: 10, marginBottom: 15 }}>
          <View
            style={{ width: "100%", height: 1, backgroundColor: "#d3d3d3" }}
          />
        </View>
      </View>
    );
  };
  moveToProduct = (categoryTitle, data, defaultCategory) => {
    this.props.navigation.navigate("CategoriesProductDetail", {
      CategoryName: categoryTitle,
      productList: data,
      selectedProductCategory: defaultCategory,
    });
  };

  // productListItem = ({ item, index }) => {
  //   console.log("productListItem", item);

  //   return (
  //     <View>
  //       {item.data.map((element) => {
  //         return (
  //           <View
  //             style={{
  //               width: "94%",
  //               marginLeft: 10,
  //               marginRight: 10,
  //               marginTop: 5,
  //               marginBottom: 5,
  //             }}
  //             key={"product1" + index}
  //           >
  //             <TouchableOpacity
  //               style={{ width: "100%" }}
  //               onPress={() => this.updateExpand2(index)}
  //             >
  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   marginTop: 10,
  //                   marginBottom: 10,
  //                 }}
  //               >
  //                 <View style={{ width: "80%" }}>
  //                   <Text
  //                     style={{
  //                       fontFamily: "AbsaraSans-Bold",
  //                       fontSize: 14,
  //                     }}
  //                   >
  //                     {element.productName ? element.productName.trim() : ""}
  //                   </Text>
  //                 </View>
  //                 <View style={{ flex: 1 }}></View>
  //                 <View
  //                   style={{ alignItems: "center", justifyContent: "center" }}
  //                 >
  //                   <Image
  //                     style={{
  //                       width: 12,
  //                       height: 8,
  //                     }}
  //                     source={
  //                       item.expanded
  //                         ? require("../../../assets/images/drop_up.png")
  //                         : require("../../../assets/images/drop_down.png")
  //                     }
  //                   />
  //                 </View>
  //               </View>
  //             </TouchableOpacity>

  //             {item.expanded ? (
  //               <View style={{ flexDirection: "row" }}>
  //                 <View style={[styles.cardImageView, { width: "30%" }]}>
  //                   <Image
  //                     style={{
  //                       marginTop: moderateScale(0),
  //                       width: moderateScale(100),
  //                       height: moderateScale(100),
  //                       backgroundColor: "#C5C2BD",
  //                       marginStart: moderateScale(4),
  //                     }}
  //                     source={{ uri: element.imageName }}
  //                   />
  //                 </View>

  //                 <View style={{ width: "65%", marginLeft: 10 }}>
  //                   <Text
  //                     style={{
  //                       marginTop: moderateScale(10),
  //                       fontSize: moderateScale(12),
  //                       fontFamily: "AbsaraSans-Regular",
  //                       color: "#C5C2BD",
  //                     }}
  //                   >
  //                     Brand Name:{" "}
  //                     {element.brandName ? element.brandName.trim() : ""}
  //                   </Text>
  //                   <Text style={styles.cardTitleTextStyle}>
  //                     {element.productName ? element.productName.trim() : ""}
  //                   </Text>

  //                   <View style={{ marginTop: moderateScale(10) }}>
  //                     <TouchableOpacity
  //                       onPress={() => this.productDetailsPage(element)}
  //                       style={{ padding: 5 }}
  //                     >
  //                       <Text
  //                         style={{
  //                           fontFamily: "AbsaraSans-Bold",
  //                           fontSize: moderateScale(12),
  //                           color: Colors.lightPink,
  //                         }}
  //                       >
  //                         View Product{" >"}
  //                       </Text>
  //                     </TouchableOpacity>
  //                   </View>
  //                 </View>
  //               </View>
  //             ) : null}

  //             <View style={{ paddingTop: 5 }}>
  //               <View
  //                 style={{
  //                   width: "100%",
  //                   height: 1,
  //                   backgroundColor: "#d3d3d3",
  //                 }}
  //               />
  //             </View>
  //           </View>
  //         );
  //       })}
  //     </View>
  //   );
  // };

  // productListItem2 = ({ item, index }) => {
  //   console.log("productList", item);

  //   return (
  //     <View>
  //       {item.data.map((element) => {
  //         return (
  //           <View
  //             style={{
  //               width: "94%",
  //               marginLeft: 10,
  //               marginRight: 10,
  //               marginTop: 5,
  //               marginBottom: 5,
  //             }}
  //             key={"product2" + index}
  //           >
  //             <TouchableOpacity
  //               style={{ width: "100%" }}
  //               onPress={
  //                 () => this.updateExpand3(index)
  //                 //this.setState({ hairHealthViewShow1: !hairHealthViewShow1 })
  //               }
  //             >
  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   marginTop: 10,
  //                   marginBottom: 10,
  //                 }}
  //               >
  //                 <View style={{ width: "80%" }}>
  //                   <Text
  //                     style={{
  //                       fontFamily: "AbsaraSans-Bold",
  //                       fontSize: 14,
  //                     }}
  //                   >
  //                     {element.productName ? element.productName.trim() : ""}
  //                   </Text>
  //                 </View>
  //                 <View style={{ flex: 1 }}></View>
  //                 <View
  //                   style={{ alignItems: "center", justifyContent: "center" }}
  //                 >
  //                   <Image
  //                     style={{
  //                       width: 12,
  //                       height: 8,
  //                     }}
  //                     source={
  //                       item.expanded
  //                         ? require("../../../assets/images/drop_up.png")
  //                         : require("../../../assets/images/drop_down.png")
  //                     }
  //                   />
  //                 </View>
  //               </View>
  //             </TouchableOpacity>

  //             {item.expanded ? (
  //               <View style={{ flexDirection: "row" }}>
  //                 <View style={[styles.cardImageView, { width: "30%" }]}>
  //                   <Image
  //                     style={{
  //                       marginTop: moderateScale(0),
  //                       width: moderateScale(100),
  //                       height: moderateScale(100),
  //                       backgroundColor: "#C5C2BD",
  //                       marginStart: moderateScale(4),
  //                     }}
  //                     source={{ uri: element.imageName }}
  //                   />
  //                 </View>

  //                 <View style={{ width: "65%", marginLeft: 10 }}>
  //                   <Text
  //                     style={{
  //                       marginTop: moderateScale(10),
  //                       fontSize: moderateScale(12),
  //                       fontFamily: "AbsaraSans-Regular",
  //                       color: "#C5C2BD",
  //                     }}
  //                   >
  //                     Brand Name:{" "}
  //                     {element.brandName ? element.brandName.trim() : ""}
  //                   </Text>
  //                   <Text style={styles.cardTitleTextStyle}>
  //                     {element.productName ? element.productName.trim() : ""}
  //                   </Text>

  //                   <View style={{ marginTop: moderateScale(10) }}>
  //                     <TouchableOpacity
  //                       onPress={() => this.productDetailsPage(element)}
  //                       style={{ padding: 5 }}
  //                     >
  //                       <Text
  //                         style={{
  //                           fontFamily: "AbsaraSans-Bold",
  //                           fontSize: moderateScale(12),
  //                           color: Colors.lightPink,
  //                         }}
  //                       >
  //                         View Product{" >"}
  //                       </Text>
  //                     </TouchableOpacity>
  //                   </View>
  //                 </View>
  //               </View>
  //             ) : null}

  //             <View style={{ paddingTop: 5 }}>
  //               <View
  //                 style={{
  //                   width: "100%",
  //                   height: 1,
  //                   backgroundColor: "#d3d3d3",
  //                 }}
  //               />
  //             </View>
  //           </View>
  //         );
  //       })}
  //     </View>
  //   );
  // };
  productListItem = ({ item, index }) => {
    // console.log(" productListItem item " + JSON.stringify(item));

    return (
      <View
        style={{
          width: "94%",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          marginBottom: 5,
        }}
        key={"product1" + index}
      >
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() =>
            //console.log("index value" + index)

            this.updateExpand2(index)
          }
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontFamily: "AbsaraSans-Bold",
                  fontSize: 14,
                  color: colors.Black,
                }}
              >
                {item.productName ? item.productName.trim() : ""}
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  width: 12,
                  height: 8,
                }}
                source={
                  item.value
                    ? require("../../../assets/images/drop_up.png")
                    : require("../../../assets/images/drop_down.png")
                }
              />
            </View>
          </View>
        </TouchableOpacity>

        {item.value ? (
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.cardImageView, { width: "30%" }]}>
              <Image
                style={{
                  marginTop: moderateScale(0),
                  width: moderateScale(100),
                  height: moderateScale(100),
                  backgroundColor: "#C5C2BD",
                  marginStart: moderateScale(4),
                }}
                source={{ uri: item.imageName }}
              />
            </View>

            <View style={{ width: "65%", marginLeft: 10 }}>
              <Text
                style={{
                  marginTop: moderateScale(10),
                  fontSize: moderateScale(12),
                  fontFamily: "AbsaraSans-Regular",
                  color: "#C5C2BD",
                }}
              >
                Brand Name: {item.brandName ? item.brandName.trim() : ""}
              </Text>
              <Text style={styles.cardTitleTextStyle}>
                {item.productName ? item.productName.trim() : ""}
              </Text>

              <View style={{ marginTop: moderateScale(10) }}>
                <TouchableOpacity
                  onPress={() => this.productDetailsPage(item)}
                  style={{ padding: 5 }}
                >
                  <Text
                    style={{
                      fontFamily: "AbsaraSans-Bold",
                      fontSize: moderateScale(12),
                      color: Colors.lightPink,
                    }}
                  >
                    View Product{" >"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ paddingTop: 5 }}>
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#d3d3d3",
            }}
          />
        </View>
      </View>
    );
  };
  productListItem2 = ({ item, index }) => {
    return (
      <View
        style={{
          width: "94%",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          marginBottom: 5,
        }}
        key={"product2" + index}
      >
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => this.updateExpand3(index)}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontFamily: "AbsaraSans-Bold",
                  fontSize: 14,
                  color: colors.Black,
                }}
              >
                {item.productName ? item.productName.trim() : ""}
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                style={{
                  width: 12,
                  height: 8,
                }}
                source={
                  item.value
                    ? require("../../../assets/images/drop_up.png")
                    : require("../../../assets/images/drop_down.png")
                }
              />
            </View>
          </View>
        </TouchableOpacity>

        {item.value ? (
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.cardImageView, { width: "30%" }]}>
              <Image
                style={{
                  marginTop: moderateScale(0),
                  width: moderateScale(100),
                  height: moderateScale(100),
                  backgroundColor: "#C5C2BD",
                  marginStart: moderateScale(4),
                }}
                source={{ uri: item.imageName }}
              />
            </View>

            <View style={{ width: "65%", marginLeft: 10 }}>
              <Text
                style={{
                  marginTop: moderateScale(10),
                  fontSize: moderateScale(12),
                  fontFamily: "AbsaraSans-Regular",
                  color: "#C5C2BD",
                }}
              >
                Brand Name: {item.brandName ? item.brandName.trim() : ""}
              </Text>
              <Text style={styles.cardTitleTextStyle}>
                {item.productName ? item.productName.trim() : ""}
              </Text>

              <View style={{ marginTop: moderateScale(10) }}>
                <TouchableOpacity
                  onPress={() => this.productDetailsPage(item)}
                  style={{ padding: 5 }}
                >
                  <Text
                    style={{
                      fontFamily: "AbsaraSans-Bold",
                      fontSize: moderateScale(12),
                      color: Colors.lightPink,
                    }}
                  >
                    View Product{" >"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ paddingTop: 5 }}>
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#d3d3d3",
            }}
          />
        </View>
      </View>
    );
  };
  productsList = (
    data,
    categories,
    categoryTitle,
    defaultCategory,
    isEssential = false
  ) => {
    console.log("productsListData", categories);
    return (
      <View
        style={{ backgroundColor: "#fff", overflow: "hidden", padding: 10 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: moderateScale(16),
              backgroundColor: "#fff",
              fontFamily: "AbsaraSans-Bold",
            }}
          >
            {categoryTitle}
          </Text>
          <TouchableOpacity
            onPress={() => {
              var s = "";
              for (var i = 0; i < categories.length; i++) {
                if (categories[i].value == defaultCategory) {
                  s = categories[i].label;
                }
              }
              this.moveToProduct(categoryTitle, data, s);
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(16),
                backgroundColor: "#fff",
                fontFamily: "AbsaraSans-Bold",
              }}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <DropDownPicker
          items={categories}
          defaultValue={defaultCategory}
          containerStyle={{ height: 40, marginTop: moderateScale(4) }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={(item, index) => {
            if (isEssential) {
              this.setState({
                selectedProductCategory: item.value,
                productSections: this.setCurrentProducts(
                  this.state.dataDetails.productDetailModel[index]
                ),
              });
              let data = this.setCurrentProducts(
                this.state.dataDetails.productDetailModel[index]
              );
              this.setState({ essentialproductOnly: data });
            } else {
              this.setState({
                selectedStylingProductCategory: item.value,
                stylingProductSections: this.setCurrentProducts(
                  this.state.dataDetails.recommendedProductsStyling[index]
                ),
              });
              //
              let data = this.setCurrentProducts(
                this.state.dataDetails.recommendedProductsStyling[index]
              );

              this.setState({ stylingProductOnly: data });
            }
          }}
          searchable={true}
          searchablePlaceholder="Search for a category"
          searchablePlaceholderTextColor="gray"
          seachableStyle={{}}
          searchableError={() => <Text>Not Found</Text>}
        />
        <View style={styles.bgProducts}>
          <FlatList
            data={
              isEssential
                ? this.state.essentialproductOnly
                : this.state.stylingProductOnly
            }
            renderItem={
              isEssential ? this.productListItem : this.productListItem2
            }
            keyExtractor={(item, index) => "product" + index.toString()}
            listKey={(item, index) => `_key${index.toString()}`}
          />
        </View>
      </View>
    );
  };

  sectionViewForCustomers() {
    // if (this.state.CustomerTypeId === 1) {
    //   return;
    // } else {
    const {
      topSelected,
      topRightSelected,
      bottomSelected,
      bottomRightSelected,
      crownSelected,
    } = this.state;
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 10,
          paddingRight: 10,

          paddingBottom: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.allReset();
            this.setState({
              topSelected: true,
            });
          }}
          style={topSelected ? styles.selectedTab : styles.normalTab}
        >
          <Text style={topSelected ? styles.selectedText : styles.normalText}>
            Top Left
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.allReset();
            this.setState({
              topRightSelected: true,
            });
          }}
          style={topRightSelected ? styles.selectedTab : styles.normalTab}
        >
          <Text
            style={topRightSelected ? styles.selectedText : styles.normalText}
          >
            Top Right
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.allReset();
            this.setState({
              bottomSelected: true,
            });
          }}
          style={bottomSelected ? styles.selectedTab : styles.normalTab}
        >
          <Text
            style={bottomSelected ? styles.selectedText : styles.normalText}
          >
            Bottom Left
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.allReset();
            this.setState({
              bottomRightSelected: true,
            });
          }}
          style={bottomRightSelected ? styles.selectedTab : styles.normalTab}
        >
          <Text
            style={
              bottomRightSelected ? styles.selectedText : styles.normalText
            }
          >
            Bottom Right
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.allReset();
            this.setState({
              crownSelected: true,
            });
          }}
          style={crownSelected ? styles.selectedTab : styles.normalTab}
        >
          <Text style={crownSelected ? styles.selectedText : styles.normalText}>
            Crown
          </Text>
        </TouchableOpacity>
      </View>
    );
    // }
  }

  getHeader = () => {
    const {
      data,
      topSelected,
      topRightSelected,
      bottomSelected,
      bottomRightSelected,
      crownSelected,
      dataDetails,
      productSelected,
      ingredientsSelected,
      regimensSelected,
      productSections,
      productCategories,
      stylingProductSections,
      stylingProductCategories,
      ingredientDetailModel,
      imageData,
      CustomerTypeId,
    } = this.state;
    console.log("imageData ", imageData);
    return (
      <View
        style={{
          width: "100%",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 24,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "AbsaraSans-Bold",
            marginLeft: moderateScale(10),
          }}
        >
          {"Uploaded Photo of Your Hair"}
        </Text>
        <Image
          source={{ uri: imageData }}
          style={{
            width: 125,
            height: 125,
            marginVertical: moderateScale(20),
            marginLeft: moderateScale(10),
          }}
          resizeMode={"contain"}
        />
        {/* <DropDownPicker
          items={[
            { label: "Item 1", value: "item1" },
            { label: "Item 2", value: "item2" },
          ]}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          defaultIndex={0}
          containerStyle={{
            height: moderateScale(40),
            width: moderateScale(140),
            alignSelf: "flex-end",
            marginEnd: moderateScale(20),
            marginTop: moderateScale(-150),
            marginBottom: moderateScale(60),
          }}
          onChangeItem={(item) => console.log(item.label, item.value)}
        /> */}
        <Text
          style={{
            alignSelf: "flex-end",
            marginHorizontal: 20,
            fontSize: 12,
            fontFamily: "AbsaraSans-Bold",
          }}
        >
          {/*   {data.consultantNotes+" Hair Analyst"} */}
          {"Your Hair Analyst"}
        </Text>
        {/* Hair Summary */}
        {/*  {this.sectionTitle("Hair Summary")} */}
        <View
          style={{
            alignItems: "flex-end",
            marginRight: 80,
            marginTop: 10,
          }}
        >
          <Image
            style={{ height: 20, width: 16 }}
            source={require("../../../assets/images/chat_boxx.png")}
          />
        </View>
        <View
          style={{
            borderRadius: 8,
            backgroundColor: Colors.greyBackground,
            padding: 15,
            paddingRight: 15,
            marginLeft: 15,
            marginRight: 15,
          }}
        >
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 12,
              fontFamily: "AbsaraSans-Thin",
            }}
          >
            {data.healthSummary}
          </Text>
        </View>
        {/* End Hair Summary */}
        {this.sectionTitle("Photos Input")}
        {/* Hair Navigation */}
        {this.sectionViewForCustomers()}
        {/* End Hair Navigation */}
        {/* <View style={{ flex: 1 }}>
          <TouchableOpacity style={{}} onPress={this.openUploadProfile}>
            <Text
              style={[
                styles.normalText,
                styles.selectedText,
                { alignSelf: "flex-end", marginEnd: moderateScale(20), fontSize: 14, marginTop: moderateScale(-20) },
              ]}
            >
              Upload Photo
            </Text>
          </TouchableOpacity>
        </View> */}
        {topSelected ? this.topSection(data) : null}
        {topRightSelected ? this.topRightSection(data) : null}
        {bottomSelected ? this.bottomSection(data) : null}
        {bottomRightSelected ? this.bottomRightSection(data) : null}
        {crownSelected ? this.crownSection(data) : null}
        {CustomerTypeId
          ? this.recommendation(true)
          : this.recommendation(false)}
        {productSelected
          ? productSections.length > 0
            ? this.productsList(
                productSections,
                productCategories,
                "Essential Products",
                this.state.selectedProductCategory,
                true
              )
            : null
          : null}
        {productSelected
          ? stylingProductSections.length > 0
            ? this.productsList(
                stylingProductSections,
                stylingProductCategories,
                "Styling Products",
                this.state.selectedStylingProductCategory,
                false
              )
            : null
          : null}
        {ingredientsSelected
          ? this.ingredientsList(ingredientDetailModel)
          : null}
        {regimensSelected
          ? this.regimesList(dataDetails.regimenDetailModel)
          : null}
        {this.sectionTitle("Myavana TV")}
      </View>
    );
  };
  // openUploadProfile = () => {
  //   const BUTTONS = ["Take Photo", "Choose Photo From Gallery", "Cancel"];
  //   ActionSheet.show(
  //     {
  //       options: BUTTONS,
  //       cancelButtonIndex: 2,
  //       title: "Select A Photo",
  //     },
  //     (buttonIndex) => {
  //       switch (buttonIndex) {
  //         case 0:
  //           this.takePhotoFromCamera();
  //           break;
  //         case 1:
  //           this.choosePhotoFromLibrary();
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   );
  // };
  // takePhotoFromCamera = () => {
  //   ImagePicker.openCamera({
  //     compressImageMaxWidth: 500,
  //     compressImageMaxHeight: 500,
  //     compressImageQuality: 0.7,
  //     cropping: false,
  //     includeBase64: true,
  //   }).then((image) => {
  //     this.setState({ localPath: image.path });
  //     console.log("Camera photo is", localPath);
  //     {
  //       let imageType = "";
  //       if (this.state.topSelected) {
  //         imageType = "Top Left";
  //         // this.uploadProfilePicApi(image.data);
  //       } else if (this.state.topRightSelected) {
  //         imageType = "Top Right";
  //         // this.uploadProfilePicApi(image.data);
  //       } else if (this.state.bottomSelected) {
  //         imageType = "Bottom Left";
  //         // this.uploadProfilePicApi(image.data);
  //       } else if (this.state.bottomRightSelected) {
  //         imageType = "Bottom Right";
  //         // this.uploadProfilePicApi(image.data);
  //       } else {
  //         imageType = "Crown";
  //         // this.uploadProfilePicApi(image.data);
  //       }
  //     }
  //   });
  // };
  // choosePhotoFromLibrary = () => {
  //   ImagePicker.openPicker({
  //     compressImageMaxWidth: 500,
  //     compressImageMaxHeight: 500,
  //     compressImageQuality: 0.7,
  //     cropping: false,
  //     includeBase64: true,
  //   }).then((image) => {
  //     this.setState({ localPath: image.path });
  //     console.log("Library Image is:-", image.data);
  //     {
  //       let imageType = "";
  //       if (this.state.topSelected) {
  //         imageType = "Top Left";
  //         console.log("Top Left", imageType);
  //         // this.uploadProfilePicApi(image.data);
  //       } else if (this.state.topRightSelected) {
  //         imageType = "Top Right";
  //         // this.uploadProfilePicApi(image.data);
  //         console.log("Top Right", imageType);
  //       } else if (this.state.bottomSelected) {
  //         imageType = "Bottom Left";
  //         console.log("Bottom Left", imageType);
  //         // this.uploadProfilePicApi(image.data);
  //       } else if (this.state.bottomRightSelected) {
  //         imageType = "Bottom Right";
  //         console.log("Bottom Right", imageType);
  //         // this.uploadProfilePicApi(image.data);
  //       } else {
  //         imageType = "Crown";
  //         console.log("Crown", imageType);
  //         // this.uploadProfilePicApi(image.data);
  //       }
  //       //this.uploadProfilePicApi(image.data);
  //     }
  //   });
  // };
  getFooter = () => {
    const { data } = this.state;
    return (
      <View
        style={{
          width: "100%",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        }}
      >
        {data.recommendedStylist.length > 0
          ? this.recommendedStylist(data)
          : null}
        <View style={{ height: 80 }} />
      </View>
    );
  };

  render() {
    const { data } = this.state;
    // console.log("data==", data);
    if (!data) {
      return <></>;
    } else if (data.statusCode != undefined && data.statusCode != 200) {
      return (
        <>
          {/* <StatusBar backgroundColor={Colors.lightBlack} /> */}
          <SafeAreaView colorTop={Colors.lightBlack} colorBottom={Colors.white}>
            <Loader isLoading={this.state.isLoading} />
            <View
              style={{
                flexDirection: "column",
                width: "100%",
                height: "11.5%",
                backgroundColor: Colors.blackTitleFontColor,
              }}
            >
              <Header
                title={"Healthy Hair Care Plan"}
                subTitle={"Hair Profile"}
                backHandler={this.backHandler}
              />
              {/* <TouchableOpacity
                style={styles.onePartContainer}
                onPress={this.backHandler}
              >
                <Image
                  source={require("../../../assets/images/backwardIcon.png")}
                  style={styles.imageIconStyle}
                />
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 16 }}>
                Start your hair journey with MYAVANA and order your hair kit
                now!
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("OrderHairKit")}
                style={{
                  backgroundColor: "#EEDAD3",
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingHorizontal: 20,
                  marginTop: 20,
                }}
              >
                <Text>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </>
      );
    }

    return (
      <>
        <StatusBar backgroundColor={Colors.lightBlack} />
        <SafeAreaView colorTop={Colors.lightBlack} colorBottom={Colors.White}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              backgroundColor: Colors.White,
            }}
          >
            <Header
              title={"MY HAIR PROFILE"}
              subTitle={
                data.hairId != undefined &&
                data.hairId != null &&
                data.hairId != ""
                  ? "Hair id: " + data.hairId
                  : "Hair id:"
              }
              backHandler={this.backHandler}
            />

            <View style={{ width: "100%", marginTop: 20, flex: 1 }}>
              <FlatList
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{
                  flexGrow: 1,
                }}
                data={data.recommendedVideos}
                ListHeaderComponent={this.getHeader()}
                ListFooterComponent={this.getFooter()}
                numColumns={2}
                keyExtractor={(item, index) => "tv" + index.toString()}
                listKey={(item, index) => `_key${index.toString()}`}
                renderItem={({ item, index }) =>
                  item.name.includes("instagram")
                    ? this.tvItemInsta(item, index)
                    : this.tvItem(item, index)
                }
                style={{ overflow: "hidden", paddingLeft: 0, paddingRight: 0 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  topImageContainer: {
    width: "95%",
    height: 80,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#DAB6AB",
    alignItems: "center",
  },
  selectedTab: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.pink2Color,
    textDecorationLine: "underline",
  },
  normalTab: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedText: {
    color: Colors.lightPink,
    fontSize: 12,
    fontFamily: "AbsaraSans-Bold",
  },
  normalText: {
    color: "#707070",
    fontSize: 12,
    fontFamily: "AbsaraSans-Bold",
  },

  container: {
    flexGrow: 1,
  },
  maskOutter: {
    position: "absolute",
    width: "100%",
  },
  imageContainer: {
    width: moderateScale(200),
    height: moderateScale(100),
  },
  imageStyle: {
    marginBottom: moderateScale(30),
    resizeMode: "contain",
    height: moderateScale(30),
    width: moderateScale(120),
  },
  inputContainer: {
    marginLeft: moderateScale(50),
  },
  imageCircle: {
    width: moderateScale(90),
    height: moderateScale(130),
  },
  analyzeStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: Colors.blackTitleFontColor,
    textAlign: "center",
    fontSize: moderateScale(16),
    fontFamily: "AbsaraSans-Regular",
  },
  contentStyle: {
    marginLeft: moderateScale(20),
    marginTop: moderateScale(40),
  },
  snapPhotoTextStyle: {
    alignItems: "center",
    height: "10%",
    marginTop: moderateScale(30),
    marginLeft: moderateScale(35),
    marginRight: moderateScale(35),
  },
  bgRecommended: {
    marginStart: moderateScale(10),
    marginEnd: moderateScale(10),
    marginTop: moderateScale(4),
  },
  txtStylistTitle: {
    fontSize: moderateScale(14),
    fontFamily: "AbsaraSans-Bold",
  },
  txtStylistDescription: {
    fontSize: moderateScale(14),
    fontFamily: "AbsaraSans-Regular",
  },
  bgProducts: {
    marginTop: moderateScale(10),
    minHeight: moderateScale(130),
  },
  cardImageView: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleTextStyle: {
    marginTop: moderateScale(10),
    fontSize: moderateScale(12),
    fontFamily: "AbsaraSans-Regular",
    color: "#383838",
  },
  imageStyleDot: {
    resizeMode: "contain",
    height: moderateScale(16),
    width: moderateScale(16),
  },
  onePartContainer: {
    width: "20%",
    alignSelf: "flex-start",
    flexDirection: "column",
    marginStart: moderateScale(16),
    marginTop: moderateScale(-10),
  },
  imageIconStyle: {
    padding: moderateScale(5),
    width: moderateScale(10),
    height: moderateScale(15),
    marginTop: moderateScale(42),
    marginLeft: moderateScale(-2),
  },
});
