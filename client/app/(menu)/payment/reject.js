import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../HeaderTitleView";
import OrderFromView from "../../../component/OrderFromView";
import TextWithFont from "../../../component/TextWithFont";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {useAppStateStore} from "../../../store/app-store";
import {forkJoin} from "rxjs";
import {fetchOrder} from "../../../services/OrderService";
import {getPaymentStatus} from "../../../services/PaymentService";
import {wantedPaymentGatewayResponse} from "../../../utils/Utils";

export default () => {

    const params = useLocalSearchParams();
    const {t, i18n} = useTranslation();
    const {getCart, totalPriceInCart, getOrder, updateOrderStatus, updateOrderTrackingId} = useAppStateStore();

    const [order, setOrder] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentStatusModified, setPaymentStatusModified] = useState([]);
    const [vouchers, setVouchers] = useState(getOrder(params.orderId).vouchers);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        setIsLoading(true);
        forkJoin([fetchOrder(params.orderId), getPaymentStatus(params.track_id)])
            .subscribe(([orderResponse, paymentStatusResponse]) => {
                setOrder(orderResponse);
                setPaymentStatus(paymentStatusResponse.data.transaction);
                setPaymentStatusModified([
                    {
                        key: "payment_id",
                        label: t("paymentDetails.payment_id"),
                        value: paymentStatusResponse.data.transaction.payment_id
                    },
                    {
                        key: "ref",
                        label: t("paymentDetails.ref"),
                        value: paymentStatusResponse.data.transaction.reference
                    },
                    {
                        key: "order_id",
                        label: t("paymentDetails.order_id"),
                        value: paymentStatusResponse.data.transaction.order_id
                    },
                    {
                        key: "requested_order_id",
                        label: t("paymentDetails.requested_order_id"),
                        value: paymentStatusResponse.data.transaction.merchant_requested_order_id
                    },
                    {
                        key: "payment_type",
                        label: t("paymentDetails.payment_type"),
                        value: paymentStatusResponse.data.transaction.payment_type
                    },
                    {
                        key: "transaction_date",
                        label: t("paymentDetails.transaction_date"),
                        value: paymentStatusResponse.data.transaction.transaction_date
                    },
                ]);

                updateOrderStatus(params.orderId, orderResponse.invoice.paymentStatus.name.toLowerCase());
                updateOrderTrackingId(params.orderId, params.track_id);
                setIsLoading(false);
            });
    }, []);

    // when language changes, update the payment status
    useEffect(() => {
        if (paymentStatus) {
            setPaymentStatusModified([
                {
                    key: "payment_id",
                    label: t("paymentDetails.payment_id"),
                    value: paymentStatus.payment_id
                },
                {
                    key: "ref",
                    label: t("paymentDetails.ref"),
                    value: paymentStatus.reference
                },
                {
                    key: "order_id",
                    label: t("paymentDetails.order_id"),
                    value: paymentStatus.order_id
                },
                {
                    key: "requested_order_id",
                    label: t("paymentDetails.requested_order_id"),
                    value: paymentStatus.merchant_requested_order_id
                },
                {
                    key: "payment_type",
                    label: t("paymentDetails.payment_type"),
                    value: paymentStatus.payment_type
                },
                {
                    key: "transaction_date",
                    label: t("paymentDetails.transaction_date"),
                    value: paymentStatus.transaction_date
                }
            ]);
        }
    }, [i18n.language]);

    const indicatorView = () => {
        return (
            <View
                style={{
                    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff"
                }}
            >
                <ActivityIndicator
                    size={"large"}
                    color={"#226377"}
                />
            </View>
        )
    }

    if (isLoading) {
        return indicatorView();
    }

    const calculateVouchers = () => {
        let lastPrice = 0;
        if (vouchers.length > 0) {
            // loop for each voucher and if check whether the voucher type is percentage of fixed, then calculate, according to the voucher type
            vouchers.forEach((voucher) => {
                if (voucher.type === "percentage") {
                    lastPrice = totalPriceInCart() - (totalPriceInCart() * voucher.discount / 100);
                } else {
                    lastPrice = totalPriceInCart() - voucher.discount;
                }
            });
        } else {
            lastPrice = totalPriceInCart();
        }
        return lastPrice;
    }

    const calculateItemPriceWithVoucher = (item) => {
        if (vouchers.length > 0) {
            vouchers.forEach((voucher) => {
                if (voucher.type === "percentage") {
                    return item.price * item.quantity - (item.price * item.quantity * voucher.discount / 100);
                }
            });
        } else {
            return item.price * item.quantity;
        }
    }

    return (<KeyboardAwareScrollView
        style={{
            flex: 1,
        }}
        contentContainerStyle={{
            justifyContent: "center", alignItems: "center"
        }}
        scrollEnabled={true}
    >
        <Stack.Screen
            options={{
                headerTitle: () => <HeaderTitleView title={'Payment Rejected'} isProfile={true}/>, headerStyle: {
                    backgroundColor: "#226377"
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
                    contentFit: "cover"
                }}
            />
            <TextWithFont
                text={"Payment Rejected"}
                style={{
                    fontSize: 20, margin: 10,
                }}
            />
        </View>
        <View
            style={{
                width: "100%", marginTop: 30,
            }}
        >
            <TextWithFont
                text={i18n.language === "ar" ? 'معلومات الدفع' : 'Payment Details'}
                style={{
                    width: "100%", fontSize: 20, textAlign: "left", margin: 10,
                }}
            />
            <FlatList
                style={{
                    width: "100%", padding: 10, backgroundColor: "white",
                }}
                contentContainerStyle={{
                    width: "100%",
                }}
                data={paymentStatusModified}
                renderItem={({item, index}) => {
                    return (<View
                        key={index}
                        style={{
                            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "white",
                            padding: 10,
                            marginTop: 5,
                        }}
                    >
                        <TextWithFont
                            text={item.label}
                            style={{
                                fontSize: 14,
                            }}
                        />
                        <TextWithFont
                            text={item.value}
                            style={{
                                fontSize: 12,
                            }}
                        />
                    </View>)
                }}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                ListEmptyComponent={indicatorView}
            />
        </View>
        <OrderFromView/>
        <View
            style={{
                width: "100%", marginTop: 30,
            }}
        >
            <TextWithFont
                text={i18n.language === "ar" ? 'Item(s)' : 'Item(s)'}
                style={{
                    width: "100%", fontSize: 20, textAlign: "left", margin: 10,
                }}
            />
            <FlatList
                style={{
                    width: "100%", padding: 10, backgroundColor: "white",
                }}
                contentContainerStyle={{
                    width: "100%",
                }}
                data={getCart()}
                renderItem={({item, index}) => {
                    return (<View
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
                                width: 50, height: 50, borderRadius: 25, backgroundColor: "white", padding: 5,
                            }}
                            shape={"circle"}
                            contentFit={"cover"}
                            placeholder={require("../../../assets/carb8-logo-placeholder.png")}
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
                                style={[{
                                    fontSize: 18, fontWeight: "bold",
                                }, i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}]}
                            />
                            {vouchers.length > 0 ? (<View>
                                <TextWithFont
                                    text={`${calculateItemPriceWithVoucher(item)} KWD`}
                                    style={[{
                                        fontSize: 14, fontWeight: "normal"
                                    }, i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"}, i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}]}
                                />
                                <TextWithFont
                                    text={item.price + " KWD"}
                                    style={[{
                                        fontSize: 12,
                                        fontWeight: "normal",
                                        color: "gray",
                                        textDecorationLine: "line-through"
                                    }, i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"}, i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}]}
                                />
                            </View>) : (<TextWithFont
                                text={item.price + " KWD"}
                                style={[{
                                    fontSize: 14, fontWeight: "normal"
                                }, i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"}, i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}]}
                            />)}
                        </View>
                        <TextWithFont
                            text={`x${item.quantity}`}
                            style={{
                                fontSize: 14, marginStart: 10, color: "gray"
                            }}
                        />
                    </View>)
                }}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => {
                    return (<View
                        style={{
                            width: "100%", height: 2, backgroundColor: "#efefef",
                        }}
                    />);
                }}
                ListFooterComponent={() => {
                    return (<View
                        style={{
                            width: "100%", backgroundColor: "white", marginTop: 10, flexDirection: "column",
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
                                    fontSize: 18, margin: 10,
                                }}
                            />
                            <TextWithFont
                                text={`${totalPriceInCart()} KWD`}
                                style={{
                                    fontSize: 18, textAlign: "center",
                                }}
                            />
                        </View>
                        {vouchers.length > 0 && (<View
                            style={{
                                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <TextWithFont
                                text={i18n.language === "ar" ? 'الخصم' : 'Discount'}
                                style={{
                                    fontSize: 18, margin: 10,
                                }}
                            />
                            <TextWithFont
                                text={`${calculateVouchers()} KWD`}
                                style={{
                                    fontSize: 18, textAlign: "center",
                                }}
                            />
                        </View>)}
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
                                    fontSize: 18, margin: 10,
                                }}
                            />
                            {vouchers.length > 0 ? (<View>
                                <TextWithFont
                                    text={`${calculateVouchers()} KWD`}
                                    style={{
                                        fontSize: 18, textAlign: "center",
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
                            </View>) : (<TextWithFont
                                text={`${totalPriceInCart()} KWD`}
                                style={{
                                    fontSize: 18, textAlign: "center",
                                }}
                            />)}
                        </View>
                    </View>)
                }}
            />
        </View>
    </KeyboardAwareScrollView>)
}
