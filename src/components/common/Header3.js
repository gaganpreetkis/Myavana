import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { moderateScale } from "../../helpers/ResponsiveFonts";
import Colors from "../../constants/colors";
const width = Dimensions.get("screen").width;

const Header3 = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* <TouchableOpacity style={styles.onePartContainer} onPress={props.backHandler}>
                    <Image source={require('../../assets/images/backwardIcon.png')} style={styles.imageIconStyle} />
                </TouchableOpacity> */}

        <View style={styles.secondPartContainer}>
          <Text style={styles.titleStyle}>{props.title}</Text>
        </View>
        <View style={styles.thirldPartContainer} />
      </View>
    </View>
  );
};

export default Header3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackTitleFontColor,
    width: "100%",
    height: moderateScale(120),
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
  },
  secondPartContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(55),
  },
  thirldPartContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    color: Colors.titleTextColor,
    fontFamily: "AbsaraSans-Bold",
    fontSize: moderateScale(16),
    marginBottom: moderateScale(5),
  },
  subTitleStyle: {
    color: Colors.titleTextColor,
    fontFamily: "AbsaraSans-Regular",
    fontSize: moderateScale(16),
  },
});
