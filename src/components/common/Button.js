import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { moderateScale } from '../../helpers/ResponsiveFonts';

export default Button = (props) => {
    return (
        <>
            <TouchableOpacity onPress={props.onPress} style={[styles.pv_button, { backgroundColor: props.bgColor }, { width: props.width }, { height: props.height },{borderRadius: moderateScale(props.borderRadius)},{borderWidth:props.borderWidth},{ borderColor:props.borderColor}]}>
                <Text style={{ fontSize: moderateScale(props.fontSize), color: props.color ? props.color:'#FFF',fontFamily:props.fontFamily ? props.fontFamily:"Montserrat-Bold" }}>{props.content}</Text>
            </TouchableOpacity>
        </>
    );
}
const styles = StyleSheet.create({
    pv_button: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily:'Montserrat-Bold',
        //Add some shadows
        //w321h52
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: .36, // IOS
        shadowRadius: moderateScale(2), //IOS
        elevation: 1, // Android
    }
});