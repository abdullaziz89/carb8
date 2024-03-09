import {useAppStateStore} from "../../store/app-store";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Link, Stack} from "expo-router";
import HeaderTitleView from "./HeaderTitleView";
import {ActivityIndicator, FlatList, TextInput, TouchableOpacity, View, StyleSheet} from "react-native";
import TextWithFont from "../../component/TextWithFont";
import {Image} from "expo-image";
import {useEffect, useState} from "react";
import {AntDesign} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {createOrder, payOrder} from "../../services/PaymentService";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import OrderFromView from "../../component/OrderFromView";

export default () => {

    const {getOrders, getCart, updateItemIdInOrders} = useAppStateStore();

    const getListPostedOrder = () => {
        // compare orders from getOrders by createTime and get the newest one and the order status pending
        return getOrders().filter((order) => {
            return order.status === "pending";
        }).sort((a, b) => {
            return new Date(b.createTime) - new Date(a.createTime);
        })[0];
    }

    const foodTruck = getListPostedOrder().foodTruck;
    const {t, i18n} = useTranslation();
    const [logo, setLogo] = useState(null);
    const [customerPhone, setCustomerPhone] = useState("98877449");
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [paymentButtonsIcons, setPaymentButtonsIcons] = useState([
        {
            key: "knet",
            label: "KNET",
            icon: () => {
                return <Image
                    source={require("../../assets/paymentLogo/knet-logo.png")}
                    style={[
                        {
                            width: 24,
                            height: 24,
                            backgroundColor: "white",
                            padding: 5,
                        },
                        styles.paymentButtonIcon
                    ]}
                    contentFit={"contain"}
                />
            },
            method: "knet"
        }, {
            key: "apple_pay",
            label: "Apple Pay",
            icon: () => {
                return <Image
                    source={require("../../assets/paymentLogo/apple-pay.png")}
                    style={[
                        {
                            width: 24,
                            height: 24,
                            backgroundColor: "white",
                            padding: 5,
                        },
                        styles.paymentButtonIcon
                    ]}
                    contentFit={"contain"}
                />
            },
            method: " apple-pay"
        }, {
            key: "google_pay",
            label: "Google Pay",
            icon: () => {
                return <Image
                    source={require("../../assets/paymentLogo/google-pay.png")}
                    style={[
                        {
                            width: 24,
                            height: 24,
                            backgroundColor: "white",
                            padding: 5,
                        },
                        styles.paymentButtonIcon
                    ]}
                    contentFit={"contain"}
                />
            },
            method: "google-pay"
        },
        {
            key: "samsung_pay",
            label: "Samsung Pay",
            icon: () => {
                return <Image
                    source={require("../../assets/paymentLogo/samsung-pay.png")}
                    style={[
                        {
                            width: 24,
                            height: 24,
                            backgroundColor: "white",
                            padding: 5,
                        },
                        styles.paymentButtonIcon
                    ]}
                    contentFit={"contain"}
                />
            },
            method: "samsung-pay"
        },
        {
            key: "credit_card",
            label: "Credit Card",
            icon: () => <AntDesign name="creditcard" size={24} color="black"/>,
            method: "cc"
        }
    ]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const [paymentButtonsLoading, setPaymentButtonsLoading] = useState(true);

    // for payment after redirect from server
    const [paymentRedirectData, setPaymentRedirectData] = useState(null);

    useEffect(() => {

        setLogo(findLogoImage(foodTruck.images));

        const getPaymentsButtons = async () => {

            const headers = {
                "Authorization": "Bearer 03795eea5d39bf173cb30cff404b51084f8f1b56",
                "Accept": "application/json",
            }

            return await axios.get("https://uapi.upayments.com/api/v1/check-payment-button-status", {
                headers: headers
            });
        }

        getPaymentsButtons()
            .then((response) => {

                setPaymentButtonsLoading(false);

                let payButton = response.data.data.payButtons;

                // remove false value from the object
                payButton = Object.keys(payButton).filter((key) => {
                    return payButton[key];
                })

                setPaymentMethod(payButton.map((button) => {
                    return paymentButtonsIcons.find((icon) => {
                        return icon.key === button;
                    })
                }))
            })
            .catch((error) => {
                setPaymentButtonsLoading(false);
                console.log('get payments buttons error resp: ', error)
            });
    }, []);

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    }

    const handleRedirect = (url) => {
        console.log('handleRedirect: ', url)
    }

    const addListener = async () => {
        Linking.addEventListener("url", handleRedirect);
    }

    const openAuthSessionAsync = async (url) => {
        try {

            addListener();
            let result = await WebBrowser.openBrowserAsync(url);

            if (result.type === "success") {
                setPaymentRedirectData(result);
            } else {
                console.log('openAuthSessionAsync error: ', result)
            }
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            console.log('openAuthSessionAsync error: ', error)
        }
    }

    const pay = () => {

        const payload = {
            paymentMethod: selectedPaymentMethod.method,
            customer: {
                phone: customerPhone,
            },
            products: getCart().map((item) => {
                return {
                    name: item.name,
                    description: item.name,
                    price: item.price,
                    quantity: item.quantity,
                }
            }),
            foodTruckId: foodTruck.id,
        }

        createOrder(payload)
            .then((response) => {
                console.log('create order resp: ', response)
                updateItemIdInOrders(getListPostedOrder().id, {
                    ...getListPostedOrder(),
                    id: response.id,
                })
                payOrder(response.id)
                    .then(async (response) => {
                        await openAuthSessionAsync(response.data.link)
                    })
                    .catch((error) => {
                        console.log('pay order error resp: ', error)
                    });
            })
            .catch((error) => {
                console.log('create order error resp: ', error)
            });
    }

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{
                backgroundColor: '#efefef',
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 10,
                paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
        >
            <Stack.Screen
                options={{
                    title: foodTruck && foodTruck.nameEng,
                    headerTitle: () => foodTruck !== null &&
                        <HeaderTitleView title={'Checkout'} logo={logo} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    }
                }}
            />
            <OrderFromView/>
            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Contact Information"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: "center",
                        backgroundColor: "white",
                        padding: 10,
                        marginTop: 5,
                    }}
                >
                    <TextWithFont
                        text={i18n.t("Phone Number")}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <TextInput
                        style={{
                            width: "100%",
                            height: 40,
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 5,
                            marginTop: 10,
                        }}
                        onChangeText={setCustomerPhone}
                        value={customerPhone}
                        keyboardType={"phone-pad"}
                    />
                </View>
            </View>

            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Order Summary"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <FlatList
                    data={[
                        {title: "Subtotal", value: getListPostedOrder().subTotal},
                        {title: "Total", value: getListPostedOrder().total},
                    ]}
                    style={{
                        width: "100%",
                    }}
                    scrollEnabled={false}
                    renderItem={({item, index}) => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "white",
                                    padding: 10,
                                }}
                            >
                                <TextWithFont
                                    text={item.title}
                                    style={{
                                        fontSize: 16,
                                        margin: 10,
                                    }}
                                />
                                <TextWithFont
                                    text={`${item.value} KWD`}
                                    style={{
                                        fontSize: 16,
                                        margin: 10,
                                    }}
                                />
                            </View>
                        )
                    }}
                />
            </View>

            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Payments"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <FlatList
                    data={paymentButtonsLoading ? [{id: "loading"}] : paymentMethod}
                    style={{
                        width: "100%",
                    }}
                    scrollEnabled={false}
                    renderItem={({item, index}) => {
                        if (paymentButtonsLoading) {
                            return (
                                <View
                                    style={{
                                        width: "100%",
                                        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        backgroundColor: "white",
                                        padding: 10,
                                    }}
                                >
                                    <ActivityIndicator size="small" color="#0000ff"/>
                                </View>
                            )
                        } else {
                            return (
                                <TouchableOpacity
                                    style={[
                                        {
                                            width: "100%",
                                            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            backgroundColor: "white",
                                            padding: 10,
                                        },
                                        selectedPaymentMethod && selectedPaymentMethod.key === item.key ? {backgroundColor: "#f8b91c"} : {}
                                    ]}
                                    onPress={() => {
                                        setSelectedPaymentMethod(item);
                                    }}
                                >
                                    {item.icon()}
                                    <TextWithFont
                                        text={item.label}
                                        style={[
                                            {
                                                fontSize: 16,
                                                margin: 10,
                                                marginStart: 10,
                                            },
                                            selectedPaymentMethod && selectedPaymentMethod.key === item.key ? {color: "white"} : {color: "black"}
                                        ]}
                                    />
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
            </View>
            <TouchableOpacity
                style={[
                    {
                        width: "100%",
                        padding: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 30,
                    },
                    selectedPaymentMethod === null || customerPhone === "" || customerPhone.length < 8 ? {backgroundColor: "gray"} : {backgroundColor: "#f8b91c"}
                ]}
                onPress={pay}
                disabled={selectedPaymentMethod === null || customerPhone === "" || customerPhone.length < 8}
            >
                <TextWithFont
                    text={i18n.language === "ar" ? 'الدفع' : 'Checkout'}
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white"
                    }}
                />
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    paymentButtonIcon: {
        aspectRatio: 1,
        objectFit: "contain",
        mixBlendMode: "color-burn",
    }
});
