import {View, Text, FlatList, TouchableOpacity} from "react-native";
import {Stack, useSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../HeaderTitleView";
import OrderFromView from "../../../component/OrderFromView";
import TextWithFont from "../../../component/TextWithFont";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {useAppStateStore} from "../../../store/app-store";

export default () => {

    const params = useSearchParams();
    const [orderId, setOrderId] = useState(params.orderId);
    const {t, i18n} = useTranslation();
    const {getCart, totalPriceInCart} = useAppStateStore();

    const [vouchers, setVouchers] = useState([]);

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
                    headerTitle: () => <HeaderTitleView title={'Payment Rejected'} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    }
                }}
            />
            <View
                style={{
                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                    marginTop: 30,
                    width: "100%",
                }}
            >
                <Image
                    source={require('../../../assets/paymentLogo/payment-reject.png')}
                    style={{
                        width: 85,
                        height: 85,
                        padding: 5,
                        resizeMode: "cover",
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
                    data={getCart()}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    backgroundColor: "white",
                                    padding: 10,
                                    marginTop: 5,
                                }}
                                onPress={() => {
                                    setIsLoading(true)
                                    setSelectedItem(item)
                                    setTimeout(() => {
                                        setIsLoading(false);
                                        itemActionSheetRef.current?.show();
                                    }, 1000)
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
                                    placeholder={require("../../../assets/kwft-logo-placeholder.png")}
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
                                        vouchers.length > 0 ? (
                                            <View>
                                                <TextWithFont
                                                    text={`${item.price * item.quantity - (item.price * item.quantity * vouchers[0].discount / 100)} KWD`}
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
                            </TouchableOpacity>
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
                                    padding: 10,
                                    backgroundColor: "white",
                                    marginTop: 10,
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
                                {
                                    vouchers.length > 0 ? (
                                        <View>
                                            <TextWithFont
                                                text={`${totalPriceInCart() - (totalPriceInCart() * vouchers[0].discount / 100)} KWD`}
                                                style={{
                                                    fontSize: 18,
                                                    textAlign: "center",
                                                }}
                                            />
                                            <TextWithFont
                                                text={totalPriceInCart() + " KWD"}
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
                                            text={`${totalPriceInCart()} KWD`}
                                            style={{
                                                fontSize: 18,
                                                textAlign: "center",
                                            }}
                                        />
                                    )
                                }
                            </View>
                        )
                    }}
                />
            </View>
        </KeyboardAwareScrollView>
    )
}
