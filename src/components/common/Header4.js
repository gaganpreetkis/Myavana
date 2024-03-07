import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { moderateScale } from "../../helpers/ResponsiveFonts";
const width = Dimensions.get("screen").width;
import Colors from "../../constants/colors";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../constants/colors";

const Header4 = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.onePartContainer}>
          {props.hideBackButton ? (
            <View />
          ) : (
            <TouchableOpacity onPress={props.backHandler}>
              <Image
                source={require("../../assets/images/backIcon.png")}
                style={styles.imageIconStyle}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.secondPartContainer}>
          <TouchableOpacity>
            <Text style={styles.titleStyle}>{props.title}</Text>
          </TouchableOpacity>
          <Text style={styles.subTitleStyle}>{props.subTitle}</Text>
        </View>
        <View style={styles.thirldPartContainer}>
          {props.nextButton ? (
            <TouchableOpacity onPress={props.nextHandler}>
              <Icon
                name={"plus"}
                size={moderateScale(21)}
                color={"#FFFFFF"}
                style={{
                  paddingRight: moderateScale(18),
                  paddingTop: moderateScale(6),
                }}
              />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
};

export default Header4;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackTitleFontColor,
    width: "100%",
    height: moderateScale(110),
    borderColor: "#707070",
    borderEndWidth: moderateScale(1),
    alignItems: "center",
  },
  imageIconStyle: {
    width: moderateScale(15),
    height: moderateScale(15),
    marginTop: moderateScale(100),
  },
  headerContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    width: width,
    flexDirection: "row",
    height: moderateScale(150),
  },
  onePartContainer: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(-95),
  },
  secondPartContainer: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(Platform.OS == "ios" ? -80 : 25),
  },
  thirldPartContainer: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.Yellow,
  },
  titleStyle: {
    color: Colors.titleTextColor,
    fontFamily: "AbsaraSans-Bold",
    fontSize: moderateScale(16),
    marginTop: Platform.OS == "android" ? moderateScale(-53) : moderateScale(0),
  },
  subTitleStyle: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(20),
    marginTop: moderateScale(-100),
  },
});
