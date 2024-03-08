import {View, Text} from "react-native";
import {Stack, useSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../HeaderTitleView";
import OrderFromView from "../../../component/OrderFromView";
import TextWithFont from "../../../component/TextWithFont";

export default () => {

    const params = useSearchParams();
    const [orderId, setOrderId] = useState(params.orderId);

    return(
        <KeyboardAwareScrollView
            style={{
                flex: 1,
            }}
            contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center"
            }}
            scrollEnabled={true}
        >
            <Stack.Screen
                options={{
                    headerTitle: () => foodTruck !== null && <HeaderTitleView title={'Payment Rejected'} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    }
                }}
            />
            <View
                style={{
                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "white",
                    padding: 10,
                    marginTop: 5,
                }}
            >
                <Image
                    source={{uri: require('../../../assets/paymentLogo/payment-reject.png')}}
                    style={{
                        width: 85,
                        height: 85,
                        borderRadius: 42.5,
                        backgroundColor: "white",
                        padding: 5,
                    }}
                />
                <TextWithFont
                    text={"Payment Rejected"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
            </View>
            <OrderFromView/>
        </KeyboardAwareScrollView>
    )
}