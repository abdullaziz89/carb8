import {Stack, useSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../HeaderTitleView";
import {useAppStateStore} from "../../../store/app-store";
import OrderFromView from "../../../component/OrderFromView";
import {View} from "react-native";
import TextWithFont from "../../../component/TextWithFont";

export default () => {

    const params = useSearchParams();
    const [orderId, setOrderId] = useState(params.orderId);
    const {getOrder, getCart} = useAppStateStore();
    const foodTruck = getOrder().foodTruck;

    return (
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
                    headerTitle: () => foodTruck !== null &&
                        <HeaderTitleView title={'Payment Success'} isProfile={true}/>,
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
                    source={{uri: require('../../../assets/paymentLogo/payment-success.gif')}}
                    style={{
                        width: 85,
                        height: 85,
                        borderRadius: 42.5,
                        backgroundColor: "white",
                        padding: 5,
                    }}
                />
                <TextWithFont
                    text={"Payment Success"}
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