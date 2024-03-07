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
const width = Dimensions.get("screen").width;

const Header = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.onePartContainer}>
          <TouchableOpacity onPress={props.backHandler}>
            <Image
              source={require("../../assets/images/backIcon.png")}
              style={styles.imageIconStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.secondPartContainer}>
          <TouchableOpacity>
            <Text style={styles.titleStyle}>{props.title}</Text>
          </TouchableOpacity>
          <Text style={styles.subTitleStyle}>{props.subTitle}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7B5151",
    width: "100%",
    height: moderateScale(90),
    borderColor: "#707070",
    borderEndWidth: moderateScale(1),
  },
  imageIconStyle: {
    width: moderateScale(15),
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
    width: "17%",
    alignItems: "center",
  },
  secondPartContainer: {
    width: "83%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  titleStyle: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(16),
    opacity: moderateScale(0.56),
    marginBottom: moderateScale(5),
  },
  subTitleStyle: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(20),
  },
});
