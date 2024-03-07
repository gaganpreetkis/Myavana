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
import Colors from "../../constants/colors";
const width = Dimensions.get("screen").width;

const Header = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.onePartContainer}
          onPress={props.backHandler}
        >
          <Image
            source={require("../../assets/images/backwardIcon.png")}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        <View style={styles.onePartContainer}></View>
        <View style={styles.secondPartContainer}>
          <Text style={styles.titleStyle}>{props.title}</Text>
          <Text style={styles.subTitleStyle}>{props.subTitle}</Text>
        </View>
        <View style={styles.thirldPartContainer}>{props.headerRight}</View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackTitleFontColor,
    width: "100%",
    height: moderateScale(130),
    borderColor: "#707070",
    borderEndWidth: moderateScale(1),
  },
  imageIconStyle: {
    padding: moderateScale(5),
    width: moderateScale(10),
    height: moderateScale(15),
    marginTop: moderateScale(18),
  },
  innerContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    width: width,
    flexDirection: "row",
    marginTop: moderateScale(20),
  },
  onePartContainer: {
    width: "10%",
    alignItems: "center",
    marginTop: moderateScale(45),
  },
  secondPartContainer: {
    width: Platform.OS === "ios" ? "60%" : "62%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(50),
  },
  thirldPartContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(50),
  },
  titleStyle: {
    color: Colors.titleTextColor,
    fontFamily: "AbsaraSans-Bold",
    fontSize: moderateScale(16),
    marginBottom: moderateScale(5),
  },
  subTitleStyle: {
    color: Colors.titleTextColor,
    fontFamily: "AbsaraSans-Bold",
    fontSize: moderateScale(16),
  },
});
