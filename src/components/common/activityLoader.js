import React, { Component, Fragment } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";

export default class ActivityLoader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { isLoading } = this.props;
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        return (
            <Fragment>
                {isLoading === true ? (
                    <View
                        style={{
                            position: "absolute",
                            right: 0,
                            left: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: "#FFFFFF",
                            opacity: 0.2,
                            height: height,
                            zIndex: 999,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <ActivityIndicator size="large" color="#7B5151" />
                    </View>
                ) : null}
            </Fragment>
        );
    }
}
