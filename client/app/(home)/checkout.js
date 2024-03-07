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
import ExpoWebBrowser from "expo-web-browser/src/ExpoWebBrowser";
import * as WebBrowser from "expo-web-browser";

export default () => {

    const {getOrder, getCart} = useAppStateStore();
    const foodTruck = getOrder().foodTruck;
    const {t, i18n} = useTranslation();
    const [logo, setLogo] = useState();
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
                console.log('get payments buttons resp: ', response.data)

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

        console.log('pay payload: ', payload)

        createOrder(payload)
            .then((response) => {
                console.log('create order resp: ', response)
                payOrder(response.id)
                    .then(async (response) => {
                        console.log('pay order resp: ', response)

                        await WebBrowser.openBrowserAsync(response.data.link);
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
            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Order From"}
                    style={{
                        fontSize: 20,
                        margin: 10,
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
                        source={{uri: logo}}
                        style={{
                            width: 85,
                            height: 85,
                            borderRadius: 42.5,
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
                            marginStart: 5
                        }}
                    >
                        <TextWithFont
                            text={i18n.language === "ar" ? foodTruck.nameArb : foodTruck.nameEng}
                            style={[
                                {
                                    fontSize: 20,
                                    fontWeight: "bold",
                                },
                                i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                            ]}
                        />
                        <TextWithFont
                            text={i18n.language === "ar" ? foodTruck.descriptionArb : foodTruck.descriptionEng}
                            style={[
                                {
                                    fontSize: 16,
                                    fontWeight: "normal"
                                },
                                i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                            ]}
                        />
                    </View>
                </View>
            </View>
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
                        {title: "Subtotal", value: getOrder().subTotal},
                        {title: "Total", value: getOrder().total},
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
