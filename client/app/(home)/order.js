import {Stack, useLocalSearchParams, useSearchParams} from "expo-router";
import {FlatList, Keyboard, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "./HeaderTitleView";
import {useEffect, useState} from "react";
import {useAppStateStore} from "../../store/app-store";
import {Image} from "expo-image";
import TextWithFont from "../../component/TextWithFont";
import {MaterialIcons, Octicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

export default () => {

    const {orderId} = useLocalSearchParams();
    const {getOrder} = useAppStateStore();
    const {t, i18n} = useTranslation();
    const [order, setOrder] = useState(getOrder(orderId));

    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentStatusModified, setPaymentStatusModified] = useState([]);

    const orderStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return "#f8b91c";
            case "ACCEPTED":
                return "#28a745";
            case "REJECTED":
                return "#dc3545";
            default:
                return "#000";
        }
    }


    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    }

    const formatDateAndTime = (date) => {
        // date = 2021-08-25T14:00:00.000Z, format for example: 25/08/2021 14:00
        const split = date.split("T");
        const dateSplit = split[0].split("-");
        const timeSplit = split[1].split(":");
        return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]} ${timeSplit[0]}:${timeSplit[1]}`;
    }

    const foodTruckView = () => {

        const item = getOrder(orderId);
        const logo = findLogoImage(item.foodTruck.images);
        const totalPrice = item.items.reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
        }, 0);

        return (
            <View
                style={{
                    width: "100%",
                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    padding: 10,
                }}
            >
                <Image
                    source={{uri: logo}}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: "#f8b91c"
                    }}
                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                />
                <View
                    style={{
                        flex: 1,
                        marginLeft: 15,
                    }}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? item.foodTruck.nameArb : item.foodTruck.nameEng}
                        style={{
                            fontSize: 18,
                        }}
                    />
                    <View
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <TextWithFont
                            text={item.status}
                            style={{
                                fontSize: 16,
                                color: orderStatusColor(item.status)
                            }}
                        />
                        <TextWithFont
                            text={totalPrice.toFixed(2) + " KWD"}
                            style={{
                                fontSize: 16,
                                marginTop: 5,
                            }}
                        />
                        <TextWithFont
                            text={formatDateAndTime(item.createTime)}
                            style={{
                                fontSize: 16,
                                marginTop: 5,
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    const totalPriceInOrder = () => {
        return order.items.reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
        }, 0);
    }

    const totalVouchers = () => {
        return order.vouchers.reduce((acc, curr) => {
            return acc + curr.amount;
        }, 0);
    }

    const calculateItemPriceWithVoucher = (item) => {
        return item.price - (item.price * (totalVouchers() / totalPriceInOrder()));
    }

    return (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                width: "100%",
            }}
            contentContainerStyle={{
                flex: 1,
                width: "100%",
                alignItems: "flex-start",
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
        >
            <Stack.Screen
                options={{
                    title: i18n.language === "ar" ? "تفاصيل الطلب" : "Order Details",
                    headerTitle: () => <HeaderTitleView title={i18n.language === "ar" ? "تفاصيل الطلب" : "Order Details"} logo={null} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    },
                    headerShown: true
                }}
            />
            {foodTruckView()}
            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={i18n.language === "ar" ? 'Item(s)' : 'Item(s)'}
                    style={{
                        width: "100%",
                        fontSize: 20,
                        textAlign: "left",
                        margin: 10,
                    }}
                />
                <FlatList
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "white",
                    }}
                    contentContainerStyle={{
                        width: "100%",
                    }}
                    data={order.items}
                    renderItem={({item, index}) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    backgroundColor: "white",
                                    padding: 10,
                                    marginTop: 5,
                                }}
                            >
                                <Image
                                    source={{uri: item.image}}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: "white",
                                        padding: 5,
                                    }}
                                    shape={"circle"}
                                    contentFit={"cover"}
                                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                                />
                                <View
                                    style={{
                                        width: "50%",
                                        flexDirection: "column",
                                        alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
                                        justifyContent: "center",
                                    }}
                                >
                                    <TextWithFont
                                        text={item.name}
                                        style={[
                                            {
                                                fontSize: 18,
                                                fontWeight: "bold",
                                            },
                                            i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                        ]}
                                    />
                                    {
                                        order.vouchers.length > 0 ? (
                                            <View>
                                                <TextWithFont
                                                    text={`${calculateItemPriceWithVoucher(item)} KWD`}
                                                    style={[
                                                        {
                                                            fontSize: 14,
                                                            fontWeight: "normal"
                                                        },
                                                        i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                                        i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                                    ]}
                                                />
                                                <TextWithFont
                                                    text={item.price + " KWD"}
                                                    style={[
                                                        {
                                                            fontSize: 12,
                                                            fontWeight: "normal",
                                                            color: "gray",
                                                            textDecorationLine: "line-through"
                                                        },
                                                        i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                                        i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                                    ]}
                                                />
                                            </View>
                                        ) : (
                                            <TextWithFont
                                                text={item.price + " KWD"}
                                                style={[
                                                    {
                                                        fontSize: 14,
                                                        fontWeight: "normal"
                                                    },
                                                    i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                                    i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                                ]}
                                            />
                                        )
                                    }
                                </View>
                                <TextWithFont
                                    text={`x${item.quantity}`}
                                    style={{
                                        fontSize: 14,
                                        marginStart: 10,
                                        color: "gray"
                                    }}
                                />
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    height: 2,
                                    backgroundColor: "#efefef",
                                }}
                            />
                        );
                    }}
                    ListFooterComponent={() => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    backgroundColor: "white",
                                    marginTop: 10,
                                    flexDirection: "column",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <TextWithFont
                                        text={i18n.language === "ar" ? 'المجموع' : 'Subtotal'}
                                        style={{
                                            fontSize: 18,
                                            margin: 10,
                                        }}
                                    />
                                    <TextWithFont
                                        text={`${totalPriceInOrder()} KWD`}
                                        style={{
                                            fontSize: 18,
                                            textAlign: "center",
                                        }}
                                    />
                                </View>
                                {
                                    order.vouchers.length > 0 && (
                                        <View
                                            style={{
                                                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <TextWithFont
                                                text={i18n.language === "ar" ? 'الخصم' : 'Discount'}
                                                style={{
                                                    fontSize: 18,
                                                    margin: 10,
                                                }}
                                            />
                                            <TextWithFont
                                                text={`${totalVouchers()} KWD`}
                                                style={{
                                                    fontSize: 18,
                                                    textAlign: "center",
                                                }}
                                            />
                                        </View>
                                    )
                                }
                                <View
                                    style={{
                                        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <TextWithFont
                                        text={i18n.language === "ar" ? 'المجموع' : 'Total'}
                                        style={{
                                            fontSize: 18,
                                            margin: 10,
                                        }}
                                    />
                                    {
                                        order.vouchers.length > 0 ? (
                                            <View>
                                                <TextWithFont
                                                    text={`${totalVouchers()} KWD`}
                                                    style={{
                                                        fontSize: 18,
                                                        textAlign: "center",
                                                    }}
                                                />
                                                <TextWithFont
                                                    text={totalPriceInOrder() + " KWD"}
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                        color: "gray",
                                                        textDecorationLine: "line-through"
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <TextWithFont
                                                text={`${totalPriceInOrder()} KWD`}
                                                style={{
                                                    fontSize: 18,
                                                    textAlign: "center",
                                                }}
                                            />
                                        )
                                    }
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </KeyboardAwareScrollView>
    )
}